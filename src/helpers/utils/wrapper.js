/* eslint-disable no-shadow */
const { BadRequestError, InternalServerError, NotFoundError } = require('../error');
const { ERROR: httpError } = require('../status_code');

const data = (data) => ({ err: null, data });
const error = (err) => ({ err, data: null });

const checkErrorCode = (error) => {
  switch (error.constructor) {
    case BadRequestError:
      return httpError.BAD_REQUEST;
    case InternalServerError:
      return httpError.INTERNAL_ERROR;
    case NotFoundError:
      return httpError.NOT_FOUND;
    default:
      return httpError.INTERNAL_ERROR;
  }
};

const response = (h, status, result, message = '', code = 200) => {
  if (status === 'fail') {
    const response = h.response({
      status,
      message: result.err.message || message,
    });
    response.code(checkErrorCode(result.err));

    return response;
  }

  const response = h.response({
    status,
    data: result.data,
    message,
  });
  response.code(code);

  return response;
};

module.exports = {
  data,
  error,
  response,
};
