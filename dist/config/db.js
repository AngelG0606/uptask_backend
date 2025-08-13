"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        const connection = await mongoose_1.default.connect(process.env.DATABASE_URL);
        const url = `${connection.connection.host}:${connection.connection.port}`;
        if (connection) {
            console.log(colors_1.default.yellow.bold('Base de datos funcionando'));
            console.log(`Funcionando en ${url}`);
        }
    }
    catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map