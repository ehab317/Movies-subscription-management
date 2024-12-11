const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
require('./config/DB')
const UserRouter = require('./controllers/userController')
const port = process.env.PORT
const origin = process.env.CORS_ORIGIN
const auth = require('./utils/utils').auth

//middleware
app.use(cors({
    origin: `${origin}`,
    credentials: true
}))
app.use(express.json())

//Routes
app.use('/users', auth, UserRouter)

//Server activation
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})