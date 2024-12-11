const initialState = []

/**
 * Handles all actions related to users and updates the state accordingly.
 * 
 * @param {Object} state - The current state of the users.
 * @param {Object} action - The action to be performed, containing the type and any additional data required.
 * @returns {Object} The new state of the users.
 * 
 * The reducer supports the following action types:
 * - 'SET_USERS': Sets the users list in the state using the users from the action.
 * - 'UPDATE_USER': Updates a user in the users list with the data from the action.
 * - 'ADD_USER': Adds a new user to the users list in the state.
 * - 'DELETE_USER': Removes a user with a specific id from the users list.
 * - 'RESET_USERS': Resets the state to the initial state.
 * 
 * If the action type does not match any case, the current state is returned unchanged.
 */
const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return {
                ...state,
                users: action.users
            }
        case 'UPDATE_USER':
            return {
                ...state,
                users: state.users.map(user => {
                    if (user._id === action.user._id) {
                        return action.user
                    } else {
                        return user
                    }
                })
            }
        case 'ADD_USER':
            return {
                ...state,
                users: [...state.users, action.user]
            }
        case 'DELETE_USER':
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.id)
            }
        case 'RESET_USERS':
            return {
                ...initialState
            }
        default:
            return state
    }
}

export default usersReducer