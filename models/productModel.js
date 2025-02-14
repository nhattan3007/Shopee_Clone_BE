const db = require('../config/db')

class ProductModel {
    // đã sữa đc lỗi nhập category hay không nhập 
    static async getAllProducts({ categoryid, shopid }) {
        try {
            let sql = 'SELECT ProductName, Price, CategoryID FROM Products'
            const params = []
            const conditions = [] // mảng lưu các điều kiện lọc 

            // let filteredProducts = [...products] // giải ra để copy mảng tránh trỏ cùng đối tượng

            if (categoryid) {
                console.log("Category received:", categoryid)
                conditions.push('CategoryID = ?')
                params.push(categoryid.trim()) // loại bỏ khoảng trắng nếu có 
            }

            if (shopid) {
                console.log("Shop received: ", shopid)
                conditions.push('ShopID = ?')
                params.push(shopid.trim())
            }

            // nếu có một điều kiện
            if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ')
            }

            console.log("Final SQL Query:", sql, params); // Debug
            const [products] = await db.query(sql, params) // truy vấn
            return products
        }

        catch (err) {
            throw err
        }
    }

    // dùng POST để tạo dữ liệu mới 
    static async createProducts({ productid, categoryid, shopid, productname }) {
        try {
            const sql = `INSERT INTO Products (ProductID, CategoryID, ShopID, ProductName) VALUES (?, ?, ?, ?)`;
            const params = [productid, categoryid, shopid, productname]


            console.log("Final SQL Query:",sql, params) // Debug
            const [result] = await db.query(sql, params) // truy vấn
            return { ProductID: result.insertId };
        } catch (err) {
            throw err
        }
    }
}

// hàm Model gọi SQL
module.exports = ProductModel