const express = require("express");
const app = express(); 
const exphbs = require("express-handlebars");
const multer = require("multer");
// const imagenRouter = require("./routes/imagen.router.js");
const PUERTO = 8080;
// require("../src/database.js");


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));

app.get("/", (req, res) => {
    res.send("conectados!")
});

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
})