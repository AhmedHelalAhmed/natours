const User = require('../models/userModel');
const factory = require('./handlerFactory');

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
exports.createUser = (request, response) => {
  response.status(INTERNAL_SERVER_ERROR).json({
    status: ERROR_STATUS,
    message: 'This route is not defined! please use /signup instead',
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

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
// Do not update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
