const user = require("../models/User")
const bcrypt = require('bcrypt');
require("dotenv").config();
var jwt = require("jsonwebtoken");
const eMail = require("../utils/custMail")




//!Password hash function
async function passwordHash(password, saltRounds) {
    hashPassword = await bcrypt.hash(password, saltRounds)
    return hashPassword
}

//! Generating a token
const generateToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRTE_KEY);
};



//!Register a user
exports.register = async (req, res) => {
    try {
        let { firstName, lastName, email, password, role } = req.body;
        if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/.test(password)) {
            password = await passwordHash(password, 10)
            const userData = user({ firstName, lastName, password, email, role })
            await userData.save()
            res.send("Added to the userInfo database~")
        }
        else {
            res.json("Password must contain at least 8 characters,at least 1 numeric character,at least 1 lowercase letter,at least 1 uppercase letter,at least 1 special character")
        }
    } catch (err) {
        res.send(err.message)
    }

}

//!login a user by email and password
exports.login = async (req, res) => {
    const { email, password } = req.body
    const userData = await user.findOne({ email })
    if (!userData) {
        return res.send("Incorrect credentials")
    }
    if (await bcrypt.compare(password, userData.password)) {
        res.json(generateToken(userData._id))
    }
    else {
        res.json("Incorrect credentials")
    }
}

//!Need a email in a body
exports.generateResetPasswordLink = async (req, res) => {
    const { email } = req.body
    const userData = await user.findOne({ email })
    if (!userData) {
        return res.json("Not a valid email!")
    }
    eMail(userData.email, `localhost:8081/${userData._id}`)
    res.json("Please check your mail")

}

//!Need a new password in a body
exports.resetPass = async (req, res) => {
    let { password } = req.body
    password = await passwordHash(password, 10)
    await user.updateOne({ '_id': req.params.id }, { $set: { "password": password } })
    res.json("Successfully Reset Password!")

}


//!Need to pass  newPassword in the body
exports.updatePassword = async (req, res) => {
    let { newPassword } = req.body
    const userData = await user.findOne({ _id: req.body.user_id })
    newPassword = await passwordHash(newPassword, 10)
    await user.updateOne({ '_id': userData._id }, { $set: { "password": newPassword } })
    res.json("Successfully Updated!")
}

//!you should have token after that you have to give newFirstName and newLastName
exports.profileUpdate=async(req,res)=>{
    let {newFirstName,newLastName}=req.body
    const userData = await user.findOne({ _id: req.body.user_id })
    await user.updateMany({ '_id': userData._id }, { $set: { "firstName":newFirstName,"lastName":newLastName } })
    res.json("Updated profile!")
}