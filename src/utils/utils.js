export function renderLoading(
  isLoading,
  button,
  originalText = "Save",
  loadingText = "Saving..."
) {
  const buttonText = button.querySelector(".modal__btn-text");

  if (isLoading) {
    buttonText.textContent = loadingText;
  } else {
    buttonText.textContent = originalText;
  }
}

export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();

  const submitButton = evt.submitter;
  const buttonText = submitButton.querySelector(".modal__btn-text");
  const originalText = submitButton.textContent;

  renderLoading(true, submitButton, originalText, loadingText);

  request()
    .then(() => {
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton, originalText);
    });
}