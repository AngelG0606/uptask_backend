import type { Request, Response} from 'express'
import Project from '../models/Project'

export class ProjectController {

    static createProject = async (req : Request, res : Response) => {
        const project = new Project(req.body)

        //Asigna manager 
        project.manager = req.user.id
        
        try {
            await project.save()
            res.send('Proyecto Creado Correctamente')
        } catch (error) {
            console.log(error)
            res.status(500).json({error : 'Hubo un error'})
        }   
    }

    static getAllProjects = async (req : Request, res : Response) => {
        try {
           const projects = await Project.find({
            $or : [
                {manager : {$in: req.user.id}},
                {team : {$in : req.user.id}}
            ]
           }).populate('tasks')
           res.json(projects) 
        } catch (error) {
            console.log(error)
            res.status(500).json({error : 'Hubo un error'})
        }
    }

    static getProjectById = async (req : Request, res :  Response) => {
        try {
            const { projectId } = req.params
            const project = await Project.findById(projectId).populate('tasks')
            if(!project) {
                const error = new Error('Proyecto no encontrado')
                res.status(404).json({error : error.message})
                return
            }

            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error('Acción no válida')
                res.status(404).json({error : error.message})
                return
            }

            res.json(project)

        } catch (error) {
            console.log(error)
            res.status(500).json({error : 'Hubo un error'})
        }
    }

    static updateProject = async (req : Request, res : Response) => {
        try {
            const { projectId } = req.params
            const project = await Project.findById(projectId)
            if(!project) {
                const error = new Error('Proyecto no encontrado')
                res.status(404).json({error : error.message})
                return
            }
            if(project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Acción no válida')
                res.status(404).json({error : error.message})
                return
            }
            await project.updateOne(req.body)
            res.send('Proyecto actualizado correctamente')
        } catch (error) {
            console.log(error)
            res.status(500).json({error : 'Hubo un error'})
        }
    }

    static deleteProject = async (req : Request, res : Response) => {
        try {
            const { projectId } = req.params
            const project = await Project.findById(projectId)
            if(!project) {
                const error = new Error('Proyecto no encontrado')
                res.status(404).json({error : error.message})
                return
            }
            if(project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Acción no válida')
                res.status(404).json({error : error.message})
                return
            }
            await project.deleteOne()
            res.send('Proyecto Eliminado Correctamente')

        } catch (error) {
            console.log(error)
            res.status(500).json({error : 'Hubo un error'})
        }
    }
}