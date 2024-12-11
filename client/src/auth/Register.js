import {useState} from 'react'
import { useNavigate } from 'react-router'
import axiosRequest from '../config/axiosConfig'
const cinemaUrl = process.env.REACT_APP_CINEMAWS

/**
 * Register component that handles user registration.
 * 
 * This component renders a registration form where users can input their username and password.
 * Upon submission, it sends a registration request to the server and processes the response.
 * If the registration is successful, it displays a success message and navigates to the home page.
 * If the registration fails, it displays an appropriate error message.
 */
const Register = () => {

    const [user, setUser] = useState({name: '', password: ''})
    const [message, setMessage] = useState('')
    const navigate = useNavigate()



/**
 * Handles the registration form submission.
 * 
 * This function sends a registration request to the server and processes the response.
 * If the registration is successful, it displays a success message and navigates to the home page after a delay.
 * If the registration fails, it displays an appropriate error message.
 */
    const handleClick = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axiosRequest.post(`${cinemaUrl}/users/register`, user)
            setMessage(data.message)
            setTimeout(() => {
                navigate('/')
            }, 3000)
        } catch (error) {
            setMessage(error.response.data.message)
        }
    }

    return (
        <>
        <h1>Register</h1>
            <form> 
                User Name: <input type="text" name="username" onChange={(e) => setUser({...user, name: e.target.value})}/>
                <br/>
                <br/>
                Password: <input type="text" name="password" onChange={(e) => setUser({...user, password: e.target.value})}/>
                <br/>
                <br/>
                <button onClick={(e) => handleClick(e)}>Register</button>
            </form>
            <br/>
            <p>{message && message}</p>
        </>
    )
}

export default Register