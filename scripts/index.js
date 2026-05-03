const initialCards = [
  {
  name: "Val Thorens",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"
},
{
  name: "Restaurant terrace",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"
},
{
  name: "An outdoor cafe",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"
},
{
  name: "A very long bridge, over the forest and through the trees",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"
},
{
  name: "Tunnel with morning light",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"
},
{
  name: "Mountain house",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"
},
{
  name: "Golden Gate Bridge",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"
}
];

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

previewCloseBtn.addEventListener('click', () => closeModal(previewModal));

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const newCard = {
    name: captionInput.value,
    link: imageInput.value
  };

  const cardElement = getCardElement(newCard);
  
  cardsList.prepend(cardElement);
  
  closeModal(newPostModal);
  addCardForm.reset();
}

addCardForm.addEventListener("submit", handleNewPostSubmit);

initialCards.forEach(function (item) {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});