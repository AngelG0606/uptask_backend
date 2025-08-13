"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const Project_1 = __importDefault(require("../models/Project"));
class ProjectController {
    static createProject = async (req, res) => {
        const project = new Project_1.default(req.body);
        //Asigna manager 
        project.manager = req.user.id;
        try {
            await project.save();
            res.send('Proyecto Creado Correctamente');
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static getAllProjects = async (req, res) => {
        try {
            const projects = await Project_1.default.find({
                $or: [
                    { manager: { $in: req.user.id } },
                    { team: { $in: req.user.id } }
                ]
            }).populate('tasks');
            res.json(projects);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static getProjectById = async (req, res) => {
        try {
            const { projectId } = req.params;
            const project = await Project_1.default.findById(projectId).populate('tasks');
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error('Acción no válida');
                res.status(404).json({ error: error.message });
                return;
            }
            res.json(project);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static updateProject = async (req, res) => {
        try {
            await req.project.updateOne(req.body);
            res.send('Proyecto actualizado correctamente');
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static deleteProject = async (req, res) => {
        try {
            await req.project.deleteOne();
            res.send('Proyecto Eliminado Correctamente');
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=ProjectController.js.map