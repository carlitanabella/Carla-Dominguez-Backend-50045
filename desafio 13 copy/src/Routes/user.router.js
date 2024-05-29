const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");

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

    await nuevoUsuario.save();

    const token = jwt.sign({usuario}, "coderhouse", {expiresIn:"1h"});

    res.cookie("coderCookieToken", token, {
      maxAge: 3600000, 
      httpOnly: true 
  });

    res.redirect("/api/products/view");
  } catch (error) {
    console.log("Error al crear el usuario:", error);
    res.status(500).send({ error: "Error al guardar el usuario nuevo" });
  }
});

router.post("/login", async (req, res) => {
  const {usuario, password} = req.body; 
  try {
      
      const usuarioEncontrado = await UsuarioModel.findOne({usuario});

      if(!usuarioEncontrado) {
          return res.status(401).send("Usuario no valido");
      }

      
      if(password !== usuarioEncontrado.password) {
          return res.status(401).send("Contraseña incorrecta");
      }

      
      const token = jwt.sign({usuario: usuarioEncontrado.usuario, rol:usuarioEncontrado.rol}, "coderhouse", {expiresIn:"1h"});

      
      res.cookie("coderCookieToken", token, {
          maxAge: 3600000, 
          httpOnly: true 
      });

      res.redirect("/home");
  } catch (error) {
      res.status(500).send("Error interno del servidor"); 
  }
})

router.get("/home", passport.authenticate("jwt", {session:false}), (req, res) => {
  res.render("home", {usuario: req.user.usuario});
})


router.post("/logout", (req, res) => {
  res.clearCookie("coderCookieToken");
  res.redirect("/login");

})

router.post("/requestPasswordReset", userController.requestPasswordReset); // Nueva ruta
router.post('/reset-password', userController.resetPassword);
router.put("/premium/:uid", userController.cambiarRolPremium);

module.exports = router;