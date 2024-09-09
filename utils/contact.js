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

//Delete contact
const deleteContact = function (nama) {
    const contacts = loadContact();
    const filteredContact = contacts.filter((contact) => contact.nama !== nama);
    fs.writeFileSync("./data/contacts.json", JSON.stringify(filteredContact));
};

// Update contact
const updateContact = function (contactBaru) {
    const contacts = loadContact();
    // hilangkan contact lama yang namanya sama dengan oldNama
    const filteredContact = contacts.filter(
        (contact) => contact.nama !== contactBaru.oldNama
    );
    delete contactBaru.oldNama;
    filteredContact.push(contactBaru);
    fs.writeFileSync("./data/contacts.json", JSON.stringify(filteredContact));
};

module.exports = {
    loadContact,
    findContact,
    addContact,
    cekDuplikat,
    deleteContact,
    updateContact,
};
