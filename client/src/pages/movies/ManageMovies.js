import { useState, useEffect } from "react"
import {Link, useNavigate, useParams} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import axiosRequest from "../../config/axiosConfig"
import Movie from "../movies/Movie"


/**
 * ManageMovies
 * 
 * Component for managing movies
 * 
 * @returns {JSX.Element} A JSX element containing a list of movies and a search bar
 */
const ManageMovies = () => {

    const [clicked, setClicked] = useState('allMovies')
    const [movies, setMovies] = useState([])
    const [message, setMessage] = useState('')
    const [members, setMembers] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userPerms = useSelector(state => state.user.permissions)
    const subUrl = process.env.REACT_APP_SUBWS
    const [search, setSearch] = useState('')
    const {id} = useParams()

    useEffect(() => {
        getMovies()
        getAllMembers()
    }, [])

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
            setMembers(data.members)
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
 * Removes a movie from the movies list by its id.
 *
 * @param {string} id - The id of the movie to be removed.
 * Updates the state by filtering out the movie with the matching id.
 */
    const removeMovie = (id) => {
        setMovies(movies.filter(movie => movie._id !== id))
    }

    /**
     * Retrieves all movies and updates the redux state with the list of movies
     * If the request fails and the status is 401, it logs the user out after 3 seconds
     * @function
     * @async
     * @returns {void}
     */
    const getMovies =  async () => {
        try {
            const {data} = await axiosRequest.get(`${subUrl}/movies?offset=0&limit=9999999`)
            if (id) {
                const movie = data.movies.find(movie => movie._id === id)
                setSearch(movie.Name)
            }
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

/**
 * Handles click events for the movie management buttons.
 *
 * Updates the `clicked` state based on the id of the clicked button.
 *
 * @param {React.MouseEvent<HTMLButtonElement>} e - The event object
 */
    const handleClick = (e) => {
        setClicked(e.target.id)
    }

/**
 * Handles the search input change event.
 *
 * Updates the search state with the current value of the input field.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} e - The event object
 */
    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

    return (
        <>
        { userPerms.includes('View Movies') ? (
            <div style={{border: '1px solid black', width: '75%', margin: '20px auto', textAlign: 'left', padding: '10px'}}>
                <h1>Movies</h1>
                <Link to="allmovies"><button style={{marginRight: '10px', backgroundColor: clicked === 'allMovies' && 'yellow'}} onClick={(e) => handleClick(e)} id="allMovies">All Movies</button></Link>
                { userPerms.includes('Create Movies') &&
                    <Link to="/home/addmovie"><button style={{backgroundColor: clicked === 'addMovie' && 'yellow'}} onClick={(e) => handleClick(e)} id="addMovie">Add Movie</button></Link>
                }
                <span>Find Movie:</span><input type="text" value={search} onChange={(e) => handleSearch(e)}/>
                <h2>All Movies</h2>
                {movies.map(movie =>
                search && movie.Name.toLowerCase().includes(search.toLowerCase()) && <Movie movie={movie} members={members} removeMovie={removeMovie} key={movie._id} />)}
                {movies.map(movie =>
                !search && <Movie movie={movie} removeMovie={removeMovie} key={movie._id} members={members} />)}
                { message && <p>{message}</p> }
            </div>
        ) : (
            <div>
                <h3>You do not have permission to view this page</h3>
            </div>
        )}
        </>
    )
}

export default ManageMovies