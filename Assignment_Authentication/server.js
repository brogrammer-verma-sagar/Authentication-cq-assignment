const express =require("express");
const session = require("express-session");
let app=express();

const fs = require("fs");
// file system module for reading files from the disk.

app.use(express.json());
app.use(express.static("public"));
// form Json ke sath deal nhi karta isley ye parser lgana pdta hai
app.use(express.urlencoded({extended:true}));

const port = 3000;

const data = JSON.parse(fs.readFileSync(`${__dirname}/data.json`));
app.use(session({
    secret: 'i_dont_know',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true } create problem in case of localhost
}));

// Route for rendering the login page
app.get('/login', (req,res)=>{
    if(req.session.isLoggedIn){
        res.redirect('/dashboard');
        return;
    }
    
    // login vali file send krdi
    res.sendFile(__dirname+'/public/index.html');
});

// Route for processing the login form
app.post('/login', (req,res)=>{
    const username = req.body['username'];
    const password = req.body['password'];
    // const{username,password} = req.body; // shorthand 

    data.map((element)=>{
        if(element.username == username && element.password == password){
            req.session.isLoggedIn = true;
        }
    });

    if(req.session.isLoggedIn){
        req.session.username = username;
        res.status(200).send();
    }
    else{
        res.status(404).send();
    }
});

// Route for logging out
app.get('/logout',(req,res)=>{
    req.session.destroy((err)=> {
        if(err){
        console.log(err);
        }
        else{
            res.redirect('/login'); //redirect to the login page
        }
    });
});

// Route for register page 
app.get('/register', (req,res)=>{
    if(req.session.isLoggedIn){
        res.redirect('/dashboard');
    }
    else{
        res.sendFile(`${__dirname}/public/register.html`);
        // send the login page 
    }
});

app.post('/register',(req,res)=>{
    const {username,password} = req.body;
    let f=false;
    data.map((element)=>{
        if(element.username == username){
            f=true;
        }
    });

    if(f!=true){
        data.push({"username":username, "password":password});
        fs.writeFileSync(`${__dirname}/data.json`,JSON.stringify(data));
        res.status(200).send();
    }
    else{
        res.status(404).send();
    }
});

function requireLogin(req,res,next){
    if(req.session.isLoggedIn){
        next();
    }
    else{
        res.redirect('/login');
    }
}

// Protected route for(Dashboard or Home page)
app.get('/dashboard' , requireLogin , (req,res)=>{
    res.send(`Welcome, ${req.session.username}! This is your Dashboard`);
});

// start the server now
app.listen(port, ()=>{
    console.log(`Server is Listenning on http://localhost:${port}`);
})
