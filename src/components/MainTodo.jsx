import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useFetch } from '../hooks/useFetch'

export const MainTodo = ({ id, accessToken }) => {
    const [selectedFilter, setSelectedFilter] = useState('All')
    const [tasks, setTasks] = useState([])
    const [dotsOpenState, setDotsOpenState] = useState({})
    const [newTaskInput, setNewTaskInput] = useState('')
    const [editedTask, setEditedTask] = useState({ id: 0, description: '' })
    // Obtener todas las tareas
    const { isLoading, data, errors } = useFetch(`https://api-todolist-t4ba.onrender.com/api/task/getAll?id=${id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    // Se agregar la data de la respuesta a data(tasks) local
    useEffect(() => {
        if (!isLoading && !errors) setTasks(data)
    }, [data, isLoading, errors])

    // Funcion para manejar la seleccion de las tareas (all, pending o completed)
    const handleFilter = (filter) => setSelectedFilter(filter)

    // Actualizar la tarea (completada o pendiente)
    const handleTaskStateChange = async (taskId, newState) => {
        try {
            // Llamada a la api
            const response = await fetch(`https://api-todolist-t4ba.onrender.com/api/task/updateState/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ state: newState })
            })

            if (!response.ok) throw new Error('Error al actualizar el estado de la tarea')

            // Actualizar el estado de la tarea localmente
            const updatedTasks = tasks.map(task => {
                if (task.id === taskId) return { ...task, state: newState }
                return task
            })

            // Actualizar el estado de las tareas
            setTasks(updatedTasks)
        } catch (err) {
            console.error(`Ocurrio un error al actualizar la tarea ${err}`)
        }
    }

    // Función para filtrar las tareas según la opción seleccionada
    const filterTasks = (tasks) => {
        switch (selectedFilter) {
            case 'Pending':
                return tasks.filter(task => !task.state)
            case 'Completed':
                return tasks.filter(task => task.state)
            default:
                return tasks
        }
    }

    // Se llama a las tareas filtradas y se le asigna la data local
    const filteredTasks = filterTasks(tasks)

    // Mostrar las opciones de las tareas (editar y eliminar)
    const toggleDots = (taskId) => {
        setDotsOpenState(prevState => ({
            ...prevState,
            [taskId]: !prevState[taskId]
        }))
    }

    // Funcion para agregar nueva tarea
    const handleNewTaskKeyDown = async (e, taskId = 0) => {
        if(e.key === 'Enter'){
            const input = newTaskInput.trim()
            if(input !== ''){
                try{
                    if (taskId !== 0) {
                       // Editar una tarea existente
                       const response = await fetch(`https://api-todolist-t4ba.onrender.com/api/task/update/${taskId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({ description: input })
                    })

                    if (!response.ok) throw new Error('Error al editar la tarea')

                    const updatedTasks = tasks.map(task => {
                        if (task.id === taskId) {
                            return { ...task, description: input }
                        }
                        return task
                    })

                    setTasks(updatedTasks)
                    setEditedTask({ id: null, description: '' })
                    setNewTaskInput('')
                    window.location.reload()
                    } else {
                         // Crear una nueva tarea
                         const response = await fetch('https://api-todolist-t4ba.onrender.com/api/task/create', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${accessToken}`
                            },
                            body: JSON.stringify({
                                description: input,
                                users: { id }
                            })
                        })

                        if (!response.ok) throw new Error('Error al agregar una nueva tarea')

                        const newTask = await response.json()
                        setTasks(prevTasks => [...prevTasks, newTask.body])
                        setNewTaskInput('')
                    }
                    setNewTaskInput('')
                    
                }catch(err){
                    console.error(`Ocurrio un error al agregar la tarea: ${err}`)
                }
            }
        }
    }

    const handleDeleteTask = async (taskId) => {
        try{
            const response = await fetch(`https://api-todolist-t4ba.onrender.com/api/task/delete/${taskId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (!response.ok) throw new Error('Error al eliminar la tarea')

            const updateTask = tasks.filter(task => task.id !== taskId)
            setTasks(updateTask)
        }catch(err){
            console.error(`Ocurrió un error al eliminar la tarea: ${err}`)
        }
    }

    const handleEditStart = (taskId, taskDescription) => {
        setEditedTask({id: taskId, description: taskDescription})
    }
    
    return (
        <div className="main-todo">
            <div className='container-input'>
                <PlaylistAddIcon className='icon-add' />
                <input 
                    type="text"
                    placeholder='Add task' 
                    value={editedTask.id !== 0 ? editedTask.description : newTaskInput} 
                    onChange={(e) => {
                        if(editedTask.id !== 0) {
                            setEditedTask({...editedTask, description: e.target.value})
                            setNewTaskInput(e.target.value)
                        }else{
                            setNewTaskInput(e.target.value)
                        }
                    }} 
                    onKeyDown={(e) => handleNewTaskKeyDown(e, editedTask.id)} />
            </div>
            <ul>
                <li className={`${selectedFilter === 'All' ? 'selected' : ''}`} onClick={() => handleFilter('All')}>All</li>
                <li className={`${selectedFilter === 'Pending' ? 'selected' : ''}`} onClick={() => handleFilter('Pending')}>Pending</li>
                <li className={`${selectedFilter === 'Completed' ? 'selected' : ''}`} onClick={() => handleFilter('Completed')}>Completed</li>
            </ul>

            <div className='container-tasks'>
                {isLoading ? (
                    <p>Loading...</p>
                ) : errors ? (
                    <p>Ha ocurrido un error: {errors}</p>
                ) : (
                    filteredTasks.length === 0
                        ? <p>No tienes tareas</p>
                        : filteredTasks.map(task => (
                            <div className='box-tasks' key={task.id}>
                                <input type="checkbox" checked={task.state} onChange={(e) => handleTaskStateChange(task.id, e.target.checked)} />
                                <p>{task.description}</p>
                                <MoreHorizIcon className='icon-dot' onClick={() => toggleDots(task.id)} />
                                {dotsOpenState[task.id] && (
                                    <div className='box-dots open'>
                                        <span onClick={() => handleEditStart(task.id, task.description)}>
                                            Edit
                                            <EditIcon className='icon-edit' fontSize='small' />
                                        </span>
                                        <span onClick={() => handleDeleteTask(task.id)}>
                                            Delete
                                            <DeleteIcon className='icon-delete' fontSize="small"  />
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))
                )}

            </div>

        </div>
    )
}

MainTodo.propTypes = {
    id: PropTypes.number.isRequired,
    accessToken: PropTypes.string.isRequired
}