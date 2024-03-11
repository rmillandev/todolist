import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"


export const RegisterPage = () => {
    const navigate = useNavigate()
    const [dni, setDni] = useState()
    const [fullName, setfullName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordValidate, setPasswordValidate] = useState('')
    const [fullNameValidate, setfullNameValidate] = useState('')
    const [responseError, setResponseError] = useState({
        error: false,
        message: ""
    })
    const [registrationSuccess, setRegistrationSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(password.length < 6 || password.length > 12){
            setPasswordValidate('Debe tener entre 6 y 12 caracteres')
            return
        }else{
            setPasswordValidate('')
        }

        if(!/^[a-zA-Z\s]+$/.test(fullName)){
            setfullNameValidate('Solo letras y espaciones en blancos')
            return
        }else{
            setfullNameValidate('')
        }

        try{
            const response = await fetch('https://api-todolist-t4ba.onrender.com/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dni,
                    fullName,
                    username,
                    password
                })
            })

            if(response.ok){
                setRegistrationSuccess(true)
                setResponseError({
                    error: false,
                    message: ""
                })
                setInterval(() => {
                    navigate("/")
                }, 2000)
            }else{
                const responseData = await response.json()
                setResponseError({
                    error: true,
                    message: responseData.error
                })
            }

        }catch(err){
            console.log(err)
        }
    }

    return (
        <section className="container-form">
            <form className="form" onSubmit={handleSubmit}>
                <h1 className="title-form">Register</h1>
                <div className="form-group">
                    <label htmlFor="dni" className="form-label">Dni</label>
                    <input type="number" id="dni" name="dni" className="form-input" placeholder="Dni" onChange={(e) => setDni(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="fullName" className="form-label">Full Name</label>
                    <input type="text" id="fullName" name="fullName" className="form-input" placeholder="Full Name" onChange={(e) => setfullName(e.target.value)} required/>
                    { 
                        fullNameValidate 
                        ? <p className='error-message input'>{fullNameValidate}</p>
                        : <p></p>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" id="username" name="username" className="form-input" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" id="password" name="password" className="form-input" placeholder="*********" onChange={(e) => setPassword(e.target.value)} required/>
                    { 
                        passwordValidate 
                        ? <p className='error-message input'>{passwordValidate}</p>
                        : <p></p>
                    }
                </div>
                {
                    registrationSuccess === true
                    ? <p className='registration'>Se registro exitosamente</p>
                    : <p></p>
                }
                {
                    responseError?.error === true
                    ? <p className='error-message login'>{responseError?.message}</p>
                    : <p></p>
                }
                <div className="form-group">
                    <button className="form-btn" type="submit">Register</button>
                    <div>
                        <span>¿already have an account? </span>
                        <Link to={"/login"} className="form-link">Login</Link>
                    </div>
                </div>
            </form>
        </section>
    )
}
