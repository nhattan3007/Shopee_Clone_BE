const ProductModel = require('../models/productModel')

// thay vì mình modul export thì exports luôn (theo dạng ES5)
exports.getAllProducts = async (req, res) => {
    try {
        console.log("Query Params: ", req.query);
        const products = await ProductModel.getAllProducts(req.query)

        return res.status(200).json({
            status: "success",
            message: "Get Product success",
            data: products
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: "failed",
            message: "Get Products failed",
            data: null    // null là 1 trong các kiểu dữ liệu trong JS
        })
    }
}

// Controller điều phối