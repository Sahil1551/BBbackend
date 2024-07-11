const Router=require('express').Router()
const productController=require('../controller/productController')
Router.post('/postProduct',productController.postProduct)
Router.get('/getProduct',productController.getProduct)
Router.get('/getProduct/:category',productController.getProductbyCategory)
Router.get('/getProducts/:id',productController.getProductbyId)

module.exports=Router