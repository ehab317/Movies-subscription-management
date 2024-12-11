import { useSelector } from "react-redux"

/**
 * A functional component that renders a heading with a greeting message to the user.
 *
 * If the user is logged in, it displays a greeting message with the user's full name.
 * Otherwise, it displays a greeting message to a guest.
 *
 */
const Header = () => {

    const user = useSelector(state => state.user)

    return (
        <>
            { user.fullName ? <h1 style={{borderBottom: '1px solid black', paddingBottom: '10px'}}>Hello {user.fullName}</h1> : <h1 style={{borderBottom: '1px solid black', paddingBottom: '10px'}}>Hello Guest</h1>}
        </>
    )
}

export default Header