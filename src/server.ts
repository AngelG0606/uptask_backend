import express from 'express'
import  dotenv from 'dotenv'
import { connectDB } from './config/db'
import projectRouter from './routes/projectRoutes'
import authRouter from './routes/authRoutes'
import cors from 'cors'
import { corsConfig } from './config/cors'
import morgan from 'morgan'

dotenv.config()

connectDB()
const app = express()
app.use(cors(corsConfig))

//logging
app.use(morgan('dev'))

app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/projects', projectRouter)

export default app