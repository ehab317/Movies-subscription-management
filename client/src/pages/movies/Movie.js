import { useState, useEffect } from "react"
import axiosRequest from "../../config/axiosConfig"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"

/**
 * AllMovies component
 *
 * This component displays details of a specific movie, including its name,
 * premiered year, genres, and an image. It lists members who have watched
 * the movie, providing links to member details.
 * 
 * The component allows users with appropriate permissions to edit or delete
 * the movie. On deletion, it sends a DELETE request to the server and updates
 * the state accordingly.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.movie - The movie object containing details like Name, Genres, Image, etc.
 * @param {Function} props.removeMovie - A function to remove the movie from the listings.
 * @param {Array} props.members - An array of members who have watched the movie.
 */
const AllMovies = (props) => {

    const[message, setMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const subUrl  = process.env.REACT_APP_SUBWS
    const {movie, removeMovie, members} = props
    const userPerms = useSelector(state => state.user.permissions)

    useEffect(() => {
        console.log(movie)
    },[])

    /**
     * Handles the deletion of a movie. Sends a DELETE request to the server
     * and updates the state accordingly. If the request fails with a 401 status
     * code, it logs the user out and navigates to the home page after a delay.
     * Displays success or error messages based on the result of the request.
     * @param {React.MouseEvent<HTMLFormElement>} e - The event object
     * @param {string} id - The id of the movie to be deleted
     */
    const handleDelete = async (e, id) => {
        e.preventDefault()
        try {
            const {data} = await axiosRequest.delete(`${subUrl}/movies/deletemovie/${id}`)
            if (data.success) {
                dispatch({type: 'DELETE_MOVIE', id: id})
                removeMovie(id)
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
            <div  style={{border: '1px solid black', width: '50%', margin: '20px auto', textAlign: 'left', padding: '10px'}} key={movie._id}>
                <p>{movie.Name}, {movie.Premiered.slice(0, 4)}</p>
                <p>Genres: {movie.Genres.map(genre => `${genre}, `)}</p>
                <div style={{display: 'flex'}}>
                <img src={movie.Image} alt={movie.Name} style={{width: '100px'}}/>
                <div style={{border: '1px solid black', margin: '0 20px', padding: '5px'}}>
                <h4>Subscriptions Watched</h4>
                <ul>
                    {
                        !movie && !movie.subscriptions.length && <li>Loading</li>
                    }
                    {
                        movie && movie.subscriptions.length && movie.subscriptions.map((sub) => {
                            const member = members.find(member => member._id === sub.MemberId)
                            if (member) {
                            const memberSub = member.subscriptions.find(s => s.MovieId._id === movie._id)
                            return <li key={member._id}><Link to={`/home/subscriptions/allmembers/${member._id}`}>{member.Name}</Link>, {memberSub.date.slice(0, 10)}</li>
                            }
                        })
                    }
                </ul>
                </div>
                </div>
                <br/>
                {userPerms.includes('Update Movies') && <Link to={`/home/editmovie/${movie._id}`}><button style={{marginRight: '10px'}}>Edit</button></Link>}
                {userPerms.includes('Delete Movies') && <button style={{marginRight: '10px'}} onClick={(e) => handleDelete(e, movie._id)}>Delete</button>}
                {message && <p>{message}</p>}
            </div>
        </>
    )
}

export default AllMovies