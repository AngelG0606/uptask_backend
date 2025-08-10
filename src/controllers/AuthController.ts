import type { Request, Response} from 'express'
import User from '../models/User'
import { hashPassword } from '../utils/auth'
import Token from '../models/Token'
import { generateToken } from '../utils/token'

export class AuthController {

    static createAccount = async (req : Request, res : Response) => {
        try {
            const { email } = req.body 
            const userExist = await User.findOne({email})
            if(userExist) {
                const error = new Error('Usuario ya registrado')
                res.status(409).json({error :  error.message})
                return
            }

           //Crea un usuario 
            const user = new User(req.body)
            //hash password
            user.password = await hashPassword(req.body.password)

            //generar token 
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //Guardar usuario y token
            await Promise.allSettled([user.save(), token.save()])
            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch (error) {
            // console.log(error)
            res.status(500).json({error : 'Hubo un error'})
        }
    }


}