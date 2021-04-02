
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/userInfo', { useNewUrlParser: true, useUnifiedTopology: true });

const user = new mongoose.Schema({
    firstName: { type: String, required: true, minLength: 3 },
    lastName: { type: String },
    email: {
        type: String, required: "Email address is required", unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String, required: true
    },
    role: { type: Number, enum: [1, 2, 3], default: 1 },


}, { timestamps: true });


const userMod = mongoose.model('User', user);

module.exports = userMod