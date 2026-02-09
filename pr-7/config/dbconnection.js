const mongoose = require('mongoose')


const dbconnection = ()=>{
    mongoose.connect('mongodb+srv://meet:meet%401232@cluster0.aipj3q6.mongodb.net/passport')
    .then(()=>console.log('database is connected!!!!'))
    .catch(err=>console.log(err))
}


module.exports = dbconnection()