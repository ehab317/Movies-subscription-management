import { useState } from 'react'
import Subscribe from './Subscribe'
import {Link} from 'react-router-dom'

/**
 * A component that displays a list of movies watched by a member, with a button
 * to subscribe to a new movie. When the button is clicked, a Subscribe component
 * is rendered, allowing the user to select a movie to subscribe to.
 * @param {Object} props
 * @param {Object} props.member the member object, containing the member's id, name, and subscriptions
 */
const MemberMovies = (props) => {
    const [member, setMember] = useState(props.member)
    const [clicked, setClicked] = useState(false)

    return (
        <div style={{border: '1px solid black', margin: '20px auto', textAlign: 'left', padding: '10px'}}>
            <h3>Movies watched</h3>
            <button onClick={() => setClicked(!clicked)}>Subscribe to a new movie</button>
            {clicked && <Subscribe id={member._id} subs={member.subscriptions}/>}
            <ul>
                {member.subscriptions.map((movie) => (
                    <li key={movie.MovieId._id}>
                        <Link to={`/home/movies/${movie.MovieId._id}`}>{movie.MovieId.Name}</Link><span>, {movie.date.slice(0,10)}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default MemberMovies