const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const registrationSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    }
})

//middleware
registrationSchema.pre("save", async function(next){
    if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password,10)
    this.confirmpassword = undefined
    }
    next();
})

const Register = mongoose.model('Register',registrationSchema);

module.exports = Register;