const db = require('../config/db')

class ProductModel {
    static async getAllProducts(category) {
        try {
            const sql = 'SELECT ProductName, Price, CategoryID FROM Products'
            const [products] = await db.query(sql) // truy vấn
            let filteredProducts = [...products] // giải ra để copy mảng tránh trỏ cùng đối tượng
            if (category) {
                filteredProducts = filteredProducts.filter((product) => {
                    return product.CategoryID === category
                })
            }
            return filteredProducts
        }

        catch (err){
            throw err
        }
    }
}

// hàm Model gọi SQL
module.exports = ProductModel