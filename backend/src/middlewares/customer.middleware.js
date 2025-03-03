const { body, validationResult } = require('express-validator');

exports.validateCustomerCreation = [
  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),
  body('shortName')
    .trim()
    .notEmpty()
    .withMessage('Short name is required'),
  body('clientNumber')
    .trim()
    .notEmpty()
    .withMessage('Client number is required'),
  body('clientTypeCode')
    .trim()
    .notEmpty()
    .withMessage('Client type code is required'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive'),
  body('contractsCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Contracts count must be a non-negative integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateCustomerUpdate = [
  body('companyName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company name cannot be empty'),
  body('shortName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Short name cannot be empty'),
  body('clientNumber')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Client number cannot be empty'),
  body('clientTypeCode')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Client type code cannot be empty'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive'),
  body('contractsCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Contracts count must be a non-negative integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 