const express = require("express");
const app = express();
const port = 3000;


const expressLayout = require('express-ejs-layouts');
// Application middleware
app.use((req, res, next) => {
    console.log("waktu saat ini : ", Date.now());
    next();
});

// Gunakan ejs
app.use(expressLayout)
app.set("view engine", "ejs");
app.use(express.static('public'))

app.get("/", (req, res) => {
    res.render("index", {
        layout : './layouts/mainlayot',
        title : 'Home page',
        nama : 'azmi ghazy asyrof',
        alamat: 'jalan pala2 timur'
    });
});



app.get("/about", (req, res) => {
    res.render("about",{
        layout : './layouts/mainlayot',
        title : 'About page'
    });
});

app.get("/contact", (req, res) => {
    res.render("contact",{
        layout : './layouts/mainlayot',
        title : 'Home page'
    });
});

app.get("/user/:id", function (req, res) {
    res.send("user : " + req.params.id);
});

app.use("/", (req, res) => {
    res.send(404);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
