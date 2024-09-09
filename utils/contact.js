const fs = require("fs");

// membuat folder data
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

// membuat file contacts.json jika belum ada
const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, "[]", "utf-8");
}

// load data contact all
const loadContact = function () {
    const file = fs.readFileSync("data/contacts.json", "utf-8");
    const contacts = JSON.parse(file);
    return contacts;
};

// load data contact by nama
const findContact = function (nama) {
    const contacts = loadContact();
    const contact = contacts.find(
        (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
    );
    return contact;
};

// cek duplikat
const cekDuplikat = function (req) {
    const contacts = loadContact();
    const duplikat = contacts.find((contact) => contact.nama === req);
    return duplikat;
};

// add contact
const addContact = function (req) {
    const contacts = loadContact();
    const inputData = req;

    contacts.push(inputData);
    fs.writeFileSync("./data/contacts.json", JSON.stringify(contacts));
};

module.exports = { loadContact, findContact, addContact, cekDuplikat };
