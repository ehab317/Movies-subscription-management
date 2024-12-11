const mongoose = require('mongoose')
const db_url = process.env.DB_URL
const moviesUrl = process.env.MOVIES_URL
const membersUrl = process.env.MEMBERS_URL
const axios = require('axios')
const membersRepo = require('../repositories/membersRepo')
const moviesRepo = require('../repositories/moviesRepo')

//connect to DB
mongoose.connect(db_url).then(() => {
    console.log('DB Connected')
    getInitialMembers()
    getInitialMovies()
}).catch((e) => console.log(e))

/**
 * Retrieves movies from the MOVIES_URL and adds them to the DB if it is empty
 * @function
 * @async
 * @returns {void}
 */
const getInitialMovies = async () => {
    const dbMovies = await moviesRepo.getAllMovies()
    if(!dbMovies.length) {
        const {data} = await axios.get(`${moviesUrl}`)
        data.forEach( movie => {
            newMovie = {Name: movie.name, Genres: movie.genres, Image: movie.image.original, Premiered: movie.premiered}
            moviesRepo.addMovie(newMovie)
            return
        });
    }
    console.log('movie data already exists')
}

/**
 * Retrieves members from the MEMBERS_URL and adds them to the DB if it is empty
 * @function
 * @async
 * @returns {void}
 */
const getInitialMembers = async () => {
    const dbMembers = await membersRepo.getAllMembers()
    if(!dbMembers.length) {
        const {data} = await axios.get(`${membersUrl}`)
        data.forEach( member => {
            newMember = {Name: member.name, Email: member.email, City: member.address.city}
            membersRepo.addMember(newMember)
            return
        });
    }
    console.log('member data already exists')
}