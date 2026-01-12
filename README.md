# Ecommerce-backend-design

## 📦 Backend Development

### 🏁 Objective

Develop a **responsive eCommerce web application backend** using **Node.js**, **Express.js**, **EJS**, and **MongoDB**.
The goal is to build a fully functional backend that connects to a database, dynamically renders pages, and follows the given Figma design with both **desktop and mobile** responsiveness.

---

## 🗂️ Project Overview

This project focuses on the **backend integration** of an Ecommerce website.
It covers server configuration, database connectivity, EJS rendering, authentication, and deployment.

The project was completed over **three weeks**, each with structured goals and deliverables.

---

## 📅 Week-wise Progress

### **Week 1: Project Setup and Static Integration**

**Goal:**
Initialize the Node.js project and serve static EJS pages.

**Tasks:**

* Setup **Node.js** and **Express.js** server.
* Defined clear folder structure:

  * `routes/` → API and page routes
  * `views/` → EJS templates
  * `public/` → CSS, JS, images
  * `database/` → MongoDB models and connection
* Implemented **responsive design** using CSS media queries.

**Deliverables:**

* Functional Express server serving EJS pages.
* Static pages fully responsive.
* Repository initialized and pushed to GitHub.

---

### **Week 2: Database Integration and Dynamic Content**

**Goal:**
Integrate **MongoDB** with Mongoose and render product data dynamically.

**Tasks:**

* Connected to **MongoDB Atlas** using Mongoose.
* Created collections:

  * **Product**: id, name, price, category, image, description, stock
  * **Category**: id, name, description
  * **User**: id, name, email, password
* Inserted sample data in MongoDB.
* Rendered dynamic pages via **EJS**:

  * Home Page → Featured products
  * Product Page → Product listing
  * Product Detail → Individual product info
* Added **search functionality** for product/category filtering.

**Deliverables:**

* MongoDB integrated and dynamic rendering complete.
* Fully responsive frontend connected with backend.
* Code committed to GitHub.

---

### **Week 3: Authentication and Final Integration**

**Goal:**
Implement user authentication and admin features.

**Tasks:**

* Added **JWT-based authentication**:

  * Signup, Login, and Logout routes
  * Protected admin routes
* **Fixed admin account** created with email: `admin@gmail.com` for secure admin access.
* Created **Admin Panel** for:

  * Managing Products, Categories, and Orders
  * Viewing and updating user data
* Implemented:

  * Product addition via form submission
  * Pagination for product listing
  * User profile and order history pages
* Deployed project to **Render**.

**Deliverables:**

* Fully functional authentication system with admin control.
* Admin CRUD operations implemented.
* Deployment live and stable.
* Final code pushed to GitHub.

---

## 🛠️ Tools and Technologies

| Category          | Tools / Technologies    |
| ----------------- | ----------------------- |
| Backend Framework | Node.js, Express.js     |
| Template Engine   | EJS                     |
| Database          | MongoDB (Mongoose)      |
| Frontend          | HTML5, CSS3, JavaScript |
| Authentication    | JWT                     |
| Version Control   | Git, GitHub             |
| Deployment        | Render                  |

---

## 🧱 Folder Structure

```
ecommerce-backend-design/
│
├── database/
│   ├── category.js
│   ├── db.js
│   ├── product.js
│   └── user.js
│
├── routes/
│   ├── admin.js
│   └── user.js
│
├── views/
│   ├── admin/
│   │   ├── index.ejs
│   │   ├── category.ejs
│   │   ├── order.ejs
│   │   ├── product.ejs
│   │   └── profile.ejs
│   │
│   └── user/
│       ├── index.ejs
│       ├── login.ejs
│       ├── signup.ejs
│       ├── profile.ejs
│       ├── product.ejs
│       └── category.ejs
│
├── public/
│   ├── CSS/
│   │   ├── admin_style.css
│   │   └── style.css
│   │
│   └── javascript/
│       ├── category.js
│       ├── product.js
│       └── script.js
│
├── .env
├── index.js
├── package.json
└── README.md
```

---

## 🚀 How to Run the Project

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/zabi2223/ecommerce-backend-design.git
   ```

2. **Navigate to the Project Folder:**

   ```bash
   cd ecommerce-backend-design
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Create `.env` File and Add the Following:**

   ```bash
   PORT=3000
   MONGO_URI=mmongodb+srv://user:user1234@cluster0.y7ecifw.mongodb.net/nextcart?retryWrites=true&w=majority
   SESSION_SECRET=your_secret_key
   ```

5. **Run the Server:**

   ```bash
   nodemon index.js
   ```

6. **Open in Browser:**
   👉 [http://localhost:3000](http://localhost:3000)

---

## 🔐 Default Admin Credentials

| Role  | Email                                     | Password                  |
| ----- | ----------------------------------------- | ------------------------- |
| Admin | [admin@gmail.com](mailto:admin@gmail.com) | *Admin@123*               |

> 💡 The `admin@gmail.com` account is reserved for administrative access and route protection.
> Normal users must sign up through the frontend interface.

---

## ✨ Author

**Muhammad Zohaib Tariq**
📧 [[zohaibtariq566@gmail.com](mailto:zohaibtariq566@gmail.com)]
🌐 [[www.linkedin.com/in/zohaib-tariq-meo](http://www.linkedin.com/in/zohaib-tariq-meo)]
🐱 [[https://github.com/zabi2223](https://github.com/zabi2223)]
