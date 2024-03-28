const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");

const { createHash } = require("../utils/hashbcryp.js");





router.post("/", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;
  try {

    const existeUsuario = await UserModel.findOne({ email: email });
    if (existeUsuario) {
      return res.status(400).send({ error: "El email ya esta registrado" });
    }


    const nuevoUsuario = await UserModel.create({
      first_name,
      last_name,
      email,
      password: createHash(password),
      age,
      rol: "user"
    });


    req.session.login = true;
    req.session.user = { ...nuevoUsuario._doc };
    res.redirect("/api/products/view");
  } catch (error) {
    console.log("Error al crear el usuario:", error);
    res.status(500).send({ error: "Error al guardar el usuario nuevo" });
  }
});

module.exports = router;