import { Request, Response } from "express";
import { todoServices } from "./todo.server";

const createTodo = async(req: Request, res: Response) => {
    const {user_id, title} = req.body;

    try {
        const result = await todoServices.createTodo(user_id, title)

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
}

const getTodos =  async(req: Request, res: Response) => {
    try {
        const result = await todoServices.getTodos()

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
    
    
}

export const todoControllers = {
    createTodo,
    getTodos
}