import { transporter } from "../config/nodemailer"

interface IEmail {
    email : string
    name : string
    token  : string
}

export class AuthEmail {
    
    static sendConfirmationEmail = async (user : IEmail) => {
       const info = await transporter.sendMail({
                from : 'Uptask <admin@gmail.com>',
                to : user.email,
                subject : 'Uptask - Confirma tu cuenta',
                text : 'Uptask - Confirma tu cuenta',
                html : `
                    <p>Hola ${user.name}, has creado tu cuenta en UpTask, ya casi está todo listo, solo debes confirmar tu cuenta</p>
                    <p>Vista el siguiente enlace</p>
                    <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirma tu cuenta e ingresa el código</a>
                    <p>Token <b>${user.token}</b> </p>
                    <p>Este código expira en 10 minutos.</p>
                `
            })
    }

    static sendPasswordResetToken = async (user : IEmail) => {
       const info = await transporter.sendMail({
                from : 'Uptask <admin@gmail.com>',
                to : user.email,
                subject : 'Uptask - Reestablecer password',
                text : 'Uptask - Reestablecer password',
                html : `
                    <p>Hola ${user.name}, has solicitado reestablecer tu password</p>
                    <p>Vista el siguiente enlace</p>
                    <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer password</a>
                    <p>Ingresa el codigo <b>${user.token}</b> </p>
                    <p>Este código expira en 10 minutos.</p>
                `
            })
    }

}