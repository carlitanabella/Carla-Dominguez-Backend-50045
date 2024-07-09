const passport = require("passport");
const local = require("passport-local");
const gitHubStrategy = require("passport-github2");
const jwt = require("passport-jwt");
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;
const UserModel = require("../models/user.model.js");


const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        if (email == "adminCoder@coder.com") return done(null, false);
        try {
          
          let user = await UserModel.findOne({ email: email });
          if (user) return done(null, false);
          
          let newUser = {
            first_name,
            last_name,
            email,
            age,
            rol: "user",
            password: createHash(password),
          };

          let result = await UserModel.create(newUser);
          
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
          const user = {
            _id: 1,
            email: email,
            password: password,
            first_name: "admin_name",
            last_name: "admin_last_name",
            age: 30,
            rol: "admin",
          };
          return done(null, user);
        } else {
          try {
            
            const user = await UserModel.findOne({ email });
            if (!user) {
              console.log("User doest exist");
              return done(null, false);
            }
            
            if (!isValidPassword(password, user)) return done(null, false);
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      }
    )
  );

  passport.use(
    "github",
    new gitHubStrategy(
      {
        clientID: " Iv23ct8TGync1hxuGQkf",
        clientSecret: "11d23bc10c08901042b2859f9ea586400650674d",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async ( profile, done) => {
        
        try {
          let user = await UserModel.findOne({ email: profile._json.email });
          if (!user) {
            
            let newUser = {
              first_name: profile._json.name,
              last_name: "secret",
              age: 17,
              email: profile._json.email,
              rol: "user",
              password: "secret",
            };
            
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    if (id == 1) {
      const user = {
        _id: 1,
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
        first_name: "admin_name",
        last_name: "admin_last_name",
        age: 3,
        rol: "admin",
      };
      done(null, user);
    } else {
      let user = await UserModel.findById({ _id: id });
      done(null, user);
    }
  });
};

module.exports = initializePassport;