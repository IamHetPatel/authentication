require('dotenv').config();
const express = require("express");
const app = express();
const port = 3000;
require("./db/conn");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const cookie = require("js-cookie")
const cookieParser = require("cookie-parser");

const auth = require("./middleware/auth")
const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialsPath);
const Register = require("./models/register");

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/secret",auth,(req,res)=>{
  console.log(`the token cookie is ${req.cookies.jwt}`)
  res.render("secret");
});
app.get("/logout",auth,async (req,res)=>{
  try{
    //logout from one device
    console.log(req.user)
    req.user.tokens = req.user.tokens.filter((currElement) =>{
      return currElement.token !== req.token
    })

    //logout from all devices
    // req.user.tokens = [];
    res.clearCookie("jwt");
    console.log("logged out successfully")
    await req.user.save();
    res.render("login")
  }
  catch(e){
    res.status(500).send(e)
  }
})

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const pwd = req.body.password;
    const cpwd = req.body.confirmpassword;
    if (pwd === cpwd) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        age: req.body.age,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
        phone: req.body.phone,
        state: req.body.state
      });

      //jwt middleware
      console.log("the success part"+registerEmployee)
      const token =  await registerEmployee.generateAuthToken();
      console.log("the token part:"+token);
      // The res.cookie() function is used to set the cookie name to value.
      // The value parameter may be a string or object converted to JSON.
      // Syntax:
      // res.cookie(name, value ‚[ options])
      // res.cookie()
      res.cookie("jwt",token,{
        expires: new Date(Date.now()+30000),
        httpOnly: true
      });
      console.log(cookie)
 
      const registered = await registerEmployee.save();
      res.status(201).render("index");
    } else {
      res.send("passwords dont match");
    }
  } catch (e) {
    console.log(e)
    res.status(500).send("error?");
  }
});

app.get("/login", (req, res) => {
    res.render("login");
  });
  
  app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
      const pwd = req.body.password;

      const userEmail = await Register.findOne({email});

      const isMatch = await bcrypt.compare(pwd,userEmail.password)
      const token =  await userEmail.generateAuthToken();
      console.log("the token part:"+token);

      res.cookie("jwt",token,{
        expires: new Date(Date.now()+30000),
        httpOnly: true
      });
      console.log(cookie)

      if(isMatch){
        console.log(userEmail);
        res.status(200).send("Logged in!");
      }
      else{
        res.status(404).send("no such email or password")
      }
    } catch (e) {
      console.log(e)
      res.status(500).send("error?");
    }
  });



// const securePassword = async(password) =>{
//     const passwordHash = await bcrypt.hash(password,10);
//     console.log(passwordHash)
//     const passwordMatch = await bcrypt.compare("hetp",passwordHash)
//     console.log(passwordMatch)
// }
// securePassword("hetp")


// const createToken = async() =>{
//   const token = await jwt.sign({_id:"64159e0a0f73ca0e829c3056"},"thjkuikytjrhegwfwrgtyjukilutykurtyjrhegwfgrhtejyrukyturtyjerhegwgerhtyj6r", {
//     expiresIn: "2 minutes"
//   })
//   console.log(token);
//   const userVer = await jwt.verify(token,"thjuikwfhpergnfsfdljg;bnmv;zvd;")
//   console.log(userVer);
// } 
app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
