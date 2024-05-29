const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcryp.js");



router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
    req.session.login = true;
    req.session.user = {
      email: email,
      password: password,
      first_name: "admin",
      last_name: "admin",
      age: 30,
      rol: "admin",
    };
    res.redirect("/api/products/view");
  } else {
    try {
      
      const usuario = await UserModel.findOne({ email: email });

      if (usuario) {

        if (isValidPassword(password, usuario)) {
          req.session.login = true;
          req.session.user = { ...usuario._doc };

          res.redirect("/api/products/view");
        } else {
          res.status(401).send({ error: "Contraseña no valida" });
        }
      } else {
        res.status(404).send({ error: "Usuario no encontrado" });
      }
    } catch (error) {
      res.status(400).send({ error: "Error en el login" });
    }
  }
});


router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.redirect("/auth/login");
});

module.exports = router;