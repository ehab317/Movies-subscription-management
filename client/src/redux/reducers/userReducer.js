const initialState = {}

/**
 * User reducer function to manage the user state in the Redux store.
 * 
 * @param {Object} state - The current state of the user.
 * @param {Object} action - The action to be performed, containing the type and any additional data.
 * @returns {Object} The new state of the user.
 * 
 * The reducer supports the following action types:
 * - 'SIGN_IN': Updates the state with user details from the action. If the user's email is 'ehab@mail.com',
 *   the user is assigned admin privileges.
 * - 'LOG_OUT': Resets the state to the initial state.
 * 
 * If the action type does not match any case, the current state is returned unchanged.
 */
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SIGN_IN': {
            if (action.user.userName === 'ehab@mail.com') {
            return {
                ...state,
                id: action.user.id,
                userName: action.user.userName,
                isAdmin: true,
                fullName: action.user.fullName,
                session: action.user.session,
                created: action.user.created,
                permissions: action.user.permissions
            }
        } else {
            return {
                ...state,
                id: action.user.id,
                userName: action.user.userName,
                isAdmin: false,
                fullName: action.user.fullName,
                session: action.user.session,
                created: action.user.created,
                permissions: action.user.permissions
            }
        }
        }
        case 'LOG_OUT':
            return {
                ...initialState
            }
        default:
            return state
    }
}

export default userReducer