import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Routes, Route, Link } from "react-router-dom"
import ManageUsers from "./users/ManageUsers"
import ManageMovies from "./movies/ManageMovies"
import ManageSubs from "./subscriptions/ManageSubs"
import AddMovie from "./movies/AddMovie"
import EditMovie from "./movies/EditMovie"

/**
 * Home component
 * 
 * The home page of the application. It displays a menu based on the user's permissions
 * and handles the logout functionality. It also renders the requested page based on the url
 * 
 * @returns {JSX.Element} The home page
 */
const Home = () => {

    const user = useSelector(state => state.user)
    const [clicked, setClicked] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!user.fullName) {
            navigate('/')
        }
    }, [user, navigate])

/**
 * Handles click events for buttons on the home page.
 *
 * Updates the `clicked` state with the id of the clicked button to highlight
 * the selected section (e.g., Movies, Subscriptions, User Management).
 *
 * @param {React.MouseEvent<HTMLButtonElement>} e - The event object
 */
    const handleClick = (e) => {
        setClicked(e.target.id)
    }

/**
 * Handles the logout functionality. Logs the user out and navigates to the login page.
 * Also deletes the token from local storage and resets the state of the application.
 * @param {React.MouseEvent<HTMLFormElement>} e - The event object
 */
    const handleLogOut = (e) => {
        e.preventDefault()
        dispatch({type: 'RESET_USERS'})
        dispatch({type: 'RESET_MEMBERS'})
        dispatch({type: 'LOG_OUT'})
        dispatch({type: 'RESET_MOVIES'})
        localStorage.removeItem('token')
        navigate('/')
    }

    
    return (
        <>
            <h1>Movies - subcsription Website</h1>
            {user.permissions.includes('View Movies') && <Link to='movies'><button style={{marginRight: '10px', backgroundColor: clicked === 'movies' && 'yellow'}} id="movies" onClick={(e) => handleClick(e)}>Movies</button></Link>}
            {user.permissions.includes('View Subscriptions') && <Link to='subscriptions'><button style={{marginRight: '10px', backgroundColor: clicked === 'subscriptions' && 'yellow'}} id="subscriptions" onClick={(e) => handleClick(e)}>Subscriptions</button></Link>}
            {user.isAdmin && <Link to='users'><button style={{marginRight: '10px', backgroundColor: clicked === 'users' && 'yellow'}} id="users" onClick={(e) => handleClick(e)}>User Management</button></Link>}
            <button onClick={ (e) => handleLogOut(e)}>Log Out</button>
            <br/>
            <Routes>
                <Route path="users/*" element={<ManageUsers />} />
                <Route path="movies" element={<ManageMovies />} />
                <Route path="movies/:id" element={<ManageMovies />} />
                <Route path="subscriptions/*" element={<ManageSubs />} />
                <Route path="addmovie" element={<AddMovie />} />
                <Route path="editmovie/:id" element={<EditMovie />} />
            </Routes>
        </>
    )
}

export default Home