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
                    <a href="">Confirma tu cuenta e ingresa el código</a>
                    <p>Token <b>${user.token}</b> </p>
                    <p>Este código expira en 10 minutos.</p>
                `
            })
    }

}