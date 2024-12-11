import { useState } from "react"
import axiosRequest from "../../config/axiosConfig"
import { useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"

/**
 * AddMovie component
 * 
 * Allows users to add a new movie to the system. The component maintains state
 * for the movie details and a message for user feedback. Handles changes to the
 * movie genres input to format and capitalize each genre. On form submission,
 * it validates the input fields and sends a POST request to create a new movie.
 * Displays success or error messages based on the result of the request.
 */
const AddMovie = () => {

    const [movie, setMovie] = useState({})
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const subUrl = process.env.REACT_APP_SUBWS

    /**
     * Handles changes to the movie genres input by formatting and capitalizing each genre
     * @param {React.ChangeEvent<HTMLInputElement>} e - The event object
     */
    const handleChange = (e) => {
        const genres = e.target.value.split(',').map(genre => genre.trim())
        const capitalizedGenres = genres.map(genre => genre.charAt(0).toUpperCase() + genre.slice(1))
        setMovie({...movie, Genres: capitalizedGenres})
    }

    /**
     * Handles the movie form submission. Validates the input fields and sends a
     * POST request to create a new movie. Displays success or error messages based
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
            const {data} = await axiosRequest.post(`${subUrl}/movies/create`, movie)
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
            <h2>Add Movie</h2>
            <form>
                <label>Name: </label>
                <input type="text" name="Name" onChange={(e) => setMovie({...movie, Name: e.target.value})}/><br/>
                <label>Genres: </label>
                <input type="text" name="Genres" onChange={ (e) => handleChange(e)}/><br/>
                <label>Image url: </label>
                <input type="text" name="Image" onChange={(e) => setMovie({...movie, Image: e.target.value})}/><br/>
                <label>Premiered: </label>
                <input type="date" name="Premiered" onChange={(e) => setMovie({...movie, Premiered: e.target.value})}/><br/>
            </form>
            <br/>
            <button style={{marginRight: '10px'}} onClick={(e) => handleClick(e)}>Save</button>
            <Link to='/home/movies'><button style={{marginRight: '10px'}}>Cancel</button></Link>
            {message && <p>{message}</p>}
        </>
    )
}

export default AddMovie