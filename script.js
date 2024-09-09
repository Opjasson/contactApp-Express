const express = require("express");
const app = express();
const port = 4000;

const {
    loadContact,
    findContact,
    addContact,
    cekDuplikat,
} = require("./utils/contact");

const { query, validationResult, body, check } = require("express-validator");
const expressLayout = require("express-ejs-layouts");

// menambahkan flash notif saat data berhasil ditambahkan
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

app.use(cookieParser("secret"));
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());
//---------

// Application middleware
app.use((req, res, next) => {
    console.log("waktu saat ini : ", Date.now());
    next();
});

// Gunakan ejs
app.use(expressLayout);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

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
    const contact = loadContact();
    console.log(contact);
    res.render("contact", {
        layout: "./layouts/mainlayot",
        contact,
        title: "Home contact",
        msg : req.flash('msg')
    });
});

// Menambahkan data
app.post(
    "/contact/add",
    [
        check("email", "Email yang anda masukan salah").isEmail(),
        check("noHp", "Nomor yang anda masukan salah").isMobilePhone("id-ID"),
        body("nama").custom((value) => {
            const duplikasi = cekDuplikat(value);
            if (duplikasi) {
                throw new Error("Nama sudah digunakan!");
            }
            return true;
        }),
    ],
    (req, res) => {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            res.render("add", {
                layout: "./layouts/mainlayot",
                title: "add contact",
                errors: errors.array() || [],
            });
        }else{
            addContact(req.body);
            req.flash('msg', 'Data berhasil ditambahkan!')
            res.redirect("/contact");
        }

    }
);

app.get("/contact/add", (req, res) => {
    res.render("add", {
        layout: "./layouts/mainlayot",
        title: "add contact",
    });
});

app.get("/contact/:nama", (req, res) => {
    const contact = findContact(req.params.nama);
    console.log(contact);
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
