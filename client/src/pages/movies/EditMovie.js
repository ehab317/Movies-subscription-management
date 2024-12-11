import { useParams } from "react-router"
import {Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import axiosRequest from "../../config/axiosConfig"

/**
 * EditMovie component
 * 
 * Allows users to edit a movie. The component retrieves the movie with the given id
 * from the Redux store and displays its details in a form. It handles changes to the
 * movie genres input by formatting and capitalizing each genre. On form submission,
 * it validates the input fields and sends a PUT request to update the movie. If the
 * request fails with a 401 status code, it logs the user out and navigates to the home page after a delay.
 * Displays success or error messages based on the result of the request.
 */
const EditMovie = () => {

    const {id} = useParams()
    const movies = Object.values(useSelector(state => state.movies.movies))
    const [movie, setMovie] = useState(movies.find(movie => movie._id === id))
    const subUrl = process.env.REACT_APP_SUBWS
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    /**
     * Handles changes to the movie genres input by formatting and capitalizing each genre.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The event object
     */
    const handleChange = (e) => {
        const genres = e.target.value.split(',').map(genre => genre.trim())
        const capitalizedGenres = genres.map(genre => genre.charAt(0).toUpperCase() + genre.slice(1))
        setMovie({...movie, Genres: capitalizedGenres})
    }

    /**
     * Handles the movie form submission. Validates the input fields and sends a
     * PUT request to update the movie. Displays success or error messages based
     * on the result of the request. If the request fails with a 401 status code, it
     * logs the user out and navigates to the home page after a delay.
     * @param {React.MouseEvent<HTMLFormElement>} e - The event object
     */
    const handleClick = async (e) => {
        if (!movie.Name || !movie.Genres || !movie.Genres[0] || !movie.Image || !movie.Premiered) {
            setMessage('Please fill all fields')
            return
        }
        try {
            const {data} = await axiosRequest.put(`${subUrl}/movies/updatemovie`, movie)
            setMessage(data.message)
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
            <h2>Edit Movie: {movie.Name}</h2>
            <form>
                <label>Name: </label>
                <input type="text" name="Name" defaultValue={movie.Name} onChange={(e) => setMovie({...movie, Name: e.target.value})}/><br/>
                <label>Genres: </label>
                <input type="text" name="Genres" defaultValue={movie.Genres.join(', ')} onChange={ (e) => handleChange(e)}/><br/>
                <label>Image url: </label>
                <input type="text" name="Image" defaultValue={movie.Image} onChange={(e) => setMovie({...movie, Image: e.target.value})}/><br/>
                <label>Premiered: </label>
                <input type="date" name="Premiered" defaultValue={movie.Premiered.slice(0, 10)} onChange={(e) => setMovie({...movie, Premiered: e.target.value})}/><br/>
            </form>
            <button style={{marginRight: '10px'}} onClick={(e) => handleClick(e)}>Update</button>
            <Link to='/home/movies'><button style={{marginRight: '10px'}}>Cancel</button></Link>
            <p>{message && message}</p>
        </>
    )
}

export default EditMovie