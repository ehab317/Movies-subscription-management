const mongoose = require('mongoose')
const url = process.env.DB_URL

//connect to DB
mongoose.connect(url).then(() => {
    console.log('DB Connected')
}).catch((e) => console.log(e))