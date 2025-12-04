import express, { NextFunction, Request, Response } from 'express'
import config from './config'
import initDB, { pool } from './config/db';
import logger from './middleware/logger';
import { userRoutes } from './modules/user/user.routes';
import { todoRoutes } from './modules/todo/todo.routes';
import { authRoutes } from './modules/auth/auth.routes';

const app = express()
const port = config.port;

// int db
initDB()

// parser
app.use(express.json())
// for formData 
// app.use(express.urlencoded())/

app.get('/', logger, (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use('/api/users', userRoutes)

// todos crud 
app.post("/api/todos", todoRoutes)

// auth routes 
app.use('/api/auth', authRoutes)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
