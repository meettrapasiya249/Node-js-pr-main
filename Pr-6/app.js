const express = require('express');

const app = express()
const port = 8000;

require('./config/dbconnection')

app.set('view engine','ejs')
app.use(express.urlencoded())
app.use(express.static('public'))
app.use("/uploads",express.static('uploads'))


app.use('/',require('./routes/index.routes'))



app.listen(port,()=>{
    console.log(`server start at http://localhost:${port}`)
})

