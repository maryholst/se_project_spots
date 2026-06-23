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
const editProfileDescriptionInput = editProfileModal.querySelector("#description-input");
const profileAvatar = document.querySelector(".profile__avatar");

let userId;

const newPost = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newModalClose = newPostModal.querySelector(".modal__close");
const addCardForm = newPostModal.querySelector('.modal__form');
const imageInput = newPostModal.querySelector('#card-image');
const captionInput = newPostModal.querySelector('#card-caption');

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

  likeBtn.addEventListener("click", function () {
    likeBtn.classList.toggle("card__like-button_active");
  });

  const deleteBtn = cardElement.querySelector(".card__delete-button");
  deleteBtn.addEventListener("click", function () {
    cardElement.remove();
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

  if (isLoading) {
    button.textContent = "Saving...";
    button.disabled = true;
  } else {
    button.textContent = defaultText;
    button.disabled = false;
  }
}

editProfile.addEventListener("click", function() {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, settings);
  openModal(editProfileModal);
});

editModalClose.addEventListener("click", function() {
   closeModal(editProfileModal);
});

newPost.addEventListener("click", function() {
  openModal(newPostModal);
});

newModalClose.addEventListener("click", function() {
  closeModal(newPostModal);
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

previewCloseBtn.addEventListener("click", () => closeModal(previewModal));  
const modalList = document.querySelectorAll(".modal");

modalList.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModal(modal);
    }
  });
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  api.editUserInfo({
    name: editProfileNameInput.value,
    about: editProfileDescriptionInput.value
  })
  .then((userData) => {
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;

    closeModal(editProfileModal);
  })
  .catch(console.error);
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const newCard = {
    name: captionInput.value,
    link: imageInput.value
  };

  renderLoading(addCardForm, true)

  api.addCard(newCard)
  .then((cardData) => {
    const cardElement = getCardElement(cardData);
    cardsList.prepend(cardElement);
  
  closeModal(newPostModal);
  addCardForm.reset();
  resetValidation(addCardForm, settings);
})
.catch((err) => {
  console.error("Failed to add card:", err)
})
.finally(() => {
  renderLoading(addCardForm, false);
});
}

addCardForm.addEventListener("submit", handleNewPostSubmit);

enableValidation(settings);

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c56e30dc-2883-4270-a59e-b2f7bae969c6",
    "Content-Type": "application/json"
  }
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