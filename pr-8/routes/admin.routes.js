const express = require('express')
const routes = express.Router()

const upload = require('../middalwear/imageUpload')
const { isLoggedIn } = require('../middalwear/authMiddleware')

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
    changePassword,
    viewProfile
} = require('../controller/admin.controller')
const { createToken } = require('../utils/webTokenStore')

/* ===== AUTH ===== */
routes.get('/login', loginPage)
routes.post('/login', login)
routes.get('/logout', logout)

/* ===== DEFAULT ===== */
routes.get('/', isLoggedIn, (req, res) => {
    res.redirect('/admin/view-admin')
})

/* ===== ADMIN CRUD ===== */
routes.get('/add-admin', isLoggedIn, addAdminPage)
routes.post('/add-admin', isLoggedIn, upload.single('profileImg'), addAdmin)

routes.get('/view-admin', isLoggedIn, viewAdmin)

routes.get('/edit-profile/:id', isLoggedIn, editProfilePage)
routes.post('/edit-profile/:id', isLoggedIn, upload.single('profileImg'), updateProfile)

routes.get('/delete-admin/:id', isLoggedIn, deleteAdmin)

/* ===== CHANGE PASSWORD ===== */
routes.get('/change-password', isLoggedIn, changePasswordPage)
routes.post('/change-password', isLoggedIn, changePassword)

/* ===== VIEW PROFILE ===== */
routes.get('/view-profile', isLoggedIn, viewProfile)

/* ===== GO TO WEB (one-click, no re-login) ===== */
routes.get('/goto-web', isLoggedIn, (req, res) => {
    try {
        const token = createToken(req.session.adminId, 60) // valid 60s
        res.redirect(`/web?token=${token}`)
    } catch (error) {
        console.error('Failed to create web token', error)
        res.redirect('/admin/view-profile')
    }
})

module.exports = routes