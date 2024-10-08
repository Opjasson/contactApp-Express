// Setting express
const express = require("express");
const app = express();
const port = 4000;

// import module
const {
    loadContact,
    findContact,
    addContact,
    cekDuplikat,
    deleteContact,
    updateContact,
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

// Gunakan ejs middleware and setting
app.use(expressLayout);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// access static file
app.use(express.static("public"));

// route home
// res render layout untuk menyambungkan mainlayot template setiap dipanggil di rendernya perroute
app.get("/", (req, res) => {
    res.render("index", {
        layout: "./layouts/mainlayot",
        title: "Home page",
        nama: "azmi ghazy asyrof",
        alamat: "jalan pala2 timur",
    });
});

// route about
app.get("/about", (req, res) => {
    res.render("about", {
        layout: "./layouts/mainlayot",
        title: "About page",
    });
});


// proses showall data
app.get("/contact", (req, res) => {
    const contact = loadContact();
    console.log(contact);
    res.render("contact", {
        layout: "./layouts/mainlayot",
        contact,
        title: "Home contact",
        msg: req.flash("msg"),
    });
});

// Proses Menambahkan data
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
        } else {
            addContact(req.body);
            req.flash("msg", "Data berhasil ditambahkan!");
            res.redirect("/contact");
        }
    }
);


// form add data
app.get("/contact/add", (req, res) => {
    res.render("add", {
        layout: "./layouts/mainlayot",
        title: "add contact",
    });
});

// Proses delete contact
app.get("/contact/delete/:nama", (req, res) => {
    const contact = findContact(req.params.nama);

    if (!contact) {
        res.status(404);
        res.send("<h1> Error Not Found</h1>");
    } else {
        deleteContact(req.params.nama);
        req.flash("msg", "Data berhasil dihapus!");
        res.redirect("/contact");
    }
});

// Halaman form edit contact
app.get("/contact/edit/:nama", (req, res) => {
    const contact = findContact(req.params.nama)
    res.render("edit", {
        layout: "./layouts/mainlayot",
        title: "Update contact",
        contact,
    });
});

// Proses edit data
app.post(
    "/contact/update",
    [
        check("email", "Email yang anda masukan salah").isEmail(),
        check("noHp", "Nomor yang anda masukan salah").isMobilePhone("id-ID"),
        body("nama").custom((value, { req }) => {
            const duplikasi = cekDuplikat(value);
            if (value !== req.body.oldNama && duplikasi) {
                throw new Error("Nama sudah digunakan!");
            }
            return true;
        }),
    ],
    (req, res) => {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            res.render("edit", {
                layout: "./layouts/mainlayot",
                title: "edit contact",
                errors: errors.array() || [],
                contact: req.body
            });
        } else {
            updateContact(req.body);
            req.flash("msg", "Data berhasil diubah!");
            res.redirect("/contact");
        }
    }
);

// Halaman detail contact
app.get("/contact/:nama", (req, res) => {
    const contact = findContact(req.params.nama);
    res.render("detail", {
        layout: "./layouts/mainlayot",
        contact,
        title: "Home detail contact",
    });
});

// middleware
app.use("/", (req, res) => {
    res.send(404);
});

// settings port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
