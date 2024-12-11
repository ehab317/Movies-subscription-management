import { combineReducers } from "redux"
import userReducer from "./userReducer"
import usersReducer from "./usersReducer"
import moviesReducer from "./moviesReducer"
import membersReducer from "./membersReducer"

const rootReducer = combineReducers({
    user: userReducer, 
    systemUsers: usersReducer,
    movies: moviesReducer,
    members: membersReducer
});

export default rootReducer