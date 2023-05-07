const postValidator = (request, response, next) => {
  if (!request.body.title || !request.body.description) {
    return response.status(400).send({
      message: 'Both title and description are required fields.',
    });
  }
  if (typeof request.body.title !== 'string') {
    return response.status(400).send({
      message: 'title expected to be string.',
    });
  }
  if (typeof request.body.description !== 'string') {
    return response.status(400).send({
      message: 'description expected to be string.',
    });
  }

  next();
};

const patchValidator = (request, response, next) => {
  if (
    typeof request.body.isDone == 'undefined' &&
    typeof request.body.title == 'undefined' &&
    typeof request.body.description == 'undefined'
  ) {
    return response.status(400).send({
      message: 'At least one field should be updated.',
    });
  }
  if (typeof request.body.isDone !== 'undefined') {
    if (typeof request.body.isDone !== 'boolean') {
      return response.status(400).send({
        message: 'isDone expected to be boolean.',
      });
    }
    request.body.isDone = Number(request.body.isDone);
  }
  if (request.body.title) {
    if (typeof request.body.title !== 'string') {
      return response.status(400).send({
        message: 'title expected to be string.',
      });
    }
  }
  if (request.body.description) {
    if (typeof request.body.description !== 'string') {
      return response.status(400).send({
        message: 'description expected to be string.',
      });
    }
  }
  next();
};

export { postValidator, patchValidator };
