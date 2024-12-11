import { useState } from "react"
import axiosRequest from "../../config/axiosConfig"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

/**
 * A page for adding a new member to the subscriptions database. 
 * It displays a form for the user to enter the member's details, and a button to save the new member.
 * If the user enters invalid data, it displays an error message, and if the user is not logged in, it logs them out and redirects them to the homepage.
 * @returns A React component
 */
const AddMember = () => {

    const [member, setName] = useState({Name: '', Email: '', City: ''})
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const url = process.env.REACT_APP_SUBWS


    /**
     * Handles the member form submission. Validates the input fields and sends a
     * POST request to create a new member. Displays success or error messages based
     * on the result of the request. If the request fails with a 401 status code, it
     * logs the user out and navigates to the home page after a delay.
     */
    const handleClick = async () => {
        if (!member.Name || !member.Email || !member.City) {
            setMessage('All fields are required')
            return
        }
        try {
            const {data} = await axiosRequest.post(`${url}/members/addmember`, member)
            setMessage(data.message)
            dispatch({type: 'ADD_MEMBER', member: data.member})
        } catch (error) {
            if (error.response.status === 401) {
                setMessage(`${error.response.data.message}, you will be logged out in 3 seconds`)
                setTimeout(() => {
                    dispatch({type: 'RESET_USERS'})
                    dispatch({type: 'RESET_MEMBERS'})
                    dispatch({type: 'LOGOUT'})
                    localStorage.removeItem('token')
                    navigate('/')
                }, 3000)
            } else {
                setMessage(error.response.data.message)
            }
        }
    }
    
    return (
        <>
            <h2>Add Member</h2>
            <div  style={{border: '1px solid black', padding: '10px'}}>
                <h3>Add new member</h3>
                <form>
                    <label>Name: <input type="text" name="name" onChange={(e) => setName({...member, Name: e.target.value})} /></label><br/>
                    <label>Email: <input type="text" name="Email" onChange={(e) => setName({...member, Email: e.target.value})} /></label><br/>
                    <label>City: <input type="text" name="City" onChange={(e) => setName({...member, City: e.target.value})} /></label><br/>
                </form>
                {message && <p>{message}</p>}
                <button style={{marginRight: '10px'}} onClick={() => handleClick()}>Save</button>
                <Link to="/home/subscriptions/allmembers"><button style={{marginRight: '10px'}}>Cancel</button></Link>
            </div>
        </>
    )
}

export default AddMember