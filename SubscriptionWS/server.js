const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
require('./config/DB')
const port = process.env.PORT
const origin = process.env.CORS_ORIGIN
const auth = require('./utils/utils').auth
const moviesRouter = require('./controllers/moviesController')
const membersRouter = require('./controllers/membersController')
const subController = require('./controllers/subController')

//middleware
app.use(cors({
    origin: `${origin}`,
    credentials: true
}))
app.use(express.json())

//Routes
app.use('/movies', auth, moviesRouter)
app.use('/members', auth, membersRouter)
app.use('/sub', auth, subController)

//Server activation
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})