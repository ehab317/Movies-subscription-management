import {useSelector} from 'react-redux'
import { useEffect, useState } from 'react'
import axiosRequest from '../config/axiosConfig'

/**
 * Subscribe component
 * 
 * @param {number} id - the id of the member
 * @param {array} subs - an array of the member's subscriptions
 * 
 * Renders a form to add a new movie to the member's subscriptions. 
 * Retrieves the list of movies from the store and filters out the ones the member is already subscribed to.
 * When the form is submitted, sends a POST request to the server with the movie id and date.
 * If the request is successful, displays a success message. If not, displays an error message.
 * 
 */
const Subscribe = (props) => {

    let {id, subs} = props
    const movies = useSelector(state => state.movies.movies)
    const [filteredMovies, setFilteredMovies] = useState([])
    const [movieId, setMovieId] = useState('')
    const [date, setDate] = useState('')
    const [message, setMessage] = useState('')
    const url = process.env.REACT_APP_SUBWS

    const handleClick = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axiosRequest.post(`${url}/sub/addsub`, {MemberId:id, movieId, date})
            setMessage(data.message)
        } catch (error) {
            setMessage(error.response.data.message)
        }
    }

    useEffect(() => {
        setFilteredMovies(movies.map(movie => movie).filter(id => !subs.find(sub => sub.MovieId._id === id._id)))
    }, [subs, movies] )

    return (
        <>
            <p>Add a new movie</p>
            <form>
                <select value={movieId} onChange={(e) => setMovieId(e.target.value)}>
                <option value="" disabled>Select a movie</option>
                    {filteredMovies.map(movie => <option value={movie._id} key={movie._id}>{movie.Name}</option>)}
                </select>
                <input type='date' onChange={(e) => setDate(e.target.value)}/>
            </form>
            <button onClick={(e) => handleClick(e)}>Subscribe</button>
            {message && <p>{message}</p>}
        </>
    )
}

export default Subscribe