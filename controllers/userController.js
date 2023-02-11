const { INTERNAL_SERVER_ERROR } = require('../enums/httpResponse');
const { ERROR_STATUS } = require('../enums/status');

exports.getAllUsers = (request, response) => {
  response.status(INTERNAL_SERVER_ERROR).json({
    status: ERROR_STATUS,
    message: 'This route is not defined!',
  });
};
exports.createUser = (request, response) => {
  response.status(INTERNAL_SERVER_ERROR).json({
    status: ERROR_STATUS,
    message: 'This route is not defined!',
  });
};
exports.getUser = (request, response) => {
  response.status(INTERNAL_SERVER_ERROR).json({
    status: ERROR_STATUS,
    message: 'This route is not defined!',
  });
};
exports.updateUser = (request, response) => {
  response.status(INTERNAL_SERVER_ERROR).json({
    status: ERROR_STATUS,
    message: 'This route is not defined!',
  });
};
exports.deleteUser = (request, response) => {
  response.status(INTERNAL_SERVER_ERROR).json({
    status: ERROR_STATUS,
    message: 'This route is not defined!',
  });
};
