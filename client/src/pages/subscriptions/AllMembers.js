import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link, Routes, Route, useParams } from "react-router-dom"
import axiosRequest from "../../config/axiosConfig"
import MemberMovies from "../../components/MemberMovies"

/**
 * Component for displaying all members and handling delete of members
 * If the user has appropriate permissions, they can edit or delete members
 * The component displays a list of members with their details and provides
 * links to edit or delete a member. If the user does not have appropriate
 * permissions, they are only able to view the list of members.
 * On deletion, it sends a DELETE request to the server and updates the state
 * accordingly. If the request fails and the status is 401, it logs the user out
 * after 3 seconds.
 * @function
 * @returns {JSX.Element} A JSX element containing a list of members and a link to edit or delete a member
 */
const AllMembers = () => {

    const [members, setMembers] = useState([])
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const subUrl = process.env.REACT_APP_SUBWS
    const {id} = useParams()
    const userPerms = useSelector(state => state.user.permissions)

    useEffect(() => {
        getAllMembers()
    },[])

    /**
     * Retrieves all members and updates the redux state with the list of members
     * If the request fails and the status is 401, it logs the user out after 3 seconds
     * @function
     * @async
     * @returns {void}
     */
    const getAllMembers = async () => {
        try {
            const {data} = await axiosRequest.get(`${subUrl}/members`)
            if (id) {
                const member = data.members.find(member => member._id === id)
                setMembers([member])
            } else {
                setMembers(data.members)
            }
            dispatch({type: 'SET_MEMBERS', members: data.members})
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

/**
 * Handles the deletion of a member. Sends a DELETE request to the server
 * and updates the state accordingly. If the request is successful, it
 * removes the member from the local state and displays a success message.
 * If the request fails with a 401 status code, it logs the user out and
 * navigates to the home page after a delay. Displays error messages
 * based on the result of the request.
 * 
 * @async
 * @param {string} id - The id of the member to be deleted
 */
    const handleDelete = async (id) => {
        try {
            const {data} = await axiosRequest.delete(`${subUrl}/members/deletemember/${id}`)
            if (data.success) {
                dispatch({type: 'DELETE_MEMBER', id: id})
                setMembers(members.filter(member => member._id !== id))
                setMessage(data.message)
            }
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
            <h2>All Members</h2>
            {
            members.length ? (
                <div>
                    {
                        members.map(member => (
                            <div  style={{border: '1px solid black', width: '50%', margin: '20px auto', textAlign: 'left', padding: '10px'}} key={member._id}>
                                <h3>{member.Name}</h3>
                                <p>Email: {member.Email}</p>
                                <p>City: {member.City}</p>
                                {userPerms.includes('Update Subscriptions') && <Link to={`editmember/${member._id}`}><button style={{marginRight: '10px'}}>Edit</button></Link>}
                                {userPerms.includes('Delete Subscriptions') &&<button style={{marginRight: '10px'}} onClick={(e) => handleDelete(member._id)}>Delete</button>}
                                <Routes>
                                    <Route path="/*" element={<MemberMovies member={member} />} />
                                </Routes>
                            </div>
                        ))
                        
                    }
                </div>
            ) : (
                <p>leading</p>
            )
            }
            {message && <p>{message}</p>}
        </>
    )
}

export default AllMembers