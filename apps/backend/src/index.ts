import express from 'express'
import { prismaClient } from 'db/client'
import jwt from 'jsonwebtoken'
import { authenticateToken } from './authenticationToken'

const app = express()
const port = 3000
const pc = prismaClient
const JWT_SECRET = 'your-secret-key'

app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Server is hosted!")
})

//signin and up user
app.post('/signup', async(req, res)=>{
    const {username, password} = req.body

    try {
        const response = await pc.user.findFirst({
            where: { username }
        })

        if(response?.username === username) {
            res.status(400).json({
                message: "User already exists!"
            })
            return
        }

        const user = await pc.user.create({
            data: {
                username,
                password,
            }
        })

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: '24h'
        })

        res.status(201).json({
            message: 'User signed up successfully!',
            token
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
})
app.post('/signin', async(req, res)=>{
    const {username, password} = req.body

    try {
        const user = await pc.user.findFirst({
            where: {
                username,
                password
            }
        })

        if (!user) {
            res.status(401).json({
                message: 'Invalid credentials'
            })
            return
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: '24h'
        })

        res.json({
            message: 'User signed in successfully!',
            token
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
})

// Protected routes using userId from token
app.get('/todos', authenticateToken, async (req, res) => {
    try {
        const todos = await pc.todo.findMany({
            where: {
                userId: req.userId
            }
        })

        res.json({
            message: 'Todos fetched successfully',
            todos
        })
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch todos',
            error
        })
    }
})

app.post('/todos', authenticateToken, async (req, res) => {
    const { title } = req.body

    try {
        const todo = await pc.todo.create({
            data: {
                title,
                isCompleted: false,
                userId: req.userId
            }
        })

        res.status(201).json({
            message: 'Todo created successfully',
            todo
        })
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create todo',
            error
        })
    }
})

app.patch('/todos/:id', authenticateToken, async (req, res) => {
    const { id } = req.params
    const { isCompleted } = req.body

    try {
        // Verify todo belongs to the authenticated user
        const existingTodo = await pc.todo.findFirst({
            where: {
                id: parseInt(id),
                userId: req.userId 
            }
        })
        if (!existingTodo) {
            res.status(404).json({
                message: 'Todo not found or unauthorized access'
            })
            return;
        }

        const todo = await pc.todo.update({
            where: {
                id: parseInt(id)
            },
            data: {
                isCompleted
            }
        })

        res.json({
            message: 'Todo updated successfully',
            todo
        })
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update todo',
            error
        })
    }
})
