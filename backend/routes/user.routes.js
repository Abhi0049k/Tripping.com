const { Router } = require("express");
const { register, adminLogin, login, logout, userDetails, updateDetails, updatePassword } = require("../controllers/user.controllers");
const { userAuthorization } = require("../middlewares/user.authorization");

const userRouter = Router();

userRouter.post('/register', register);

userRouter.post('/login', login);

userRouter.get('/userDetails', userAuthorization, userDetails)

userRouter.patch('/updateUserDetails', userAuthorization, updateDetails)

userRouter.patch('/updatePassword', userAuthorization, updatePassword)

userRouter.post('/admin-login', adminLogin);

userRouter.get('/logout', userAuthorization, logout);

module.exports = userRouter;