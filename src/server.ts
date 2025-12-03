import express, { NextFunction, Request, Response } from 'express'
import config from './config'
import initDB, { pool } from './config/db';
import logger from './middleware/logger';
import { userRoutes } from './modules/user/user.routes';

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
app.post("/api/todos", async(req: Request, res: Response) => {
    const {user_id, title} = req.body;

    try {
        const result = await pool.query(`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`, [user_id, title])

        res.status(201).json({
            success: true,
            message: 'created todo',
            data: result.rows
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

app.get('/api/todos/', async(req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM todos`)

        res.status(201).json({
            success: true,
            message: 'all todos data fetched',
            data: result.rows
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
    
    
})

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
