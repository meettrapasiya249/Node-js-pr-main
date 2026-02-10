const mongoose = require('mongoose')
const adminModel = require('./model/admin.model')

require('./config/dbconnection')

const createDefaultUser = async () => {
    try {
        const user = await adminModel.findOne({ email: 'john@test.in' })
        
        if (user) {
            console.log('✅ User found in database:')
            console.log('Email:', user.email)
            console.log('Password:', user.adminPassword)
            console.log('Name:', user.adminName)
        } else {
            console.log('❌ User NOT found in database')
            console.log('Creating user now...')
            
            const newUser = await adminModel.create({
                adminName: 'John',
                adminPassword: '12345',
                email: 'john@test.in',
                mobile: '9876543210',
                gender: 'Male',
                profileImg: 'default.png',
                date: new Date().toLocaleDateString()
            })
            
            console.log('✅ User created successfully!')
            console.log('Email: john@test.in')
            console.log('Password: 12345')
        }
        
        process.exit(0)
    } catch (error) {
        console.error('Error:', error)
        process.exit(1)
    }
}

createDefaultUser()
