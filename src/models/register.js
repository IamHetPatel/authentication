const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    state: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    
    tokens:[{
        token:{
            type: String,
            required:true
        }
    }]
})
//generating tokens

registrationSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id: this._id.toString()},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    }
    catch(e){
        console.log(`the error is ${e}`)
        res.send(`the error is ${e}`)
    }
}


middleware
registrationSchema.pre("save", async function(next){
    if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password,10)
    this.confirmpassword = await bcrypt.hash(this.password,10)
    }
    next();
})

const Register = mongoose.model('Register',registrationSchema);

module.exports = Register;