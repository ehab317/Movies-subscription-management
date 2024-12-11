import {useState} from 'react'
import axiosRequest from '../config/axiosConfig'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
const cinemaUrl = process.env.REACT_APP_CINEMAWS

/**
 * Login component that handles user authentication.
 * 
 * This component renders a login form where users can input their username and password.
 * Upon submission, it sends a login request to the server and processes the response.
 * If the login is successful, it saves the user's token in local storage and navigates to the home page.
 * If the login fails, it displays an appropriate error message.
 * 
 * It also provides a link to the registration page for new users.
 */
const Login = () => {

    const [user, setUser] = useState({name: '', password: ''})
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    /**
     * Handles the login form submission.
     * 
     * This function sends a login request to the server, and processes the response.
     * If the login is successful, it saves the user's token in local storage, dispatches the SIGN_IN action, and navigates to the home page.
     * If the login fails, it displays an appropriate error message.
     * If the login fails with a 401 status, it removes the previous token from local storage and displays a message asking the user to login again.
     */
    const handleClick = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axiosRequest.post(`${cinemaUrl}/users/login`, user)
            setMessage('')
            dispatch({type: 'SIGN_IN', user: data.user.user})
            localStorage.setItem('token', data.user.token)
            navigate(`/home`)
        } catch (error) {
            if(error.response.status === 401) {
                localStorage.removeItem('token')
                setMessage('previous session has expired, please login again')
                return
            }
            setMessage(error.response.data.message)
        }
    }

    return (
        <>
            <h1>Login</h1>
            <form> 
                User Name: <input type="text" name="username" onChange={(e) => setUser({...user, name: e.target.value})}/>
                <br/>
                <br/>
                Password: <input type="text" name="password" onChange={(e) => setUser({...user, password: e.target.value})}/>
                <br/>
                <br/>
                <button onClick={(e) => handleClick(e)}>Login</button>
            </form>
            {
                message && <p>{message}</p>
            }
            <br/>
            <p>New User? <Link to="/register">Register</Link></p>
        </>
    )
}

export default Login