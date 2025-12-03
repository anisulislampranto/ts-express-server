import express, { NextFunction, Request, Response } from 'express'
import {Pool} from "pg"
import config from './config'
import initDB from './config/db';

const app = express()
const port = config.port;

// int db
initDB()

// parser
app.use(express.json())
// for formData 
// app.use(express.urlencoded())/

const logger  = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);
    next();
}

app.get('/', logger, (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.post('/api/users', async(req: Request, res: Response) => {
    const {name, email} = req.body;

    try {
        const result = await pool.query(`INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`, [name, email])

        res.status(201).json({
            success: true,
            message: 'data inserted',
            data: result.rows[0]
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
    
    
})

app.get('/api/users/', async(req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM users`)

        res.status(201).json({
            success: true,
            message: 'all data fetched',
            data: result.rows
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
    
    
})

app.get('/api/users/:id', async(req: Request, res: Response) => {
    const {id}  = req.params;

    try {
        const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id])

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'user not found',
            })
        }

        res.status(201).json({
            success: true,
            message: 'data fetched',
            data: result.rows[0]
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
    
    
})

app.put('/api/users/:id', async(req: Request, res: Response) => {
    const {id}  = req.params;
    const {name, email} = req.body;

    try {
        const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`, [name, email, id])

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'user not found',
            })
        }

        res.status(201).json({
            success: true,
            message: 'data updated',
            data: result.rows[0]
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
    
    
})

app.delete('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id])

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: 'user not found',
            })
        }

        res.status(200).json({
            success: true,
            message: 'user deleted',
            data: result.rows
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

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
