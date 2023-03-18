const express = require("express");
const app = express();
const port = 3000;
require("./db/conn");
const path = require("path");
const hbs = require("hbs");

const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
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
        phone: req.body.phone
      });
      const registered = await registerEmployee.save();
      console.log(registered);
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

      if(userEmail.password === pwd){
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




app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
