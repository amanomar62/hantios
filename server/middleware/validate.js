const { validationResult } = require('express-validator');

/**
 * Middleware runner to validate input using express-validator
 * @param {Array} validations Array of express-validator rules
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors: { field: 'name', message: 'error message' }
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));

    return res.status(400).json({
      error: 'Validation failed',
      details: formattedErrors
    });
  };
};

module.exports = validate;
