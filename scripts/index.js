editProfile = document.querySelector(".profile__edit-btn")

editProfileModal = document.querySelector("#edit-profile-modal")

editModalClose = editProfileModal.querySelector(".modal__close")

newPost = document.querySelector(".profile__add-btn")

newPostModal = document.querySelector("#new-post-modal")

newModalClose = newPostModal.querySelector(".modal__close")

editProfile.addEventListener("click", function() {
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