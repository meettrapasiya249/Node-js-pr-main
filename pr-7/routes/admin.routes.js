const express = require('express')
const routes = express.Router()

const {
    loginPage,
    login,
    logout,
    addAdminPage,
    addAdmin,
    viewAdmin,
    deleteAdmin,
    editProfilePage,
    updateProfile,
    changePasswordPage,
    changePassword
} = require('../controller/admin.controller')

const upload = require('../middalwear/imageUpload')
const { isLoggedIn } = require('../middalwear/authMiddleware')

routes.get('/login', loginPage)
routes.post('/login', login)
routes.get('/logout', logout)

routes.get('/', isLoggedIn, (req, res) => {
    res.redirect('/admin/view-admin')
})

routes.get('/add-admin', isLoggedIn, addAdminPage)
routes.post('/add-admin', isLoggedIn, upload.single('profileImg'), addAdmin)

routes.get('/view-admin', isLoggedIn, viewAdmin)

routes.get('/edit-profile/:id', isLoggedIn, editProfilePage)
routes.post('/edit-profile/:id', isLoggedIn, upload.single('profileImg'), updateProfile)

routes.get('/delete-admin/:id', isLoggedIn, deleteAdmin)

/* ===== CHANGE PASSWORD ===== */
routes.get('/change-password', isLoggedIn, changePasswordPage)
routes.post('/change-password', isLoggedIn, changePassword)

module.exports = routes