"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../utils/auth");
const Token_1 = __importDefault(require("../models/Token"));
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../emails/AuthEmail");
const jwt_1 = require("../utils/jwt");
class AuthController {
    static createAccount = async (req, res) => {
        try {
            const { email } = req.body;
            const userExist = await User_1.default.findOne({ email });
            if (userExist) {
                const error = new Error('Usuario ya registrado');
                res.status(409).json({ error: error.message });
                return;
            }
            //Crea un usuario 
            const user = new User_1.default(req.body);
            //hash password
            user.password = await (0, auth_1.hashPassword)(req.body.password);
            //generar token 
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            //Enviar email
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });
            //Guardar usuario y token
            await Promise.allSettled([user.save(), token.save()]);
            res.send('Cuenta creada, revisa tu email para confirmarla');
        }
        catch (error) {
            // console.log(error)
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static confirmAccount = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenExist = await Token_1.default.findOne({ token });
            if (!tokenExist) {
                const error = new Error('Token no válido');
                res.status(404).json({ error: error.message });
                return;
            }
            const user = await User_1.default.findById(tokenExist.user);
            console.log(user);
            user.confirmed = true;
            await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
            res.send('Cuenta confirmada correctamente');
        }
        catch (error) {
            // console.log(error)
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            if (!user.confirmed) {
                const token = new Token_1.default();
                token.user = user.id;
                token.token = (0, token_1.generateToken)();
                AuthEmail_1.AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                });
                const error = new Error('Usuario no confirmado, hemos enviado un email de confirmacion');
                res.status(401).json({ error: error.message });
                return;
            }
            //revisar password 
            const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
            if (!isPasswordCorrect) {
                const error = new Error('Password incorrecto');
                res.status(401).json({ error: error.message });
                return;
            }
            const jwt = (0, jwt_1.generateJWT)({ id: user.id });
            res.send(jwt);
        }
        catch (error) {
            // console.log(error)
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static requestConfirmationCode = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            if (user.confirmed) {
                const error = new Error('Usuario ya confirmado');
                res.status(403).json({ error: error.message });
                return;
            }
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            //Enviar email con nuevo token
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });
            res.send('Se envió un nuevo token de confirmación a tu email.');
        }
        catch (error) {
            // console.log(error)
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static forgotPassword = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            //Enviar email con nuevo token
            AuthEmail_1.AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            });
            await token.save();
            res.send('Revisa tu email para instrucciones');
        }
        catch (error) {
            // console.log(error)
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static validateToken = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenExist = await Token_1.default.findOne({ token });
            if (!tokenExist) {
                const error = new Error('Token no válido');
                res.status(404).json({ error: error.message });
                return;
            }
            res.send('Token Válida, define tu nuevo password');
        }
        catch (error) {
            // console.log(error)
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static updatePasswordWithToken = async (req, res) => {
        try {
            const { token } = req.params;
            const tokenExist = await Token_1.default.findOne({ token });
            if (!tokenExist) {
                const error = new Error('Token no válido');
                res.status(404).json({ error: error.message });
                return;
            }
            const user = await User_1.default.findById(tokenExist.user);
            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            user.password = await (0, auth_1.hashPassword)(req.body.password);
            await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
            res.send('Password modificado correctamente');
        }
        catch (error) {
            // console.log(error)
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static user = async (req, res) => {
        return res.json(req.user);
    };
    static updateProfile = async (req, res) => {
        const { name, email } = req.body;
        const userExist = await User_1.default.findOne({ email });
        if (userExist && userExist.id.toString() !== req.user.id.toString()) {
            const error = new Error('Email ya registrado');
            res.status(409).json({ error: error.message });
            return;
        }
        req.user.name = name;
        req.user.email = email;
        try {
            await req.user.save();
            res.send('Perfil Actualizado correctamente');
        }
        catch (error) {
            // console.log(error)
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static updateCurrentUserPassword = async (req, res) => {
        const { current_password, password } = req.body;
        const user = await User_1.default.findById(req.user.id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(current_password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('El password actual es incorrecto');
            res.status(401).json({ error: error.message });
            return;
        }
        try {
            user.password = await (0, auth_1.hashPassword)(password);
            await user.save();
            res.send('El password se modificó correctamente');
        }
        catch (error) {
            // console.log(error)
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static checkPassword = async (req, res) => {
        const { password } = req.body;
        const user = await User_1.default.findById(req.user.id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('El password actual es incorrecto');
            res.status(401).json({ error: error.message });
            return;
        }
        res.send('Password correcto');
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map