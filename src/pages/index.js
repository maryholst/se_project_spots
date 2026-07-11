import "../pages/index.css";
import { settings } from "../scripts/validation.js";
import { enableValidation } from "../scripts/validation.js";
import { resetValidation } from "../scripts/validation.js";
import { Api } from "../utils/Api.js";
import { handleSubmit } from "../utils/utils.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "87ebdb0f-9e77-448f-b755-fc19199d7faf",
    "Content-Type": "application/json",
  },
});

const editProfile = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editModalClose = editProfileModal.querySelector(".modal__close");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const editProfileNameInput = editProfileModal.querySelector("#name-input");
const editProfileDescriptionInput =
  editProfileModal.querySelector("#description-input");
const profileAvatar = document.querySelector(".profile__avatar");
const modalList = document.querySelectorAll(".modal");

let userId;
let selectedCard = null;
let selectedCardId = null;

const newPost = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newModalClose = newPostModal.querySelector(".modal__close");
const addCardForm = newPostModal.querySelector(".modal__form");
const imageInput = newPostModal.querySelector("#card-image");
const captionInput = newPostModal.querySelector("#card-caption");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector("#edit-avatar-form");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarEditBtn = document.querySelector(".profile__avatar-btn");

const deleteModal = document.querySelector("#delete-modal");
const deleteCloseButton = document.querySelector(".modal__close-delete");
const deleteCancelBtn = deleteModal.querySelector(".modal__cancel-btn");
const deleteConfirmBtn = deleteModal.querySelector(".modal__delete-btn");

const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

const closeButtons = document.querySelectorAll(".modal__close");

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");

  button.addEventListener("click", () => {
    closeModal(modal);
  });
});

function getCardElement(data) {
  console.log("Data");

  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const likeBtn = cardElement.querySelector(".card__like-button");
  const deleteBtn = cardElement.querySelector(".card__delete-button");

  if (data.isLiked) likeBtn.classList.add("card__like-button_active");

  likeBtn.addEventListener("click", function () {
    const isCurrentlyLiked = likeBtn.classList.contains(
      "card__like-button_active",
    );

    api
      .handleLikes(data._id, isCurrentlyLiked)
      .then((updatedCard) => {
        console.log("updated card:", updatedCard);

        likeBtn.classList.toggle(
          "card__like-button_active",
          updatedCard.isLiked,
        );
      })
      .catch(console.error);
  });

  deleteBtn.addEventListener("click", function () {
    selectedCard = cardElement;
    selectedCardId = data._id;

    openModal(deleteModal);
  });

  cardImageEl.addEventListener("click", function () {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;

    openModal(previewModal);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");

    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

//====HANDLERS====//

function handleAvatarSubmit(evt) {
  handleSubmit(() => {
    return api
      .editAvatarInfo({
        avatar: avatarInput.value,
      })
      .then((data) => {
        profileAvatar.src = data.avatar;
        closeModal(avatarModal);
      });
  }, evt);
}

function handleProfileFormSubmit(evt) {
  handleSubmit(() => {
    return api
      .editUserInfo({
        name: editProfileNameInput.value,
        about: editProfileDescriptionInput.value,
      })
      .then((userData) => {
        profileNameEl.textContent = userData.name;
        profileDescriptionEl.textContent = userData.about;
        closeModal(editProfileModal);
      });
  }, evt);
}

function handleAddCardSubmit(evt) {
  handleSubmit(() => {
    return api
      .addCard({
        name: captionInput.value,
        link: imageInput.value,
      })
      .then((cardData) => {
        console.log("CARD RETURNED", cardData);

        const newCard = getCardElement(cardData);
        cardsList.prepend(newCard);
        closeModal(newPostModal);
      });
  }, evt);
}

editProfile.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, settings);
  openModal(editProfileModal);
});

newPost.addEventListener("click", function () {
  openModal(newPostModal);
});

avatarEditBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

deleteConfirmBtn.addEventListener("click", () => {
  if (!selectedCardId) return;

  const deleteText = deleteConfirmBtn.querySelector(".modal__delete-text");
  const originalText = deleteText.textContent;

  deleteText.textContent = "Deleting...";
  deleteConfirmBtn.disabled = true;

  const cardElement = cardTemplate.cloneNode(true);
  cardElement.remove();

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      selectedCard = null;
      selectedCardId = null;

      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      deleteText.textContent = originalText;
      deleteConfirmBtn.disabled = false;
    });
});

deleteCancelBtn.addEventListener("click", function () {
  closeModal(deleteModal);
});

editProfileForm.addEventListener("submit", handleProfileFormSubmit);

avatarForm.addEventListener("submit", handleAvatarSubmit);

addCardForm.addEventListener("submit", handleAddCardSubmit);

modalList.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModal(modal);
    }
  });
});

api
  .getAppInfo()
  .then(([userData, cards]) => {
    userId = userData._id;

    profileDescriptionEl.textContent = userData.about;
    profileAvatar.src = userData.avatar;
    profileNameEl.textContent = userData.name;

    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })

  .catch((err) => {
    console.error("Failed to load app data:", err);
  });

  enableValidation(settings);