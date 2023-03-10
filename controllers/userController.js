const User = require('../models/userModel');
const {
  INTERNAL_SERVER_ERROR,
  ON_CONTENT,
  BAD_REQUEST,
  OK,
} = require('../enums/httpResponse');
const { ERROR_STATUS, SUCCESS_STATUS } = require('../enums/status');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((field) => {
    if (allowedFields.includes(field)) {
      newObj[field] = obj[field];
    }
  });
  return newObj;
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  // SEND RESPONSE
  res.status(OK).json({
    status: SUCCESS_STATUS,
    results: users.length,
    data: {
      users,
    },
  });
});
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

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        BAD_REQUEST
      )
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, // to return new object => the fresh one
    runValidators: true,
  });
  res.status(OK).json({
    status: SUCCESS_STATUS,
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(ON_CONTENT).json({
    status: SUCCESS_STATUS,
    data: null,
  });
});
