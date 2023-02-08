const { INTERNAL_SERVER_ERROR } = require('../enums/httpResponse');

exports.getAllUsers = (request, response) => {
  response.status(INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not defined!',
  });
};
exports.createUser = (request, response) => {
  response.status(INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not defined!',
  });
};
exports.getUser = (request, response) => {
  response.status(INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not defined!',
  });
};
exports.updateUser = (request, response) => {
  response.status(INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not defined!',
  });
};
exports.deleteUser = (request, response) => {
  response.status(INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not defined!',
  });
};
