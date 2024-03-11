import SettingsIcon from '@mui/icons-material/Settings'
import '../styles/todolist.css'
import { MainTodo } from '../components/MainTodo'
import { useState } from 'react'
import { useAuthContext } from '../context/authContext'
import { LOGIN } from '../routes/paths'
import { UpdatePassword } from '../components/UpdatePassword'

export const TodoListPage = () => {
    const [isSettingOpen, setIsSettingOpen] = useState(false)
    const [isFormPasswordVisible, setIsFormPasswordVisible] = useState(false)
    const {logout, saveData} = useAuthContext()

    const {id, accessToken, fullname} = saveData

    const toggleSetting = () => setIsSettingOpen(!isSettingOpen)

    const togglePasswordUpdate = () => {
        setIsFormPasswordVisible(!isFormPasswordVisible)
        setIsSettingOpen(false)
    }

    const handleLogout = () => logout()

    return (
        <>
            <UpdatePassword userId={id} accessToken={accessToken} isFormPasswordVisible={isFormPasswordVisible} setIsFormPasswordVisible={setIsFormPasswordVisible}></UpdatePassword>
            <section className='container-todo'>
                <div className="header-todo">
                    <h1 className="title-todo">TodoList</h1>
                    <div className='box-setting'>
                        <p className='name-user'>{fullname}</p>
                        <SettingsIcon className='setting-icon' onClick={toggleSetting} />
                        {
                            isSettingOpen && (
                                <div className='setting-menu'>
                                    <p to={LOGIN} className='btn-logout' onClick={handleLogout}>Logout</p>
                                    <p className='btn-config' onClick={togglePasswordUpdate}>Update Password</p>
                                </div>
                            )
                        }
                    </div>
                </div>
                <MainTodo id={id} accessToken={accessToken}></MainTodo>
            </section>
        </>
    )
}
