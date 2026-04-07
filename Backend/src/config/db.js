const mongoose = require('mongoose');

function connectToDB(){
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Server is Connected to DB")
    })
    .catch((error) => {
        console.log("Error Connecting to DB")
        process.exit(1)
    })
}

module.exports = connectToDB