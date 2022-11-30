var express         = require("express"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    bodyParser      = require("body-parser"),
    User            = require("./models/user"),
    LocalStrategy   = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")

mongoose.connect("mongodb://localhost:27017/my_portfolio");
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
//app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "My mother is the best in this world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//====================
// ROUTES
//====================

app.get("/", function(req,res){
    res.render("home");
});

app.get("/secret",isLoggedIn, function(req,res){
    res.render("secret");
});
app.get("/create", function(req,res){
    res.render("create");
});
app.get("/blog", function(req,res){
    res.render("blog");
});
app.get("/form", function(req,res){
    res.render("form");
});
app.get("/about", function(req,res){
    res.render("about");
});

// Auth Routes
// show sign up form
app.get("/register", function(req, res){
    res.render("register");
});
// Handling user sign up
app.post("/register", function(req,res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/create");
        });

    });
});

// LOGIN ROUTES
// render login form
app.get("/login", function(req,res){
    res.render("login");
});
// login logic
// middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req,res){
});

app.get("/logout", function(req,res){
    req.logout(function(err){
        if(err){
            console.log(err);
        }
        res.redirect("/");
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(3000, function(req,res){
    console.log("server started.....");
});