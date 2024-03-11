import PropTypes from 'prop-types'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useState } from 'react'

export const UpdatePassword = ({ userId, accessToken, isFormPasswordVisible, setIsFormPasswordVisible }) => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [passwordValidate, setPasswordValidate] = useState('')
    const [success, setSuccess] = useState(false)
    const [responseError, setResponseError] = useState({
        error: false,
        message: ""
    })

    const handleCloseForm = () => {
        setIsFormPasswordVisible(false)
        setSuccess(false)
    }

    const togglePasswordVisible = () => setPasswordVisible(!passwordVisible)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (currentPassword.length < 6 || currentPassword.length > 12 || newPassword.length < 6 || newPassword.length > 12) {
            setPasswordValidate('Debe tener entre 6 y 12 caracteres')
            return
        } else {
            setPasswordValidate('')
        }

        try {
            const response = await fetch(`https://api-todolist-t4ba.onrender.com/api/user/updatePassword/${userId}?currentPassword=${currentPassword}&newPassword=${newPassword}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (response.ok) {
                setSuccess(true)
                setResponseError({
                    error: false,
                    message: ""
                })

                setCurrentPassword('')
                setNewPassword('')

            } else {
                const responseData = await response.json()
                setResponseError({
                    error: true,
                    message: responseData.message
                })
            }

        } catch (err) {
            console.error(err)
        }
    }

    return (
        <form className={`form-password ${isFormPasswordVisible ? 'visible' : ''}`} onSubmit={handleSubmit}>
            <h2>Update Password</h2>
            <div className="form-group">
                <label htmlFor="currentPassword" className="form-label">Current Password</label>
                <div className='box-password'>
                    <input type={passwordVisible ? 'text' : 'password'} id="currentPassword" name="currentPassword" className="form-input" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}  required />
                    <VisibilityIcon className='icon-visibility' onClick={togglePasswordVisible} />
                </div>
                {
                    passwordValidate
                        ? <p className='error-message input'>{passwordValidate}</p>
                        : <p></p>
                }
            </div>
            <div className="form-group">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <div className='box-password'>
                    <input type={passwordVisible ? 'text' : 'password'} id="newPassword" name="newPassword" className="form-input" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}  required />
                    <VisibilityIcon className='icon-visibility' onClick={togglePasswordVisible} />
                </div>
                {
                    passwordValidate
                        ? <p className='error-message input'>{passwordValidate}</p>
                        : <p></p>
                }
            </div>
            {
                success === true
                    ? <p className='registration'>Se actualizo la contraseña</p>
                    : <p></p>
            }
            {
                responseError?.error === true
                    ? <p className='error-message login'>{responseError?.message}</p>
                    : <p></p>
            }
            <div className="form-group">
                <button type="submit" className="btn-update">Update</button>
                <button type="button" className="btn-close" onClick={handleCloseForm}>Close</button>
            </div>
        </form>
    )
}

UpdatePassword.propTypes = {
    userId: PropTypes.number.isRequired,
    accessToken: PropTypes.string.isRequired,
    isFormPasswordVisible: PropTypes.bool,
    setIsFormPasswordVisible: PropTypes.func
}