function renderLoading(isLoading, button, buttonText='Save', loadingText='Saving...') {
  if (isLoading) {
    button.textContent = loadingText
  } else {
    button.textContent = buttonText
  }
}

export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();

  const submitButton = evt.submitter;
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