const loginSecret = process.env.LOGIN_SECRET
const jwtSecret = process.env.JWT_SECRET
const jwt = require('jsonwebtoken')

//authenticate user on every request & check session expiration
const auth = async (req, res, next) => {
    //check auth token
    token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    //check for initial daily login
    if (token !== loginSecret) {
        try {
            const decoded = jwt.verify(token, jwtSecret)
            next()
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'session expired' })
            } else {
                return res.status(401).json({ success: false, message: error.message })
            }
        }
    } else {
        next()
    }

}

module.exports = { auth }