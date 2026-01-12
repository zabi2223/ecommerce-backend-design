# ecommerce-backend-design

Perfect 👍 Since your project is built with **Node.js**, **Express.js**, **EJS**, and **MongoDB**, and it’s part of your **Backend Development Task for Interns**, here’s a clean, professional `README.md` file you can directly use for your GitHub repository.

---

## 📦 Backend Development Task for Interns

### 🏁 Objective

Develop a **responsive eCommerce web application** backend using **Node.js**, **Express.js**, **EJS**, and **MongoDB**.
The task involves creating dynamic pages, connecting with a database, and ensuring mobile responsiveness using the given Figma design template.

---

## 🗂️ Project Overview

This project focuses on **backend integration** for an eCommerce website. It covers server setup, database connectivity, dynamic rendering using EJS, authentication, and deployment.

The project is divided into **three weeks**, each with clear goals and deliverables.

---

## 📅 Week-wise Progress

### **Week 1: Project Setup and Static Backend Integration**

**Goal:**
Set up the Node.js project and serve static pages.

**Tasks:**

* Initialized backend server using **Node.js** and **Express.js**.
* Organized project structure:

  * `routes/` – API and page routes
  * `views/` – EJS templates
  * `public/` – CSS, JS, and images
  * `database/` – Database Management

* Implemented **responsive design** using CSS media queries.

**Deliverables:**

* Functional Node.js server serving static pages.
* Mobile and desktop responsive layout.
* Code pushed to GitHub repository.

---

### **Week 2: Database Integration and Dynamic Content**

**Goal:**
Connect MongoDB and render dynamic product data.

**Tasks:**

* Connected project to **MongoDB** using Mongoose.
* Created **Product** collection with fields:

  * `id`, `name`, `price`, `category`, `image`, `description`, `stock`
* Added sample product data to the database.
* Used **EJS** to dynamically render:

  * Home Page – featured products
  * Product Listing Page – all products
  * Product Details Page – individual product details
* Implemented a **search bar** for filtering by name or category.

**Deliverables:**

* Fully integrated backend with dynamic rendering.
* Responsive UI for desktop and mobile.
* Updated code committed to GitHub.

---

### **Week 3: Backend Features and Final Integration**

**Goal:**
Add authentication and final backend functionalities.

**Tasks:**

* Implemented **user authentication** using JWT.

  * Signup and Login routes
  * Protected admin routes
* Added **Add Product** feature with form submission.
* Implemented **pagination** for product listing.
* Deployed project to **Render / Vercel / Heroku**.

**Deliverables:**

* Working authentication system.
* Product addition and pagination implemented.
* Project deployed and live.
* Final code uploaded to GitHub.

---

## 🛠️ Tools and Technologies

| Category          | Tools                    |
| ----------------- | ------------------------ |
| Backend Framework | Node.js, Express.js      |
| Template Engine   | EJS                      |
| Database          | MongoDB (Mongoose)       |
| Frontend          | HTML5, CSS3, JavaScript  |
| Authentication    | JWT                      |
| Version Control   | Git, GitHub              |
| Deployment        | Render / Vercel / Heroku |

---

## 🧱 Folder Structure

```
ecommerce-backend-design/
│
├── database/
|   ├── category.js
|   ├── db.js
|   ├── product.js
|   └──  user.js
|
├── routes/
│   ├── admin.js
│   └──  user.js
│
├── views/
|   ├── admin/
|   |   ├── index.ejs
|   |   ├── category.ejs
|   |   ├── order.ejs
|   |   ├── product.ejs
|   |   └── profile.ejs
|   |    
|   └── user/
│       ├── index.ejs
│       ├── login.ejs
│       ├── signup.ejs
│       ├── profile.ejs
│       ├── product.ejs
│       └── category.ejs
│   
├── public/
│   ├── CSS/
│   |   ├── admin_style.css
│   |   └── style.css
|   |
│   └── javascript/
│       ├── category.js
│       ├── product.js
|       └── script.js
│
├── index.js
├── package.json
└── README.md
```

---

## 🚀 How to Run the Project

1. **Clone the repository:**

   ```bash
   git clone https://github.com/zabi2223/ecommerce-backend-design.git
   ```
2. **Navigate to project folder:**

   ```bash
   cd ecommerce-backend-design
   ```
3. **Install dependencies:**

   ```bash
   npm install
   ```
4. **Run the server:**

   ```bash
   nodemon index.js
   ```
5. **Visit:**
   👉 [http://localhost:3000](http://localhost:3000)

---

## ✨ Author

**Muhammad Zohaib Tariq**
[GitHub Profile](https://github.com/zabi2223)


