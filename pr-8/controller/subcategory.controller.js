const subcategoryModel = require('../model/subcategory.model');
const categoryModel = require('../model/category.model');
const fs = require('fs');
const path = require('path');

/* ================= VIEW SUBCATEGORY (With Search + Filter + Grouping) ================= */
const viewSubcategory = async (req, res) => {
    try {
        const { search, category } = req.query;

        let filter = {};

        // 🔍 Search by Subcategory Name
        if (search) {
            filter.subcategoryName = {
                $regex: search,
                $options: "i"
            };
        }

        // 🎯 Filter by CategoryId
        if (category && category !== "all") {
            filter.categoryId = category;
        }

        // Fetch subcategories with populated category
        const subcategories = await subcategoryModel
            .find(filter)
            .populate('categoryId');

        const groupedData = {};

        subcategories.forEach(sub => {
            if (sub.categoryId) {
                const catName = sub.categoryId.categoryName;
                const catImg = sub.categoryId.profileImg;

                if (!groupedData[catName]) {
                    groupedData[catName] = {
                        categoryImage: catImg,
                        subItems: []
                    };
                }

                groupedData[catName].subItems.push(sub);
            }
        });

        // Fetch all categories for dropdown filter
        const categories = await categoryModel.find();

        res.render('subcategory/view-subcategory', {
            groupedData,
            categories,
            search,
            category
        });

    } catch (error) {
        console.error("Error in viewSubcategory:", error);
        res.render('subcategory/view-subcategory', {
            groupedData: {},
            categories: [],
            search: "",
            category: "all"
        });
    }
};


/* ================= ADD SUBCATEGORY PAGE ================= */
const addSubcategoryPage = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        res.render('subcategory/add-subcategory', { categories });
    } catch (error) {
        console.error(error);
        res.redirect('/subcategory/view-subcategory');
    }
};


/* ================= ADD SUBCATEGORY ================= */
const addSubcategory = async (req, res) => {
    try {
        const { categoryId, subcategoryName } = req.body;

        await subcategoryModel.create({
            categoryId,
            subcategoryName
        });

        req.flash('success', 'SubCategory added successfully');
        res.redirect('/subcategory/view-subcategory');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to add subcategory');
        res.redirect('/subcategory/add-subcategory');
    }
};


/* ================= EDIT SUBCATEGORY PAGE ================= */
const editSubcategoryPage = async (req, res) => {
    try {
        const subcategory = await subcategoryModel.findById(req.params.id);
        const categories = await categoryModel.find();

        if (!subcategory) {
            req.flash('error', 'SubCategory not found');
            return res.redirect('/subcategory/view-subcategory');
        }

        res.render('subcategory/edit-subcategory', { subcategory, categories });
    } catch (error) {
        console.error(error);
        res.redirect('/subcategory/view-subcategory');
    }
};


/* ================= UPDATE SUBCATEGORY ================= */
const updateSubcategory = async (req, res) => {
    try {
        const { categoryId, subcategoryName } = req.body;

        await subcategoryModel.findByIdAndUpdate(req.params.id, {
            categoryId,
            subcategoryName
        });

        req.flash('success', 'SubCategory updated successfully');
        res.redirect('/subcategory/view-subcategory');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to update subcategory');
        res.redirect('/subcategory/view-subcategory');
    }
};


/* ================= DELETE SUBCATEGORY ================= */
const deleteSubcategory = async (req, res) => {
    try {
        const subId = req.params.id;
        const deletedSub = await subcategoryModel.findByIdAndDelete(subId);

        if (!deletedSub) {
            req.flash('error', 'SubCategory not found');
            return res.redirect('/subcategory/view-subcategory');
        }

        req.flash('success', 'SubCategory deleted successfully');
        res.redirect('/subcategory/view-subcategory');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to delete subcategory');
        res.redirect('/subcategory/view-subcategory');
    }
};


module.exports = {
    viewSubcategory,
    addSubcategoryPage,
    addSubcategory,
    editSubcategoryPage,
    updateSubcategory,
    deleteSubcategory
};