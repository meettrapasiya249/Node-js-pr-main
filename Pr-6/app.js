const express = require('express');


// server configration
const app = express()
const port = 8080;

//database connection
require('./config/dbconnection')

// middalware
app.set('view engine','ejs')
app.use(express.urlencoded())
app.use(express.static('public'))
app.use("/uploads",express.static('uploads'))


// main route 
app.use('/',require('./routes/index.routes'))



app.listen(port,()=>{
    console.log(`server start at http://localhost:${port}`)
})

