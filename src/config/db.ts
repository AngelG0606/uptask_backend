import mongoose from "mongoose";
import colors from 'colors'
import dotenv from 'dotenv'

dotenv.config()

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASE_URL)
        const url = `${connection.connection.host}:${connection.connection.port}`        
        if(connection) {
            console.log(colors.yellow.bold('Base de datos funcionando'))
            console.log(`Funcionando en ${url}`)
        }        

    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

