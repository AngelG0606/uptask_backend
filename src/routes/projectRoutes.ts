import { Router} from 'express'
import { ProjectController } from '../controllers/ProjectController'
import  { body, param }  from 'express-validator';
import { handleInputErrors } from '../middleware/validation';


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

export default router