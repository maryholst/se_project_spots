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



editProfile.addEventListener("click", function() {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  editProfileModal.classList.add("modal_is-opened");
});

editModalClose.addEventListener("click", function() {
  editProfileModal.classList.remove("modal_is-opened");
});

newPost.addEventListener("click", function() {
  newPostModal.classList.add("modal_is-opened");
});

newModalClose.addEventListener("click", function() {
  newPostModal.classList.remove("modal_is-opened");
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);