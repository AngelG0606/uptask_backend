import type { Request, Response } from 'express'
import User from '../models/User'
import Project from '../models/Project'

export class TeamController {

    static findMemberByEmail = async (req : Request, res : Response) => {
        try {
            const  { email } = req.body

            const user = await User.findOne({email}).select('id name email')
            if(!user) {
                const error = new Error('Usuario no encontrado')
                res.status(404).json({error : error.message})
                return
            }
            res.json(user)
        } catch (error) {
            res.status(500).json({error : 'Hubo un error'})
        }
    }

    static getProjectTeam = async (req : Request, res : Response) => {
        try {
            const project = await Project.findById(req.project.id).populate({
                path : 'team',
                select : 'id name email'
            })

            res.json(project.team)
        } catch (error) {
            res.status(500).json({error : 'Hubo un error'})
        }
    }

    static addMemberById = async (req : Request, res : Response) => {
        try {
            const { id } = req.body
            const user = await User.findById(id).select('id')
            if(!user) {
                const error = new Error('Usuario no encontrado')
                res.status(404).json({error : error.message})
                return
            }

            if(req.project.team.some(team => team.toString() === user.id.toString())) {
                const error = new Error('Usuario ya existe en el proyecto')
                res.status(409).json({error : error.message})
                return
            }

            req.project.team.push(user.id)
            await req.project.save()
            res.send('Usuario agregado correctamente')
        } catch (error) {
            res.status(500).json({error : 'Hubo un error'})
        }
    }

    static removeTeamMember = async (req : Request, res : Response) => {
        try {
            const { id } = req.body
            if(!req.project.team.some(team => team.toString() === id)) {
                const error = new Error('Usuario no existe en el proyecto')
                res.status(409).json({error : error.message})
                return
            }


            req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== id)
            await req.project.save()
            res.send('Usuario Removido del proyecto correctamente')

        } catch (error) {
            res.status(500).json({error : 'Hubo un error'})
        }
    }


}