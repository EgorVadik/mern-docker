import { useEffect, useState } from 'react'
import './App.css'

function App() {
    const [todos, setTodos] = useState<
        {
            _id: string
            text: string
            done: boolean
        }[]
    >([])
    const [todo, setTodo] = useState('')

    useEffect(() => {
        const getTodos = async () => {
            const todosFromServer = await fetch('http://localhost:3000').then(
                (res) => res.json()
            )
            setTodos(todosFromServer.todos)
        }
        getTodos()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newTodo = {
            text: todo,
            done: false,
        }

        const res = await fetch('http://localhost:3000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTodo),
        })

        const data = await res.json()

        setTodos([...todos, data.todo])
        setTodo('')
    }

    const handleDone = async (id: string) => {
        const res = await fetch(`http://localhost:3000/${id}`, {
            method: 'PUT',
        })

        const data = await res.json()

        setTodos(
            todos.map((todo) =>
                todo._id === data.todo._id
                    ? { ...todo, done: data.todo.done }
                    : todo
            )
        )
    }

    return (
        <>
            <div className='App'>
                <form className='form-field' onSubmit={handleSubmit}>
                    <label htmlFor='todo'>Todo</label>
                    <input
                        type='text'
                        id='todo'
                        value={todo}
                        onChange={(e) => setTodo(e.target.value)}
                    />
                    <button type='submit'>Submit</button>
                </form>
                <div className='todos'>
                    {todos.map((todo) => (
                        <div className='todo'>
                            <p>{todo.text}</p>
                            <button
                                style={{
                                    backgroundColor: todo.done
                                        ? 'green'
                                        : 'red',
                                }}
                                onClick={() => handleDone(todo._id)}
                            >
                                {todo.done ? 'Done' : 'Not Done'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default App
