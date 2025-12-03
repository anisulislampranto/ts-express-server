import { pool } from "../../config/db";

const createTodo = async(user_id: string, title: string) => {
    const result = pool.query(`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`, [user_id, title])
    return result;
}

const getTodos = async() =>{
    const result = await pool.query(`SELECT * FROM todos`);
    return result;
}

export const todoServices = {
    createTodo,
    getTodos
}