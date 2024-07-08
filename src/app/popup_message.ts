export const popup_message = {
  missing_prompt: {
    title: 'Missing prompt',
    message: 'You must provide a prompt.',
  },
  editImage: {
    title: 'Edit Image',
    message: 'To edit the image, you must drag your mouse to select the area where you want to add or remove an element. We recommend selecting a slightly larger area than the element you intend to add, as the inserted object may not occupy the entire selection. You must also enter a prompt that describes the entire image along with the specific addition or removal that needs to be done.',
  },
  error: {
    title: 'Error',
    message: 'An error has occurred.'
  },
  file_chooser: {
    title: 'File chooser information',
    message: 'You must select PNG images that are square in proportions. The image file size must not exceed 4 MB.'
  },
  terminate_edit: {
    title: 'Terminate edit',
    message: 'Please finish editing by clicking the appropriate button to proceed.'
  },
  openAI_client_error: {
    title: 'OpenAI client error',
    message: 'OpenAI is currently unavailable on the server side. Please try verifying the correctness of your API key.'
  },
  openAI_generation_error: {
    title: 'OpenAI generation error',
    message: 'Failed to generate the image. Check the console for more details.'
  },
  openAI_edit_error: {
    title: 'OpenAI edit error',
    message: 'Please ensure you have met all the requirements for image editing.'
  },
  missing_apiKey: {
    title: 'OpenAI missing apikey',
    message: 'You must enter your API key in the settings to proceed with using the app.'
  },
  change_apiKey: {
    title: 'Attention, you are modifying the API key',
    message: 'You are about to modify your API key. This action is irreversible, please ensure you enter the new API key correctly before proceeding.'
  }
};
