"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProjectController_1 = require("../controllers/ProjectController");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const TaskController_1 = require("../controllers/TaskController");
const project_1 = require("../middleware/project");
const task_1 = require("../middleware/task");
const authenticate_1 = require("../middleware/authenticate");
const TeamController_1 = require("../controllers/TeamController");
const NoteController_1 = require("../controllers/NoteController");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
router.post('/', (0, express_validator_1.body)("projectName").notEmpty().withMessage('El Nombre del proyecto es obligatorio'), (0, express_validator_1.body)("clientName").notEmpty().withMessage('El Nombre del cliente es obligatorio'), (0, express_validator_1.body)("description").notEmpty().withMessage('La Descripción del proyecto es obligatoria'), validation_1.handleInputErrors, ProjectController_1.ProjectController.createProject);
router.get('/', ProjectController_1.ProjectController.getAllProjects);
router.get('/:projectId', (0, express_validator_1.param)("projectId").isMongoId().withMessage('ID no válido'), ProjectController_1.ProjectController.getProjectById);
router.param('projectId', project_1.projectExists);
router.put('/:projectId', (0, express_validator_1.param)("projectId").isMongoId().withMessage('ID no válido'), (0, express_validator_1.body)("projectName").notEmpty().withMessage('El Nombre del proyecto es obligatorio'), (0, express_validator_1.body)("clientName").notEmpty().withMessage('El Nombre del cliente es obligatorio'), (0, express_validator_1.body)("description").notEmpty().withMessage('La Descripción del proyecto es obligatoria'), validation_1.handleInputErrors, task_1.hasAuthorization, ProjectController_1.ProjectController.updateProject);
router.delete('/:projectId', (0, express_validator_1.param)("projectId").isMongoId().withMessage('ID no válido'), task_1.hasAuthorization, ProjectController_1.ProjectController.deleteProject);
//Routes for tasks
router.post('/:projectId/tasks', task_1.hasAuthorization, (0, express_validator_1.body)("name").notEmpty().withMessage('El nombre de la tarea es obligatoria'), (0, express_validator_1.body)("description").notEmpty().withMessage('La descripcion de la tarea es obligatoria'), validation_1.handleInputErrors, TaskController_1.TaskController.createTask);
router.get('/:projectId/tasks', TaskController_1.TaskController.getProjectTasks);
router.param('taskId', task_1.taskExists);
router.param('taskId', task_1.taskBelongsToProject);
router.get('/:projectId/tasks/:taskId', (0, express_validator_1.param)("taskId").isMongoId().withMessage('ID no válido'), validation_1.handleInputErrors, TaskController_1.TaskController.getTasksById);
router.put('/:projectId/tasks/:taskId', task_1.hasAuthorization, (0, express_validator_1.param)("taskId").isMongoId().withMessage('ID no válido'), (0, express_validator_1.body)("name").notEmpty().withMessage('El nombre de la tarea es obligatoria'), (0, express_validator_1.body)("description").notEmpty().withMessage('La descripcion de la tarea es obligatoria'), validation_1.handleInputErrors, TaskController_1.TaskController.updateTask);
router.delete('/:projectId/tasks/:taskId', task_1.hasAuthorization, (0, express_validator_1.param)("taskId").isMongoId().withMessage('ID no válido'), validation_1.handleInputErrors, TaskController_1.TaskController.deleteTask);
router.post('/:projectId/tasks/:taskId/status', (0, express_validator_1.param)("taskId").isMongoId().withMessage('ID no válido'), (0, express_validator_1.body)("status").notEmpty().withMessage('El estado de la tarea es obligatorio'), validation_1.handleInputErrors, TaskController_1.TaskController.updateStatus);
//rOUTES FOR TEAMS
router.post('/:projectId/team/find', (0, express_validator_1.body)("email").isEmail().toLowerCase().withMessage('Email no válido'), validation_1.handleInputErrors, TeamController_1.TeamController.findMemberByEmail);
router.get('/:projectId/team', TeamController_1.TeamController.getProjectTeam);
router.post('/:projectId/team', (0, express_validator_1.body)("id").isMongoId().withMessage('ID no válido'), validation_1.handleInputErrors, TeamController_1.TeamController.addMemberById);
router.delete('/:projectId/team/:userId', (0, express_validator_1.param)("userId").isMongoId().withMessage('ID no válido'), validation_1.handleInputErrors, TeamController_1.TeamController.removeTeamMember);
//Routes for NOTES
router.post('/:projectId/tasks/:taskId/notes', (0, express_validator_1.body)("content").notEmpty().withMessage("El contenido de la nota es obligatorio"), validation_1.handleInputErrors, NoteController_1.NoteController.createNote);
router.get('/:projectId/tasks/:taskId/notes', NoteController_1.NoteController.getTaskNotes);
router.delete('/:projectId/tasks/:taskId/notes/:noteId', (0, express_validator_1.param)('noteId').isMongoId().withMessage('ID no válido'), validation_1.handleInputErrors, NoteController_1.NoteController.deleteNote);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map