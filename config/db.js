// ghi database

const mysql = require('mysql2/promise')
const dotenv = require('dotenv')
dotenv.config()

const db = mysql.createPool({
    // để dùng FILE env: process.env.tên biến
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    passwordL: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 100,
    queueLimit: 0,
    waitForConnection: true // cho phép chờ
})

module.exports = db  // export: để sữ dụng đc nhiều FILE khác nhau