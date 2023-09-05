import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
    text: String,
    done: Boolean,
})

export const Todo = mongoose.model('Todo', todoSchema)
