# 📝 Resume Builder

A sleek and customizable Resume Builder web application built using the MERN Stack. It allows users to create, edit, preview and download professional resumes in LaTeX format with ease.

## 🚀 Features

- ✏️ Edit LaTeX-based resume templates live in the browser
- 📄 Real-time PDF preview of the compiled resume
- ☁️ Cloud-based LaTeX file storage
- 🔐 User authentication and session handling
- 📥 Download resumes as PDF
- 📂 Organize multiple resume templates

## 🔧 Tech Stack

- **Frontend**: React, HTML, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Storage**: Cloudinary
- **Authentication**: JWT, Cookies

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yatharth-2906/resume_builder.git
```

### 2️⃣ Backend Setup
```sh
cd backend
npm install
npm run dev
```

### 3️⃣ Frontend Setup (in new terminal)
```sh
cd frontend
npm install
npm run dev
```

## 🌍 Environment Variables

### 1️⃣ Create a `.env` file in the backend directory and add:
```
PORT=8000
HASH_ITERATIONS=100000
HASH_KEYLEN=64
HASH_DIGEST="sha512"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
JWT_SECRET="your-jwt-secret-key"
DB_ONLINE_URL="your-db-url"
```

### 2️⃣ Create a `.env` file in the frontend directory and add:
```
VITE_BACKEND_URL='http://localhost:8000'
```

## 📞 Contact
For any issues, reach out at [yatharth2906@gmail.com] or open an issue on GitHub.
