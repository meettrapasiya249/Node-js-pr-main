const subcategoryModel = require('../model/subcategory.model')
const fs = require('fs')
const path = require('path')

/* ADD PAGE */
const addsubcategoryPage = (req, res) => {
    res.render('subcategory/add-subcategory')
}

/* ADD */
const addsubcategory = async (req, res) => {
    try {
        const { subcategoryName } = req.body
        const profileImg = req.file ? req.file.filename : ''

        await subcategoryModel.create({
            subcategoryName,
            profileImg,
            date: new Date().toLocaleDateString()
        })

        req.flash('success', 'SubCategory Added Successfully')
        res.redirect('/subcategory/view-subcategory')

    } catch (error) {
        console.log(error)
        req.flash('error', 'Failed to Add SubCategory')
        res.redirect('/subcategory/add-subcategory')
    }
}

/* VIEW */
const viewsubcategory = async (req, res) => {
    try {
        const subcategories = await subcategoryModel.find()
        res.render('subcategory/view-subcategory', { subcategories })
    } catch (error) {
        console.log(error)
        res.render('subcategory/view-subcategory', { subcategories: [] })
    }
}

/* EDIT PAGE */
const editsubcategoryPage = async (req, res) => {
    try {
        const subcategory = await subcategoryModel.findById(req.params.id)
        res.render('subcategory/edit-subcategory', { subcategory })
    } catch (error) {
        req.flash('error', 'SubCategory Not Found')
        res.redirect('/subcategory/view-subcategory')
    }
}

/* UPDATE */
const updatesubcategory = async (req, res) => {
    try {
        const { subcategoryName } = req.body

        const updateData = { subcategoryName }

        if (req.file) {
            updateData.profileImg = req.file.filename
        }

        await subcategoryModel.findByIdAndUpdate(req.params.id, updateData)

        req.flash('success', 'SubCategory Updated Successfully')
        res.redirect('/subcategory/view-subcategory')

    } catch (error) {
        console.log(error)
        req.flash('error', 'Update Failed')
        res.redirect('/subcategory/view-subcategory')
    }
}

/* DELETE */
const deletesubcategory = async (req, res) => {
    try {
        const subcategory = await subcategoryModel.findById(req.params.id)

        if (!subcategory) {
            req.flash('error', 'SubCategory Not Found')
            return res.redirect('/subcategory/view-subcategory')
        }

        if (subcategory.profileImg) {
            const imagePath = path.join(__dirname, '../uploads/', subcategory.profileImg)
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
        }

        await subcategoryModel.findByIdAndDelete(req.params.id)

        req.flash('success', 'SubCategory Deleted Successfully')
        res.redirect('/subcategory/view-subcategory')

    } catch (error) {
        console.log(error)
        req.flash('error', 'Delete Failed')
        res.redirect('/subcategory/view-subcategory')
    }
}

module.exports = {
    addsubcategoryPage,
    addsubcategory,
    viewsubcategory,
    editsubcategoryPage,
    updatesubcategory,
    deletesubcategory
}