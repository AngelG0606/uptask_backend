import { Router} from 'express'
import { ProjectController } from '../controllers/ProjectController'
import  { body, param }  from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { projectExists } from '../middleware/project';
import { taskBelongsToProject, taskExists } from '../middleware/task';


const router = Router()

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
    param("taskId").isMongoId().withMessage('ID no válido'),
    body("name").notEmpty().withMessage('El nombre de la tarea es obligatoria'), 
    body("description").notEmpty().withMessage('La descripcion de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId', 
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


export default router