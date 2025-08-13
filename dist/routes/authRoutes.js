"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
router.post('/create-account', (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre no puede ir vacío'), (0, express_validator_1.body)('email').isEmail().withMessage('Email no válido'), (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 caracteres'), (0, express_validator_1.body)('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Los passwords no son iguales');
    }
    return true;
}), validation_1.handleInputErrors, AuthController_1.AuthController.createAccount);
router.post('/confirm-account', (0, express_validator_1.body)("token").notEmpty().withMessage("El token no puede ir vacio"), validation_1.handleInputErrors, AuthController_1.AuthController.confirmAccount);
router.post('/login', (0, express_validator_1.body)('email').isEmail().withMessage('Email no válido'), (0, express_validator_1.body)('password').notEmpty().withMessage('El password es obligatorio'), validation_1.handleInputErrors, AuthController_1.AuthController.login);
router.post('/request-code', (0, express_validator_1.body)('email').isEmail().withMessage('Email no válido'), validation_1.handleInputErrors, AuthController_1.AuthController.requestConfirmationCode);
router.post('/forgot-password', (0, express_validator_1.body)('email').isEmail().withMessage('Email no válido'), validation_1.handleInputErrors, AuthController_1.AuthController.forgotPassword);
router.post('/validate-token', (0, express_validator_1.body)('token').notEmpty().withMessage('El token es obligatorio'), validation_1.handleInputErrors, AuthController_1.AuthController.validateToken);
router.post('/update-password/:token', (0, express_validator_1.param)('token').isNumeric().withMessage('Token no válido'), (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 caracteres'), (0, express_validator_1.body)('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Los passwords no son iguales');
    }
    return true;
}), validation_1.handleInputErrors, AuthController_1.AuthController.updatePasswordWithToken);
router.get('/user', authenticate_1.authenticate, AuthController_1.AuthController.user);
//Profile
router.put('/profile', authenticate_1.authenticate, (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre no puede ir vacío'), (0, express_validator_1.body)('email').isEmail().withMessage('Email no válido'), validation_1.handleInputErrors, AuthController_1.AuthController.updateProfile);
router.post('/update-password', authenticate_1.authenticate, (0, express_validator_1.body)('current_password').notEmpty().withMessage('El password actual no puede ir vacío'), (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 caracteres'), (0, express_validator_1.body)('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Los passwords no son iguales');
    }
    return true;
}), validation_1.handleInputErrors, AuthController_1.AuthController.updateCurrentUserPassword);
router.post('/check-password', authenticate_1.authenticate, (0, express_validator_1.body)('password').notEmpty().withMessage('El password no puede ir vacío'), validation_1.handleInputErrors, AuthController_1.AuthController.checkPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map