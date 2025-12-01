import express, { Request, Response } from 'express'
import {Pool} from "pg"
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path: path.join(process.cwd(), '.env')})

const app = express()
const port = 5000

// DB
const pool = new Pool({
    connectionString: process.env.DB_URI
})

const initDB = async() => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            age INT,
            phone VARCHAR(15),
            address TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `)


    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT false,
            due_date DATE,
            created_at TIMESTAMP DEFAULT NOW(), 
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `)


}

initDB()

// parser
app.use(express.json())
// for formData 
// app.use(express.urlencoded())/

app.get('/', (req: Request, res: Response) => {
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
