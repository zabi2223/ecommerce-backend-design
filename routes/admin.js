import express from "express";
import User from "../database/user.js";
import category from "../database/category.js";
import product from "../database/product.js";
import multer from 'multer';
import bcrypt from 'bcryptjs';

const router = express.Router();

// ------------------- Middleware -------------------
function isAdminAuthenticated(req, res, next) {
    if (req.session.admin) return next();
    res.redirect('/user/login');
}

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ------------------- Dashboard -------------------
router.get('/', async (req, res) => {
    res.render("admin/index");
});

// ------------------- Profile -------------------
router.get('/profile', isAdminAuthenticated, async (req, res) => {
    try {
        const admin = await User.findById(req.session.admin._id);
        if (!admin) return res.redirect('/admin/login?message=Admin+not+found&type=error');
        const message = req.query.message || null;
        const type = req.query.type || 'success';
        res.render("admin/profile", { admin, message, type });
    } catch (error) {
        console.error('Profile Fetch Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/logout', isAdminAuthenticated, (req, res) => {
    delete req.session.admin;
    res.redirect('/user');
});

router.post('/profile/update', isAdminAuthenticated, upload.single('profilePic'), async (req, res) => {
    try {
        const adminSession = req.session.admin;
        const { name, email, oldPassword, newPassword } = req.body;

        if (!adminSession) return res.redirect('/admin/login?message=Please+login&type=error');

        const admin = await User.findById(adminSession._id);
        if (!admin) return res.redirect('/admin/login?message=Admin+not+found&type=error');

        admin.name = name;
        admin.email = email;

        if (oldPassword && newPassword) {
            const isMatch = await bcrypt.compare(oldPassword, admin.password);
            if (!isMatch) {
                return res.redirect('/admin/profile?message=Old+password+incorrect&type=error');
            }
            admin.password = await bcrypt.hash(newPassword, 10);
        }

        if (!admin.profilePic) admin.profilePic = {};
        if (req.file) {
            admin.profilePic.data = req.file.buffer;
            admin.profilePic.contentType = req.file.mimetype;
        }

        await admin.save();
        req.session.admin = admin.toObject();

        res.redirect('/admin/profile?message=Profile+updated+successfully&type=success');
    } catch (error) {
        console.error('Profile Update Error:', error);
        res.redirect('/admin/profile?message=Server+error&type=error');
    }
});

// ------------------- Category -------------------
router.get('/category', isAdminAuthenticated, async (req, res) => {
    try {
        const categories = await category.find().sort({ name: 1 });
        const message = req.query.message || null;
        const type = req.query.type || 'success';
        res.render("admin/category", {
            categories,
            editCategory: null,
            message,
            type
        });
    } catch (err) {
        console.error(err);
        res.redirect("/admin/category?message=Server+error&type=error");
    }
});

router.post('/category/add', isAdminAuthenticated, async (req, res) => {
    try {
        const { name } = req.body;
        const existing = await category.findOne({ name });
        if (existing) {
            return res.redirect("/admin/category?message=Category+already+exists&type=error");
        }
        const newCategory = new category({ name });
        await newCategory.save();
        res.redirect("/admin/category?message=Category+added+successfully&type=success");
    } catch (err) {
        console.error(err);
        res.redirect("/admin/category?message=Server+error&type=error");
    }
});
router.get('/category/edit/:id', isAdminAuthenticated, async (req, res) => {
    try {
        const editCategory = await category.findById(req.params.id);
        const categories = await category.find().sort({ name: 1 });
        if (!editCategory) return res.redirect("/admin/category?message=Category+not+found&type=error");

        const message = req.query.message || null;
        const type = req.query.type || 'success';
        res.render("admin/category", { categories, editCategory, message, type });
    } catch (err) {
        console.error(err);
        res.redirect("/admin/category?message=Server+error&type=error");
    }
});

// ================= Update Category =================
router.post('/category/update/:id', isAdminAuthenticated, async (req, res) => {
    try {
        const { name } = req.body;

        // Update the category name
        const updatedCategory = await category.findByIdAndUpdate(req.params.id, { name }, { new: true });

        if (!updatedCategory) {
            return res.redirect("/admin/category?message=Category+not+found&type=error");
        }

        // Update all products that belong to this category
        await product.updateMany(
            { category: updatedCategory._id },
            { $set: { categoryName: name } } // you need a field `categoryName` in Product schema
        );

        res.redirect("/admin/category?message=Category+updated+successfully&type=success");
    } catch (err) {
        console.error(err);
        res.redirect("/admin/category?message=Server+error&type=error");
    }
});

// ================= Delete Category =================
router.post('/category/delete/:id', isAdminAuthenticated, async (req, res) => {
    try {
        const deletedCategory = await category.findByIdAndDelete(req.params.id);

        if (!deletedCategory) {
            return res.redirect("/admin/category?message=Category+not+found&type=error");
        }

        // Delete all products under this category
        await product.deleteMany({ category: deletedCategory._id });

        res.redirect("/admin/category?message=Category+and+products+deleted+successfully&type=success");
    } catch (err) {
        console.error(err);
        res.redirect("/admin/category?message=Server+error&type=error");
    }
});
// ------------------- Product -------------------
router.get('/product', isAdminAuthenticated, async (req, res) => {
    try {
        const products = await product.find().populate("category").sort({ name: 1 });
        const categories = await category.find().sort({ name: 1 });
        const message = req.query.message || null;
        const type = req.query.type || 'success';
        res.render("admin/product", { products, categories, editProduct: null, message, type });
    } catch (err) {
        console.error(err);
        res.redirect("/admin/product?message=Server+error&type=error");
    }
});

router.post('/product/add', isAdminAuthenticated, upload.single('productPic'), async (req, res) => {
    try {
        const { name, brand, description, price, stock, category } = req.body;
        const newProduct = new product({ name, brand, description, price, stock, category });

        if (req.file) {
            newProduct.productPic = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        await newProduct.save();
        res.redirect("/admin/product?message=Product+added+successfully&type=success");
    } catch (err) {
        console.error(err);
        res.redirect("/admin/product?message=Server+error&type=error");
    }
});

router.get('/product/edit/:id', isAdminAuthenticated, async (req, res) => {
    try {
        const editProduct = await product.findById(req.params.id);
        const products = await product.find().populate("category").sort({ name: 1 });
        const categories = await category.find().sort({ name: 1 });

        if (!editProduct) return res.redirect("/admin/product?message=Product+not+found&type=error");
        const message = req.query.message || null;
        const type = req.query.type || 'success';
        res.render("admin/product", { products, categories, editProduct, message, type });
    } catch (err) {
        console.error(err);
        res.redirect("/admin/product?message=Server+error&type=error");
    }
});

router.post('/product/update/:id', isAdminAuthenticated, upload.single('productPic'), async (req, res) => {
    try {
        const { name, brand, description, price, stock, category } = req.body;
        const updateData = { name, brand, description, price, stock, category };

        if (req.file) {
            updateData.productPic = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        await product.findByIdAndUpdate(req.params.id, updateData);
        res.redirect("/admin/product?message=Product+updated+successfully&type=success");
    } catch (err) {
        console.error(err);
        res.redirect("/admin/product?message=Server+error&type=error");
    }
});

router.post('/product/delete/:id', isAdminAuthenticated, async (req, res) => {
    try {
        await product.findByIdAndDelete(req.params.id);
        res.redirect("/admin/product?message=Product+deleted+successfully&type=success");
    } catch (err) {
        console.error(err);
        res.redirect("/admin/product?message=Server+error&type=error");
    }
});


export default router;
