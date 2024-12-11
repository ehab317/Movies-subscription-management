import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, useParams, useNavigate } from "react-router-dom"
import axiosRequest from "../../config/axiosConfig"

/**
 * EditMember component
 *
 * This component allows users to edit an existing member's details such as Name, Email, and City.
 * It retrieves the member with the given id from the Redux store and displays the details in a form.
 * On form submission, it validates the input fields and sends a PUT request to update the member.
 * Displays success or error messages based on the result of the request. If the request fails with
 * a 401 status code, it logs the user out and navigates to the home page after a delay.
 *
 * @returns A React component
 */
const EditMember = () => {

    const [member, setMember] = useState({Name: '', Email: '', City: ''})
    const [message, setMessage] = useState('')
    const url = process.env.REACT_APP_SUBWS
    const members = useSelector(state => state.members.members)
    const {id} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        getMember()
    }, [members])

    /**
     * Retrieves the member with the given id from the Redux store and updates the component state
     * @function
     * @returns {void}
     */
    const getMember = () => {
        const member = members.find(member => member._id === id)
        setMember(member)
    }

    /**
     * Handles the member form submission. Validates the input fields and sends a
     * PUT request to update the member. Displays success or error messages based
     * on the result of the request. If the request fails with a 401 status code, it
     * logs the user out and navigates to the home page after a delay.
     * @function
     * @async
     * @returns {void}
     */
    const handleClick = async () => {
        if (!member.Name || !member.Email || !member.City) {
            setMessage('All fields are required')
            return
        }
        try {
            const {data} = await axiosRequest.put(`${url}/members/editmember`, member)
            setMessage(data.message)
            dispatch({type: 'EDIT_MEMBER', member: data.member})
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
            <h2>Edit Member</h2>
            <div  style={{border: '1px solid black', padding: '10px'}}>
                <h3>Add new member</h3>
                <form>
                    <label>Name: <input type="text" name="name" value={member.Name} onChange={(e) => setMember({...member, Name: e.target.value})} /></label><br/>
                    <label>Email: <input type="text" name="Email" value={member.Email} onChange={(e) => setMember({...member, Email: e.target.value})} /></label><br/>
                    <label>City: <input type="text" name="City" value={member.City} onChange={(e) => setMember({...member, City: e.target.value})} /></label><br/>
                </form>
                {message && <p>{message}</p>}
                <button style={{marginRight: '10px'}} onClick={() => handleClick()}>Save</button>
                <Link to="/home/subscriptions/allmembers"><button style={{marginRight: '10px'}}>Cancel</button></Link>
            </div>
        </>
    )
}

export default EditMember