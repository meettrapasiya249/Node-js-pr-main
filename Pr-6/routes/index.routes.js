const express = require('express')
const { deshborad } = require('../controller/index.controller')
const routes = express.Router()

routes.get('/',deshborad)

// sub routes 
routes.use('/blog',require('./blog.routes'))

module.exports = routes