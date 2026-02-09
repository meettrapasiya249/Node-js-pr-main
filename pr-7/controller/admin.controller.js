const adminModel = require('../model/admin.model')

// ================= LOGIN PAGE =================
const loginPage = (req, res) => {
    try {
        res.render('admin/login')
    } catch (error) {
        console.log(error)
    }
}

// ================= LOGIN =================
const login = async (req, res) => {
    try {
        console.log('Login attempt:', req.body)

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

        req.session.save(err => {
            if (err) {
                console.log(err)
                req.flash('error', 'Session error')
                return res.redirect('/admin/login')
            }

            req.flash('success', 'Login successful')
            res.redirect('/admin/view-admin')
        })

    } catch (error) {
        console.error(error)
        req.flash('error', 'Login failed')
        res.redirect('/admin/login')
    }
}

// ================= LOGOUT =================
const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err)
        }
        res.redirect('/admin/login')
    })
}

// ================= ADD ADMIN =================
const addAdminPage = async (req, res) => {
    try {
        const currentAdmin = await adminModel.findById(req.session.adminId)
        res.render('admin/add-admin', { currentAdmin })
    } catch (error) {
        console.error(error)
        res.render('admin/add-admin', { currentAdmin: null })
    }
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

// ================= VIEW ADMIN =================
const viewAdmin = async (req, res) => {
    try {
        const admins = await adminModel.find()
        const currentAdmin = await adminModel.findById(req.session.adminId)
        res.render('admin/view-admin', { admins, currentAdmin })
    } catch (error) {
        console.error(error)
        res.render('admin/view-admin', { admins: [], currentAdmin: null })
    }
}

// ================= DELETE ADMIN =================
const deleteAdmin = async (req, res) => {
    try {
        await adminModel.findByIdAndDelete(req.params.id)
        req.flash('success', 'Admin deleted successfully')
        res.redirect('/admin/view-admin')
    } catch (error) {
        console.error(error)
        req.flash('error', 'Delete failed')
        res.redirect('/admin/view-admin')
    }
}

// ================= EDIT ADMIN =================
const editProfilePage = async (req, res) => {
    try {
        const admin = await adminModel.findById(req.params.id)
        const currentAdmin = await adminModel.findById(req.session.adminId)

        if (!admin) {
            return res.render('admin/edit-admin', {
                admin: null,
                currentAdmin,
                message: 'Admin not found'
            })
        }

        res.render('admin/edit-admin', {
            admin,
            currentAdmin,
            message: null
        })

    } catch (error) {
        console.error(error)
        res.redirect('/admin/view-admin')
    }
}

const updateProfile = async (req, res) => {
    try {
        const { adminName, email, mobile, gender, adminPassword } = req.body
        const updateData = { adminName, email, mobile, gender }

        if (adminPassword) {
            updateData.adminPassword = adminPassword
        }

        if (req.file) {
            updateData.profileImg = req.file.filename
        }

        await adminModel.findByIdAndUpdate(req.params.id, updateData)
        req.flash('success', 'Profile updated successfully')
        res.redirect('/admin/view-admin')

    } catch (error) {
        console.error(error)
        req.flash('error', 'Update failed')
        res.redirect('/admin/view-admin')
    }
}

// ================= CHANGE PASSWORD PAGE =================
const changePasswordPage = async (req, res) => {
    try {
        const currentAdmin = await adminModel.findById(req.session.adminId)
        res.render('admin/change-password', { currentAdmin })
    } catch (error) {
        console.error(error)
        res.redirect('/admin/view-admin')
    }
}

// ================= CHANGE PASSWORD LOGIC =================
// ================= CHANGE PASSWORD LOGIC =================
const changePassword = async (req, res) => {
    try {
        // Dhyaan dein: EJS mein name 'currentPassword' hai, 'oldPassword' nahi
        const { currentPassword, newPassword, confirmPassword } = req.body; 
        const admin = await adminModel.findById(req.session.adminId);

        if (!admin) {
            req.flash('error', 'Admin not found');
            return res.redirect('/admin/change-password');
        }

        // Yahan 'currentPassword' check karein
        if (admin.adminPassword !== currentPassword) {
            req.flash('error', 'Old password is incorrect');
            return res.redirect('/admin/change-password');
        }

        if (newPassword !== confirmPassword) {
            req.flash('error', 'New password and confirm password do not match');
            return res.redirect('/admin/change-password');
        }

        admin.adminPassword = newPassword;
        await admin.save();

        req.flash('success', 'Password changed successfully');
        res.redirect('/admin/view-admin');

    } catch (error) {
        console.error(error);
        req.flash('error', 'Password change failed');
        res.redirect('/admin/change-password');
    }
}

// ================= EXPORT =================
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
    changePassword
}