import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import './styles/App.css'
import { TodoListPage } from './pages/TodoListPage'
import { DEFAULT, LOGIN, REGISTER, TODOLIST } from './routes/paths'
import { AuthContextProvider } from './context/authContext'
import { PublicRoute } from './routes/PublicRoute'
import { PrivateRoute } from './routes/PrivateRoute'

function App() {
    
    return (
        <AuthContextProvider>
            <main className='container'>
                <Routes>
                    <Route path={LOGIN} element={<PublicRoute />}>
                        <Route path={LOGIN} element={<LoginPage />}></Route>
                        <Route path={REGISTER} element={<RegisterPage />}></Route>
                    </Route>
                    <Route path={TODOLIST} element={<PrivateRoute />}>
                        <Route path={TODOLIST} element={<TodoListPage />}></Route>
                    </Route>
                    <Route path={DEFAULT} element={<Navigate to={LOGIN}></Navigate>}></Route>
                </Routes>
            </main>
        </AuthContextProvider>
    )
}

export default App
