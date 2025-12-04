import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {

    try {
        const result = await userServices.createUser(req.body)

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
}

const getUsers = async(req: Request, res: Response) => {
    try {
        const result = await userServices.getUsers()

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
    
    
}

const getUser =  async(req: Request, res: Response) => {
    const {id}  = req.params;

    try {
        const result = await userServices.getUser(id)

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
    
    
}

const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const result = await userServices.updateUser(name, email, id)

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
}

const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await userServices.deleteUser(id)

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
}

export const userControllers = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
}