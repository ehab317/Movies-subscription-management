const initialState = []

/**
 * Handles all actions related to members and updates the state accordingly.
 * 
 * @param {Object} state - The current state of the members.
 * @param {Object} action - The action to be performed, containing the type and any additional data required.
 * @returns {Object} The new state of the members.
 * 
 * The reducer supports the following action types:
 * - 'SET_MEMBERS': Sets the members list in the state using the members from the action.
 * - 'ADD_MEMBER': Adds a new member to the members list in the state.
 * - 'DELETE_MEMBER': Removes a member with a specific id from the members list.
 * - 'RESET_MEMBERS': Resets the state to the initial state.
 * - 'EDIT_MEMBER': Updates a member in the members list with the data from the action.
 * 
 * If the action type does not match any case, the current state is returned unchanged.
 */
const membersReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MEMBERS':
            return {
                ...state,
                members: action.members
            }
        case 'ADD_MEMBER':
            return {
                ...state,
                members: [...state.members, action.member]
            }
        case 'DELETE_MEMBER':
            return {
                ...state,
                members: state.members.filter(member => member._id !== action.id)
            }
        case 'RESET_MEMBERS':
            return {
                ...initialState
            }
        case 'EDIT_MEMBER':
            return {
                ...state,
                members: state.members.map(member => {
                    if (member._id === action.member._id) {
                        return action.member
                    } else {
                        return member
                    }
                })
            }
        default:
            return {
                ...state
            }
    }
}

export default membersReducer