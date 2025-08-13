"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamController = void 0;
const User_1 = __importDefault(require("../models/User"));
const Project_1 = __importDefault(require("../models/Project"));
class TeamController {
    static findMemberByEmail = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User_1.default.findOne({ email }).select('id name email');
            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static getProjectTeam = async (req, res) => {
        try {
            const project = await Project_1.default.findById(req.project.id).populate({
                path: 'team',
                select: 'id name email'
            });
            res.json(project.team);
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static addMemberById = async (req, res) => {
        try {
            const { id } = req.body;
            const user = await User_1.default.findById(id).select('id');
            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            if (req.project.team.some(team => team.toString() === user.id.toString())) {
                const error = new Error('Usuario ya existe en el proyecto');
                res.status(409).json({ error: error.message });
                return;
            }
            req.project.team.push(user.id);
            await req.project.save();
            res.send('Usuario agregado correctamente');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static removeTeamMember = async (req, res) => {
        try {
            const { userId } = req.params;
            if (!req.project.team.some(team => team.toString() === userId)) {
                const error = new Error('Usuario no existe en el proyecto');
                res.status(409).json({ error: error.message });
                return;
            }
            req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId);
            await req.project.save();
            res.send('Usuario Removido del proyecto correctamente');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
}
exports.TeamController = TeamController;
//# sourceMappingURL=TeamController.js.map