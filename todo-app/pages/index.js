import React from 'react';
import Todo from '../database/models/Todo';

/**
 * home page root component
 * @param {{ todos: Todo[] }} param0 
 * @returns {JSX.Element}
 */
export default function HomePage({ todos }) {
    return (
        <div>
            {todos.map(todo => (
                <div key={todo.todo_id}>
                    <h3>{todo.title}</h3>
                    <p>{todo.description}</p>
                    <p>by {todo.author.username}</p>
                </div>
            ))}
        </div>
    );
}

export async function getServerSideProps(_context) {
    const todos = await Todo.all();
    return {
        props: {
            todos: todos.map(todo => todo.as_json())
        }
    }
}
