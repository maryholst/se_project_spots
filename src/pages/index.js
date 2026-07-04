import "../pages/index.css";
import { settings } from "../scripts/validation.js";
import { enableValidation } from "../scripts/validation.js";
import { resetValidation } from "../scripts/validation.js";
import { Api } from "../utils/Api.js";

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

let userId;
let cardToDelete = null;

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
const deleteCloseBtn = deleteModal.querySelector(".modal__close-delete");
const deleteCancelBtn = deleteModal.querySelector(".modal__cancel-btn");
const deleteConfirmBtn = document.querySelector(".modal__delete-btn");

const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const likeBtn = cardElement.querySelector(".card__like-button");

  likeBtn.addEventListener("click", function (evt) {
  const isLiked = evt.target.classList.contains("card__like-button_active");

  api.handleLikes(data._id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_active");
    })
    .catch((err) => console.error(err));
});

  const deleteBtn = cardElement.querySelector(".card__delete-button");

  deleteBtn.addEventListener("click", function () {
    cardToDelete = cardElement;
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

function renderLoading(form, isLoading, defaultText = "Save") {
  const button = form.querySelector(".modal__submit-btn");

  if (!button) return;

  if (isLoading) {
    button.textContent = "Saving...";
    button.disabled = true;
  } else {
    button.textContent = defaultText;
    button.disabled = false;
  }
}

function handleDeleteCard(evt) {
  evt.preventDefault();
  openModal(deleteModal);
}

function handleLikes(evt, id) {
  evt.target.classList.toggle("card__like-button_active");
}

editProfile.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, settings);
  openModal(editProfileModal);
});

editModalClose.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPost.addEventListener("click", function () {
  openModal(newPostModal);
});

newModalClose.addEventListener("click", function () {
  closeModal(newPostModal);
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

previewCloseBtn.addEventListener("click", () => closeModal(previewModal));
const modalList = document.querySelectorAll(".modal");

avatarEditBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteConfirmBtn.addEventListener("click", function () {
  if (cardToDelete) {
    cardToDelete.remove();
    cardToDelete = null;
  }
  closeModal(deleteModal);
});

deleteCancelBtn.addEventListener("click", function () {
  closeModal(deleteModal);
});

deleteCloseBtn.addEventListener("click", function () {
  closeModal(deleteModal);
});

modalList.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModal(modal);
    }
  });
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((userData) => {
      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;

      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const newCard = {
    name: captionInput.value,
    link: imageInput.value,
  };

  renderLoading(addCardForm, true);

  api
    .addCard(newCard)
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);

      closeModal(newPostModal);
      addCardForm.reset();
      resetValidation(addCardForm, settings);
    })
    .catch((err) => {
      console.error("Failed to add card:", err);
    })
    .finally(() => {
      renderLoading(addCardForm, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  console.log(avatarInput.value);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      console.log(data.avatar);
    })
    .catch(console.error);
}

addCardForm.addEventListener("submit", handleNewPostSubmit);

enableValidation(settings);

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "87ebdb0f-9e77-448f-b755-fc19199d7faf",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([userData, cards]) => {
    profileDescriptionEl.textContent = userData.about;
    profileAvatar.src = userData.avatar;
    profileAvatar.alt = userData.avatar;
    profileNameEl.textContent = userData.name;
    userId = userData._id;

    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })

  .catch((err) => {
    console.error("Failed to load app data:", err);
  });
