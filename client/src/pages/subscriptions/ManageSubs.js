import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { Link, Route, Routes, useNavigate } from "react-router-dom"
import AddMember from "./AddMember"
import AllMembers from "./AllMembers"
import axiosRequest from "../../config/axiosConfig"
import EditMember from "./EditMember"

/**
 * ManageSubs component
 * 
 * This component manages the display and interaction of subscription-related
 * features. It renders a list of all members and provides options to add or
 * edit a member's subscription. The component also handles navigation and
 * permission-based access to subscription functionalities. If the user does
 * not have the required permissions, it displays a message indicating lack
 * of access. It fetches movies and subscriptions data on mount and updates
 * the state accordingly. If the fetch fails due to unauthorized access, it
 * logs the user out after a delay.
 * 
 * @returns {JSX.Element} JSX element for managing subscriptions
 */
const ManageSubs = () => {

    const userPerms = useSelector(state => state.user.permissions)
    const [clicked, setClicked] = useState('allMembers')
    const navigate = useNavigate()
    const subUrl = process.env.REACT_APP_SUBWS
    const [movies, setMovies] = useState([])
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()


    /**
     * Handles click events for the subscription management buttons.
     *
     * Updates the `clicked` state based on the id of the clicked button.
     *
     * @param {React.MouseEvent<HTMLButtonElement>} e - The event object
     */
    const handleClick = (e) => {
        setClicked(e.target.id)
    }

    useEffect(() => {
        getmoviesAndSubs()
        navigate('/home/subscriptions/allmembers')
    }, [])

    /**
     * Retrieves all movies and updates the state with the list of movies.
     * If the request fails and the status is 401, it logs the user out after 3 seconds.
     * @function
     * @async
     * @returns {void}
     */
    const getmoviesAndSubs = async () => {
        try {
            const {data} = await axiosRequest.get(`${subUrl}/movies?offset=0&limit=999999`)
            setMovies(data.movies)
            dispatch({type: 'SET_MOVIES', movies: data.movies})
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
            { userPerms.includes('View Subscriptions') ? (
            <div style={{border: '1px solid black', width: '75%', margin: '20px auto', textAlign: 'left', padding: '10px'}}>
                <h1>Subscriptions</h1>
                <Link to="allmembers"><button style={{marginRight: '10px', backgroundColor: clicked === 'allMembers' && 'yellow'}} onClick={(e) => handleClick(e)} id="allMembers">All Members</button></Link>
                { userPerms.includes('Create Subscriptions') &&
                    <Link to="addmember"><button style={{backgroundColor: clicked === 'addMember' && 'yellow'}} onClick={(e) => handleClick(e)} id="addMember">Add Member</button></Link>
                }
                {
                    <Routes>
                        <Route path="allmembers/:id" element={<AllMembers />} />
                        <Route path="allmembers" element={<AllMembers />} />
                        <Route path="addmember" element={<AddMember />} />
                        <Route path="allmembers/editmember/:id" element={<EditMember />} />
                    </Routes>
                }
            </div>
        ) : (
            <div>
                <h3>You do not have permission to view this page</h3>
            </div>
        )}
        </>
    )
}

export default ManageSubs