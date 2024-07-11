const Router=require('express').Router();
const auth=require('../middleware/auth')
const controller=require('../controller/userController')
Router.post('/register',controller.register)
Router.post('/login',controller.Login)

Router.post('/logout',controller.Logout)
Router.get('/info',auth,controller.info)
Router.get('/info/:id',auth,controller.infoWithId)
Router.get('/verify-email', controller.verify);     

module.exports=Router