import { Link } from 'react-router-dom'
import '../styles/login.css'
import { useState } from 'react'
import { useAuthContext } from '../context/authContext'



export const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordValidate, setPasswordValidate] = useState('')
    const [responseError, setResponseError] = useState({
        error: false,
        message: ""
    })
    const {login} = useAuthContext()


    const handleSubmit = async (e) => {
        e.preventDefault()

        if(password.length < 6 || password.length > 12){
            setPasswordValidate('Debe tener entre 6 y 12 caracteres')
            return
        }else{
            setPasswordValidate('')
        }

        try{
            const response = await fetch('https://api-todolist-t4ba.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            })

            if(response.ok){
                setResponseError({
                    error: false,
                    message: ""
                })
                const responseData = await response.json()
                
                if(responseData?.body.accessToken){
                    // console.log(responseData)
                    login(responseData)
                }
            }else{
                const responseData = await response.json()
                setResponseError({
                    error: true,
                    message: responseData.error
                })
            }

        }catch(error){
            console.error(error)
        }
        
    }
    
    return (
        <section className="container-form">
            <form className="form" onSubmit={handleSubmit}>
                <h1 className="title-form">Login</h1>
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" id="username" name="username" className="form-input" placeholder="Username" required onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" id="password" name="password" className="form-input" placeholder="*********" required onChange={(e) => setPassword(e.target.value)}/>
                    { 
                        passwordValidate 
                        ? <p className='error-message input'>{passwordValidate}</p>
                        : <p></p>
                    }
                </div>
                {
                    responseError?.error === true
                    ? <p className='error-message login'>{responseError?.message}</p>
                    : <p></p>
                }
                <div className="form-group">
                    <button className="form-btn" type="submit">Login</button>
                    <div>
                        <span>¿do not have an account? </span>
                        <Link to={"/register"} className="form-link">Register</Link>
                    </div>
                </div>
            </form>
        </section>
    )
}
