const loginSecret = process.env.LOGIN_SECRET
const jwtSecret = process.env.JWT_SECRET
const jwt = require('jsonwebtoken')

/**
 * Middleware that checks if the request has a valid authentication
 * token in the Authorization header.
 *
 * If the token is valid, the middleware calls the next function in
 * the application's request-response cycle.
 *
 * If the token is invalid or there is no token, the middleware returns
 * a 401 error response with a JSON object containing a success flag
 * set to false and a message describing the error.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the application's
 * request-response cycle.
 * @returns {Promise} A Promise that resolves if the token is valid and
 * rejects if the token is invalid or missing.
 */
const auth = async (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

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