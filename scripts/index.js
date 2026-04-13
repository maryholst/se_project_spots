const editProfile = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editModalClose = editProfileModal.querySelector(".modal__close");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const editProfileNameInput = editProfileModal.querySelector("#name-input");
const editProfileDescriptionInput = editProfileModal.querySelector("#description-input");


const newPost = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newModalClose = newPostModal.querySelector(".modal__close");
const addCardForm = newPostModal.querySelector('.modal__form');
const imageInput = newPostModal.querySelector('#card-image');
const captionInput = newPostModal.querySelector('#card-caption');

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

editProfile.addEventListener("click", function() {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
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

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  console.log(imageInput.value, captionInput.value);
  closeModal(newPostModal);
}

addCardForm.addEventListener("submit", handleNewPostSubmit);