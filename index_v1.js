const express = require('express')
const mysql = require('mysql2')
const app = express() // cái app là 1 cái sever là 1 cái backend của mình

// tạo kết nối mysql
// để dùng đc promise tối ưu vì đang dùng MySQL với mysql2 cần đảm bảo module đc config lại tốt để hỗ trợ promise(thêm đuôi .promise() là oke )
const db = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'Shopee_BE',
    connectionLimit: 100,   // số lượng tối đa đồng thời connect
    queueLimit: 0,   // không giới hạn hàng chờ 
    waitForConnections: true // cho phép chờ
}).promise();

app.use(express.json()) // Phân tích dữ liệu dạng JSON 

app.get('/api/hello', (req, res) => {             // tạo ra 1 cái api endpoint, dạng http GET
    return res.send('Hello From ExpressJS')              // trả vè response dạng text
})

// xem (READ)
app.get('/api/products', async (req, res) => {
    try {
        const sql = 'SELECT ProductName, Price FROM Products WHERE Price > ?';

        const [rows] = await db.query(sql, [10000]); // Parameterized Query an toàn hơn

        return res.status(200).json(rows);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: 'Internal Server Error',
            err: err.message
        });
    }
});

// xem các danh mục sản phẩm
app.get('/api/categories', async (req, res) => {
    const sql = 'SELECT CategoryID, CategoryName FROM Categories';
    try {
        const [result] = await db.query(sql, []); // không có params thì để không hoặc không cần viết luôn.
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            err: err.message
        });
    }
})

// lấy danh sách sản phẩm theo categoryID
app.get('/api/categories/:id', async (req, res) => {
    const CategoryID = req.params.id;

    const sql = 'SELECT ProductID, ProductName, Price FROM Products WHERE CategoryID = ?';

    // kiểm tra dữ liệu đầu vào từ người dùng
    if (!CategoryID) {
        return res.status(400).json({
            message: "CategoryID is required"
        });
    }

    try {
        const [result] = await db.query(sql, [CategoryID]);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            err: err.message
        });
    }
})

// tìm tất cả các sản phẩm mà nó có trong giỏ hàng trong userID và trả về
app.get('/api/cart/:UserID', async (req, res) => {
    const UserID = req.params.UserID;

    if (!UserID) {
        return res.status(400).json({
            message: "UserID is required"
        });
    }

    const sql = `
        SELECT c.ProductID, p.ProductName, p.Price, c.Quantity 
        FROM Cart_Detail c
        JOIN Products p 
        ON c.ProductID = p.ProductID 
        WHERE c.UserID = ?
    `;

    try {
        const [result] = await db.query(sql, [UserID]);

        if (result.length === 0) {
            return res.status(404).json({
                message: "No products found in the cart",
            });
        }

        return res.status(200).json({
            message: "Cart fetched successfully",
            products: result,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
})

app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM User'      // đây chỉ mới là cái chuỗi chưa có chạy
    db.query(sql, (err, result) => {
        if (err) {
            // lúc nào cũng bắt lỗi trước rồi mới làm tiếp bất kể cái nào LẬP TRÌNH THI ĐẤU, mây mây
            return res.status(500).send(err)
        }

        return res.status(200).json(result)
    })
})

// Thêm 1 sản phẩm mới
app.post('/api/products', async (req, res) => {
    const { ProductID, CategoryID, ShopID, ProductName, Price, Stock } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!ProductID || !CategoryID || !ShopID || !ProductName || !Price || !Stock) {
        return res.status(400).json({
            message: 'ProductID, CategoryID, ShopID, ProductName, Price, Stock are required'
        });
    }

    const sql = `INSERT INTO Products (ProductID, CategoryID, ShopID, ProductName, Price, Stock) VALUES (?, ?, ?, ?, ?, ?)`; //giúp tránh lỗi SQL Injection.

    try {
        const [result] = await db.query(sql, [ProductID, CategoryID, ShopID, ProductName, Price, Stock]);
        return res.status(200).json({
            message: 'Product added successfully',
            result
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            err: err.message
        });
    }
});

// Sữa (UPDATE)
app.put('/api/products/:id', async (req, res) => {
    const ProductID = req.params.id;
    const { CategoryID, ShopID, ProductName, Price, Stock } = req.body;

    // Kiểm tra dữ liệu
    if (!CategoryID || !ShopID || !ProductName || !Price || !Stock) {
        return res.status(400).json({
            message: 'CategoryID, ShopID, ProductName, Price, Stock are required'
        });
    }

    const sql = `
        UPDATE Products 
        SET CategoryID = ?, ShopID = ?, ProductName = ?, Price = ?, Stock = ? 
        WHERE ProductID = ?
    `;

    try {
        const [result] = await db.query(sql, [CategoryID, ShopID, ProductName, Price, Stock, ProductID]);
        return res.status(200).json({
            message: 'Product updated successfully',
            result
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            err: err.message
        });
    }
});

/* thay vì bộ lỗi thiếu '' vì nó là chuỗi(string) thì dùng phương pháp query parameterized (dễ và an toàn hơn) chưa test xem chạy được không
    const sql = `UPDATE Products SET CategoryID = ?, ShopID = ?, ProductName = ?, Price = ?, Stock = ? WHERE ProductID = ?`;

db.query(sql, [CategoryID, ShopID, ProductName, Price, Stock, ProductID], (err, result) => {
    if (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            err: err
        });
    }

    return res.status(200).json({
        message: 'Update product success'
    });
});

*/

// dùng async wait và try catch tránh callback hell và callback twice 
app.delete('/api/products/:id', async (req, res) => {
    const ProductID = req.params.id;

    if (!ProductID) {
        return res.status(400).json({ message: 'ProductID is required' });
    }

    try {
        // Kiểm tra sản phẩm
        const checkQuery = `SELECT * FROM Products WHERE ProductID = ?`;
        const [checkResult] = await db.query(checkQuery, [ProductID]);

        if (checkResult.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Xóa sản phẩm
        const deleteQuery = `DELETE FROM Products WHERE ProductID = ?`;
        const [result] = await db.query(deleteQuery, [ProductID]);

        return res.status(200).json({
            message: 'Product deleted successfully',
            result
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            err: err.message
        });
    }
});

// lấy danh sách sản phẩm trong 1 giỏ hàng của 1 userid
app.get('/api/products/:id', async (req, res) => {
    const ProductID = req.params.id;
    
    if(!ProductID) {
        return res.status(400).json({ messenge: 'Product is required' })
    }
    
})

// bài cũ
app.post('/api/products', (req, res) => {
    const userId = req.body.userId

    // 1 là dùng if else 2 là if return 
    if (!userId) {
        return res.json({
            message: "Thêm sản phẩm thất bại, vui lòng cần userId"
        })
    }

    return res.json({
        message: "Đã thêm sản phẩm thành công",
        userId: userId
    })
})

app.listen(5000, () => {
    console.log('server is listening at port 5000')
})


