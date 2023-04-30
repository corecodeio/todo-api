const validator = (request, response, next) => {
  if (!request.body.title || !request.body.description) {
    return response.status(400).send({
      message: 'Both title and description are required fields.',
    });
  }

  next();
};

export default validator;
