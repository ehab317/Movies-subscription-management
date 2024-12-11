const initialState = {}

/**
 * Handles all actions related to movies and updates the state accordingly.
 * 
 * @param {Object} state - The current state of the movies.
 * @param {Object} action - The action to be performed, containing the type and any additional data required.
 * @returns {Object} The new state of the movies.
 * 
 * The reducer supports the following action types:
 * - 'SET_MOVIES': Sets the movies list in the state using the movies from the action.
 * - 'RESET_MOVIES': Resets the state to the initial state.
 * - 'DELETE_MOVIE': Removes a movie with a specific id from the movies list.
 * 
 * If the action type does not match any case, the current state is returned unchanged.
 */
const moviesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MOVIES':
            return {
                ...state,
                movies: action.movies
            }
        case 'RESET_MOVIES':
            return {
                ...initialState
            }
        case 'DELETE_MOVIE':
            return {
                ...state,
                movies: state.movies.filter(movie => movie._id !== action.id)
        }
    default: 
        return {
            ...state
        }
    }
}

export default moviesReducer