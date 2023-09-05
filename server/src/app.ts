import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { Todo } from './models/todo'

const app = express()
const port = process.env.PORT ?? 3000

app.use(express.json())
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
)

try {
    mongoose.connect(
        `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongodb:27017/notes?authSource=admin`
    )
} catch (error) {
    console.log(error)
}

app.get('/', async (req, res) => {
    try {
        const todos = await Todo.find()
        return res.json({ todos })
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message })
        }
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

app.post('/', async (req, res) => {
    try {
        const todo = new Todo({
            text: req.body.text,
            done: false,
        })
        await todo.save()
        return res.json({ todo })
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message })
        }
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

app.put('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id)
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' })
        }
        todo.done = !todo.done
        await todo.save()
        return res.json({ todo })
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message })
        }
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
