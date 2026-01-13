import express from "express";
import bcrypt from 'bcryptjs';
import multer from 'multer';
import mongoose from "mongoose";

import User from "../database/user.js";
import category from "../database/category.js";
import Product from "../database/product.js";

const router = express.Router();

// ================= Multer Setup for File Uploads =================
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ================= Middleware to check user authentication =================
function isUserAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/user/login');
}

// ================= HOME PAGE =================
router.get("/", async (req, res) => {
  try {
    const cart = req.session.cart || [];

    const categories = await category.find();

    const categoryBlocks = await category.find()
      .populate({ path: 'products', options: { limit: 4 } });

    res.render("user/index", {
      cart,
      user: req.session.user || null,
      categories,
      categoryBlocks
    });

  } catch (error) {
    console.error("Home Page Error:", error);
    res.status(500).send("Server Error");
  }
});

// ================= LOGIN PAGE =================
router.get('/login', (req, res) => {
  const message = req.query.message || null;
  res.render("user/login", { message });
});

// ================= LOGIN POST =================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.render("user/login", { message: 'User not found' });

    if (user.status === "Block") return res.render("user/login", { message: 'User Blocked' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render("user/login", { message: 'Incorrect password' });

    // Admin login check (logic unchanged)
    if (email === 'admin@gmail.com') {
      req.session.admin = user;
      return res.redirect('/admin');
    }

    req.session.user = user;
    res.redirect('/user');

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).send('Server error');
  }
});

// ================= SIGNUP PAGE =================
router.get('/signup', (req, res) => {
  const message = req.query.message || null;
  res.render("user/signup", { message });
});

// ================= SIGNUP POST =================
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect('/user/signup?message=Email+already+registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      status: "Active",
      profilePic: {} // initialize profilePic to avoid null checks later
    });

    await newUser.save();

    res.redirect('/user/login?message=Account+created+successfully');

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ================= LOGOUT =================
router.get('/logout', isUserAuthenticated, (req, res) => {
  if (req.session.user) delete req.session.user;
  res.redirect('/user');
});

// ================= PROFILE PAGE =================
router.get('/profile', isUserAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.redirect('/user/login?message=User+not+found');

    const message = req.query.message || null;
    res.render("user/profile", { user, message });

  } catch (error) {
    console.error('Profile Fetch Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ================= PROFILE UPDATE =================
router.post('/profile/update', isUserAuthenticated, upload.single('profilePic'), async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) return res.redirect('/user/login?message=Please+login');

    const { name, email, oldPassword, newPassword } = req.body;

    const user = await User.findById(userSession._id);
    if (!user) return res.redirect('/user/login?message=User+not+found');

    user.name = name;
    user.email = email;

    // Password update if provided
    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.redirect('/user/profile?message=Old+password+incorrect');

      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Profile picture update
    if (req.file) {
      user.profilePic = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await user.save();

    req.session.user = user.toObject(); // update session
    res.redirect('/user/profile?message=Profile+updated+successfully');

  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ================= PRODUCT IMAGE FETCH =================
router.get('/product/image/:id', async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod || !prod.productPic) return res.status(404).send("No image found");

    res.contentType(prod.productPic.contentType);
    res.send(prod.productPic.data);

  } catch (err) {
    console.error("Image fetch error:", err);
    res.status(500).send("Server Error");
  }
});

// ================= CATEGORY PAGE =================
router.get('/category', async (req, res) => {
  try {
    const cart = req.session.cart || [];
    const categories = await category.find();

    const categoryBlocks = await category.find()
      .populate({ path: 'products' });

    res.render("user/category", {
      cart,
      user: req.session.user || null,
      categories,
      categoryBlocks
    });

  } catch (error) {
    console.error("Category Page Error:", error);
    res.status(500).send("Server Error");
  }
});

// ================= PRODUCT LISTING BY CATEGORY =================
router.get("/product/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).send("Invalid category ID");
    }

    const selectedCategory = await category.findById(categoryId);
    if (!selectedCategory) return res.status(404).send("Category not found");

    const products = await Product.find({ category: categoryId });

    const brands = await Product.distinct("brand", { category: categoryId });

    let minPrice = 0, maxPrice = 0;
    if (products.length) {
      const prices = await Product.aggregate([
        { $match: { category: new mongoose.Types.ObjectId(categoryId), price: { $exists: true } } },
        { $group: { _id: null, minPrice: { $min: "$price" }, maxPrice: { $max: "$price" } } }
      ]);
      if (prices.length) {
        minPrice = prices[0].minPrice || 0;
        maxPrice = prices[0].maxPrice || 0;
      }
    }

    res.render("user/product", {
      products,
      category: selectedCategory,
      brands,
      minPrice,
      maxPrice,
      cart: req.session.cart || [],
      user: req.session.user || null
    });

  } catch (error) {
    console.error("Product Page Error:", error);
    res.status(500).send("Server Error");
  }
});



// ================= LIVE SEARCH =================
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const regex = new RegExp(q, 'i');
    const products = await Product.find({
      $or: [{ name: regex }, { brand: regex }]
    }).limit(5);

    res.json(products);

  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
