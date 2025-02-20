import { useEffect, useState } from 'react' // state hook
import './App.css';
import Task from './components/Task'

function App() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetch("http://localhost:3030/tasks")
    .then(res => res.json())
    .then(data => setTasks(data))
  },[])

  const handleSubmit = async (event) => {
    // prevent default behaviour of event (in this case form submission event causes page to reload)
    event.preventDefault()

    // get value from first element within element that caused submission event
    const text = event.target[0].value
    // create a new task with the correct data
    const newTask = {
      text: text,
      completed: false
    }

    const res = await fetch("http://localhost:3030/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTask)
    })

    const data = await res.json()

    // create new state
    const newTasks = [...tasks, data]
    // tell react to update state & rerender
    setTasks(newTasks)
  }

  const updateTasks = async (taskId, value) => {
    // find the task
    // create a new array with the updated task


    const res = await fetch(`http://localhost:3030/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type':'application/json'
      },
      body:JSON.stringify({completed:value})
    })

    const updatedTask = await res.json()

    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return updatedTask
      }
      return task
    })
    setTasks(updatedTasks)
  }

  const deleteTask = async (taskId) => {

    await fetch(`http://localhost:3030/tasks/${taskId}`, {
      method: "DELETE"
    })

    const filteredTasks = tasks.filter(item => item.id !== taskId)
    // find the task
    // remove it from the array of tasks
    setTasks(filteredTasks)
  }

  return (

    <div className='App'>
      <form onSubmit={handleSubmit}>
        <input type="text" name="task"/>
        <button>add task</button>
      </form>

      {
        tasks.map(item => {
          return (
            <Task
              task={item}
              key={item.id}
              updateTasks={updateTasks}
              deleteTask={deleteTask}
            />
          )})
      }

    </div>

  )
}

export default App;
