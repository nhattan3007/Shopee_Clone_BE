const express = require('express')
const productRoutes = require('./routes/productRouters')
const app = express() // cái app là 1 cái sever là 1 cái backend của mình


app.use(express.json()) // Phân tích dữ liệu dạng JSON 

app.get('/api/hello', (req, res) => {             // tạo ra 1 cái api endpoint, dạng http GET
    return res.send('Hello From ExpressJS')              // trả vè response dạng text
})

app.use('/api/v1/products', productRoutes)

app.listen(5000, () => {
    console.log('server is listening at port 5000')
})

// viết lại products, category theo chuẩn REST và chia theo MVC
// sữa lại db(user, password)