const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bloodDB').then(()=>{console.log("Database up and running.")})
const passport = require('passport');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs');
const session = require('express-session');
const isLoggedIn = require('./utils/isLoggedIn');
app.use(
    session({
      secret: "thisisdexterfromtheotherside",
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 360000,
        secure: false // this should be true only when you don't want to show it for security reason
      }
    })
  );
const User = require('./src/schemas/user');
const Donor = require('./src/schemas/donor');
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(User.authenticate()));

app.use((req,res,next)=>{
    res.locals.user = req.user;
    next();
})


app.route('/')
.get((req,res)=>{
    res.render('home')
})

app.route('/login')
.get((req,res)=>{
    res.render('login')
})
.post(passport.authenticate('local', { failureRedirect: '/login' }),(req,res)=>{
    res.redirect('/dashboard')
})


app.get('/logout', function(req, res){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });

app.route('/dashboard')
.get(isLoggedIn,(req,res)=>{
    console.log(req.session.cookie)
    res.render('dashboard',{user:req.user,age:req.session.cookie.originalMaxAge})
})

app.route('/register')
.get((req,res)=>{
    res.render('register')
    
})
.post((req,res)=>{
    const {email,username,password,city} = req.body;
    const newUser = new User({email,username,city});
    console.log(newUser)
    User.register(newUser,password);
    res.redirect('/login')
})

app.route('/createdonor')
.get(isLoggedIn,(req,res)=>{
    res.render('createdonor')
})
.post(isLoggedIn,async(req,res)=>{
    const {name,city,type,address,contact} = req.body;
    const newDonor = await new Donor({name,city,type,address,contact});
    newDonor.save();
    res.redirect('/dashboard')
})

app.route('/alldonors')
.get(async(req,res)=>{
    var foundDonors;
    if(!req.user){
        foundDonors = await Donor.find({});
    }else{
        const {city} = req.user;
        foundDonors = await Donor.find({city});
        
    }
    res.render('alldonors',{donors:foundDonors});
   
})

app.route('/donor/:id')
.get(isLoggedIn,async(req,res)=>{
    const {id} = req.params;
    const donor = await Donor.findById(id);
    if(!donor) throw Error({message: "No donors found"})
    console.log(donor)
    res.render('induvidualdonor',{donor});
}
)

app.listen(3000,()=>{
    console.log(`app listening on port 3000`);
})