const express = require("express");
const app = express();
const port = 4000;

const { loadContact,findContact } = require('./utils/contact')

const expressLayout = require("express-ejs-layouts");
// Application middleware
app.use((req, res, next) => {
    console.log("waktu saat ini : ", Date.now());
    next();
});

// Gunakan ejs
app.use(expressLayout);
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index", {
        layout: "./layouts/mainlayot",
        title: "Home page",
        nama: "azmi ghazy asyrof",
        alamat: "jalan pala2 timur",
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        layout: "./layouts/mainlayot",
        title: "About page",
    });
});

app.get("/contact", (req, res) => {
    const contact = loadContact()
    console.log(contact)
    res.render("contact", {
        layout: "./layouts/mainlayot",
        contact,
        title: "Home contact",
    });
});

app.get("/contact/add", (req, res) => {
    res.render("add", {
        layout : './layouts/mainlayot',
        title : "add contact"
    })
})

// process data contact


app.get("/contact/:nama", (req, res) => {
    const contact = findContact(req.params.nama);
    console.log(contact)
    res.render("detail", {
        layout: "./layouts/mainlayot",
        contact,
        title: "Home detail contact",
    });
});



app.use("/", (req, res) => {
    res.send(404);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
