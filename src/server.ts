import express, { Request, Response } from 'express'
import {Pool} from "pg"
require('dotenv').config()

const app = express()
const port = 5000

const pool = new Pool({
    connectionString: process.env.psql
})

// parser
app.use(express.json())
// for formData 
// app.use(express.urlencoded())/

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.post('/', (req: Request, res: Response) => {
    console.log(req.body)
    
    res.status(201).json({
        success: true,
        message: 'Api is working',
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
