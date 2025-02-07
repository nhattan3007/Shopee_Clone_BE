// phải cần 1 bộ định tuyến của Express

const express = require('express')
// Routers gọi Controller
const productController = require('../controllers/productController')


const router = express.Router() // bộ định tuyến


router.get('/', productController.getAllProducts) // chỉ nên tạo khai báo không nên chạy hàm để khi nào người dùng dọi đến API thì mới chạy
router.get('/', )

module.exports = router