import { Router} from 'express'
import { ProjectController } from '../controllers/ProjectController'
import  { body, param }  from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { projectExists } from '../middleware/project';
import { hasAuthorization, taskBelongsToProject, taskExists } from '../middleware/task';
import { authenticate } from '../middleware/authenticate';
import { TeamController } from '../controllers/TeamController';
import { NoteController } from '../controllers/NoteController';


const router = Router()

router.use(authenticate)
router.post('/',
    body("projectName").notEmpty().withMessage('El Nombre del proyecto es obligatorio'),
    body("clientName").notEmpty().withMessage('El Nombre del cliente es obligatorio'),
    body("description").notEmpty().withMessage('La Descripción del proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.createProject
)

router.get('/', 
    ProjectController.getAllProjects
)

router.get('/:projectId',
    param("projectId").isMongoId().withMessage('ID no válido'), 
    ProjectController.getProjectById
)

router.put('/:projectId', 
    param("projectId").isMongoId().withMessage('ID no válido'),
    body("projectName").notEmpty().withMessage('El Nombre del proyecto es obligatorio'),
    body("clientName").notEmpty().withMessage('El Nombre del cliente es obligatorio'),
    body("description").notEmpty().withMessage('La Descripción del proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.updateProject 
)

router.delete('/:projectId',
    param("projectId").isMongoId().withMessage('ID no válido'),
    ProjectController.deleteProject
)



//Routes for tasks
router.param('projectId', projectExists)

router.post('/:projectId/tasks',
    hasAuthorization,
    body("name").notEmpty().withMessage('El nombre de la tarea es obligatoria'), 
    body("description").notEmpty().withMessage('La descripcion de la tarea es obligatoria'),
    handleInputErrors,    
    TaskController.createTask
)

router.get('/:projectId/tasks' ,
    TaskController.getProjectTasks
)


router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param("taskId").isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.getTasksById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param("taskId").isMongoId().withMessage('ID no válido'),
    body("name").notEmpty().withMessage('El nombre de la tarea es obligatoria'), 
    body("description").notEmpty().withMessage('La descripcion de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization, 
    param("taskId").isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status', 
    param("taskId").isMongoId().withMessage('ID no válido'),
    body("status").notEmpty().withMessage('El estado de la tarea es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
)


//rOUTES FOR TEAMS
router.post('/:projectId/team/find', 
    body("email").isEmail().toLowerCase().withMessage('Email no válido'),
    handleInputErrors,
    TeamController.findMemberByEmail
)

router.get('/:projectId/team', 
    TeamController.getProjectTeam
)

router.post('/:projectId/team', 
    body("id").isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TeamController.addMemberById
)

router.delete('/:projectId/team/:userId', 
    param("userId").isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TeamController.removeTeamMember
)

//Routes for NOTES
router.post('/:projectId/tasks/:taskId/notes',
    body("content").notEmpty().withMessage("El contenido de la nota es obligatorio"),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router