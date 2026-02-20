const extracategoryModel = require('../model/extracategory.model');
// IN DONO MODELS KO IMPORT KARNA COMPULSORY HAI TAAKI POPULATE CRASH NA HO
const categoryModel = require('../model/category.model'); 
const subcategoryModel = require('../model/subcategory.model');
const fs = require('fs');
const path = require('path');

// 1. VIEW ALL EXTRACATEGORIES
const viewextracategory = async (req, res) => {
    try {
        // FIX: Yahan hum string 'category' ki jagah direct model variable (categoryModel) pass kar rahe hain
        const data = await extracategoryModel.find()
            .populate({ path: 'categoryId', model: categoryModel })
            .populate({ path: 'subcategoryId', model: subcategoryModel });

        const groupedData = {};
        data.forEach(item => {
            if (item.categoryId) {
                const catName = item.categoryId.categoryName || "Unknown";
                const catImg = item.categoryId.profileImg || "";

                if (!groupedData[catName]) {
                    groupedData[catName] = {
                        categoryImage: catImg,
                        subItems: []
                    };
                }
                groupedData[catName].subItems.push(item);
            }
        });
        res.render('extracategory/view-extracategory', { groupedData });
    } catch (error) {
        console.error("View Error Details:", error);
        res.render('extracategory/view-extracategory', { groupedData: {} });
    }
};

// 2. ADD PAGE RENDER
const addextracategoryPage = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        res.render('extracategory/add-extracategory', { categories });
    } catch (error) {
        res.redirect('/extracategory/view-extracategory');
    }
};

// 3. AJAX: GET SUBCATEGORIES
const getSubcategories = async (req, res) => {
    try {
        const subcategories = await subcategoryModel.find({ categoryId: req.params.id });
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// 4. CREATE EXTRACATEGORY
const addextracategory = async (req, res) => {
    try {
        const { categoryId, subcategoryId, extracategoryName } = req.body;
        await extracategoryModel.create({
            categoryId,
            subcategoryId,
            extracategoryName,
            profileImg: req.file ? req.file.filename : ""
        });
        res.redirect('/extracategory/view-extracategory');
    } catch (error) {
        res.redirect('/extracategory/add-extracategory');
    }
};

// 5. DELETE EXTRACATEGORY
const deleteextracategory = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await extracategoryModel.findById(id);
        if (data && data.profileImg) {
            const imgPath = path.join(__dirname, '../uploads', data.profileImg);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }
        await extracategoryModel.findByIdAndDelete(id);
        res.redirect('/extracategory/view-extracategory');
    } catch (error) {
        res.redirect('/extracategory/view-extracategory');
    }
};

// 6. EDIT PAGE RENDER
const editextracategoryPage = async (req, res) => {
    try {
        const id = req.params.id;
        const categories = await categoryModel.find();
        const singleData = await extracategoryModel.findById(id)
            .populate({ path: 'categoryId', model: categoryModel })
            .populate({ path: 'subcategoryId', model: subcategoryModel });
        
        const subcategories = await subcategoryModel.find({ categoryId: singleData.categoryId._id });
        res.render('extracategory/edit-extracategory', { categories, subcategories, singleData });
    } catch (error) {
        res.redirect('/extracategory/view-extracategory');
    }
};

// 7. UPDATE EXTRACATEGORY
const updateextracategory = async (req, res) => {
    try {
        const id = req.params.id;

        const updatedData = {
            extracategoryName: req.body.extracategoryName,
            categoryId: req.body.categoryId,
            subcategoryId: req.body.subcategoryId
        };

        // Agar image upload hui hai
        if (req.file) {
            updatedData.profileImg = req.file.filename;
        }

        await extracategoryModel.findByIdAndUpdate(id, updatedData);

        res.redirect('/extracategory/view-extracategory');

    } catch (error) {
        console.log(error);
        res.redirect('/extracategory/view-extracategory');
    }
};

module.exports = {
    addextracategoryPage,
    addextracategory,
    viewextracategory,
    deleteextracategory,
    getSubcategories,
    editextracategoryPage,
    updateextracategory    
};