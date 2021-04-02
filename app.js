const express = require("express")
const app = express()
const chalk = require("chalk");
const userController = require("./controllers/user")
var bodyParser = require('body-parser')
const verifyUser = require("./utils/middleware")

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.post("/register", userController.register)
app.post("/login", userController.login)

app.get("/generatingLink", userController.generateResetPasswordLink)
app.post("/reset/:id", userController.resetPass)

app.post("/updatePass", verifyUser, userController.updatePassword)//Need Token
app.post("/updateProfile", verifyUser, userController.profileUpdate)//Need Token


app.listen(8081, () => {
    console.log("App is running at http://localhost:8081 (✓ )"),
        console.log("  Press CTRL-C to stop\n")
})