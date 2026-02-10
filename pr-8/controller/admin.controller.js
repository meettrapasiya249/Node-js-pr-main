const adminModel = require('../model/admin.model')

/* ================= LOGIN ================= */
const loginPage = (req, res) => {
    res.render('admin/login')
}

const login = async (req, res) => {
    try {
        const { email, adminPassword } = req.body

        if (!email || !adminPassword) {
            req.flash('error', 'Email and password are required')
            return res.redirect('/admin/login')
        }

        const admin = await adminModel.findOne({ email })

        if (!admin) {
            req.flash('error', 'Invalid Email')
            return res.redirect('/admin/login')
        }

        if (admin.adminPassword !== adminPassword) {
            req.flash('error', 'Invalid Password')
            return res.redirect('/admin/login')
        }

        req.session.adminId = admin._id
        req.session.adminName = admin.adminName
        req.session.email = admin.email

        req.flash('success', 'Login successful')
        res.redirect('/admin/view-admin')

    } catch (error) {
        console.error(error)
        req.flash('error', 'Login failed')
        res.redirect('/admin/login')
    }
}

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin/login')
    })
}

/* ================= ADD ADMIN ================= */
const addAdminPage = async (req, res) => {
    const currentAdmin = await adminModel.findById(req.session.adminId)
    res.render('admin/add-admin', { currentAdmin })
}

const addAdmin = async (req, res) => {
    try {
        const { adminName, adminPassword, email, mobile, gender } = req.body
        const profileImg = req.file ? req.file.filename : ''

        await adminModel.create({
            adminName,
            adminPassword,
            email,
            mobile,
            gender,
            profileImg,
            date: new Date().toLocaleDateString()
        })

        req.flash('success', 'Admin added successfully')
        res.redirect('/admin/view-admin')

    } catch (error) {
        console.error(error)
        req.flash('error', 'Failed to add admin')
        res.redirect('/admin/add-admin')
    }
}

/* ================= VIEW ADMIN ================= */
const viewAdmin = async (req, res) => {
    const admins = await adminModel.find()
    const currentAdmin = await adminModel.findById(req.session.adminId)
    res.render('admin/view-admin', { admins, currentAdmin })
}

/* ================= DELETE ADMIN ================= */
const deleteAdmin = async (req, res) => {
    await adminModel.findByIdAndDelete(req.params.id)
    req.flash('success', 'Admin deleted successfully')
    res.redirect('/admin/view-admin')
}

/* ================= EDIT ADMIN ================= */
const editProfilePage = async (req, res) => {
    const admin = await adminModel.findById(req.params.id)
    const currentAdmin = await adminModel.findById(req.session.adminId)
    res.render('admin/edit-admin', { admin, currentAdmin })
}

const updateProfile = async (req, res) => {
    try {
        const { adminName, email, mobile, gender, adminPassword } = req.body
        const updateData = { adminName, email, mobile, gender }

        if (adminPassword) updateData.adminPassword = adminPassword
        if (req.file) updateData.profileImg = req.file.filename

        await adminModel.findByIdAndUpdate(req.params.id, updateData)
        req.flash('success', 'Profile updated successfully')
        res.redirect('/admin/view-admin')

    } catch (error) {
        console.error(error)
        req.flash('error', 'Update failed')
        res.redirect('/admin/view-admin')
    }
}

/* ================= CHANGE PASSWORD ================= */


const changePasswordPage = async (req, res) => {
    const currentAdmin = await adminModel.findById(req.session.adminId)
    res.render('admin/change-password', { currentAdmin })
}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body
        const admin = await adminModel.findById(req.session.adminId)

        if (admin.adminPassword !== currentPassword) {
            req.flash('error', 'Old password incorrect')
            return res.redirect('/admin/change-password')
        }

        if (newPassword !== confirmPassword) {
            req.flash('error', 'Passwords do not match')
            return res.redirect('/admin/change-password')
        }

        admin.adminPassword = newPassword
        await admin.save()

        req.flash('success', 'Password changed successfully')
        res.redirect('/admin/view-admin')

    } catch (error) {
        console.error(error)
        req.flash('error', 'Password change failed')
        res.redirect('/admin/change-password')
    }
}

/* ================= VIEW PROFILE ================= */
const viewProfile = async (req, res) => {
    const currentAdmin = await adminModel.findById(req.session.adminId)

    if (!currentAdmin) {
        req.flash('error', 'Admin not found')
        return res.redirect('/admin/login')
    }

    res.render('admin/view-profile', { currentAdmin })
}

module.exports = {
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
}