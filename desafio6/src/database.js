const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://carlitanabella:Leonleon0101@cluster0.qe6tnae.mongodb.net/E-comerce?retryWrites=true&w=majority&appName=Cluster0")

.then(() => console.log("Conexion exitosa"))
.catch(() => console.log("Error"))