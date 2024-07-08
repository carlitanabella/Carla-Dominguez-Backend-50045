const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://carlitanabella:coderhouse@cluster1.7awsjy6.mongodb.net/Atxrrantxx?retryWrites=true&w=majority&appName=Cluster1")

.then(() => console.log("Conexion exitosa"))
.catch(() => console.log("Error"))