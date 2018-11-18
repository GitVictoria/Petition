// const secrets = require("./secrets");
const ca = require("chalk-animation");
const express = require("express");
const app = express();
const csurf = require("csurf");
const bcrypt = require("./bcrypt");
// const redis = require("/.redis");

const db = require("./db");
var cookieSession = require("cookie-session");
app.use(
    cookieSession({
        secret: process.env.SESSION_SECRET || `I'm always angry.`, // require("./passwords").sessionSecrets
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);
const hb = require("express-handlebars");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

app.use(csurf());

app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(express.static(__dirname + "/public"));

app.use(function(req, res, next) {
    res.setHeader("X-frame-options", "DENY");
    next();
});

// app.use(function(req, res, next) {
//     if (!req.session.user_id && req.url != "/register" && req.url != "/login")
//     {
//
//     }
// })

// app.get("/login", requireLoggedOutUser, (req,res)
//  => {
//
//  });

//  function requireLoggedOutUser (req, res, next {
//      if (req.session.user_id) {
//          res.redirect("/petition")
//      } else {
//          next()
//      }
//  })
// //
//
//
//
//
//
//
// ROUTES
//
//
//
//
//
//

app.post("/delete/sig", (req, res) => {
    db.deleteSig(req.session.sig);
    res.redirect("/petition");
});

app.post("/delete/profile", (req, res) => {
    db.deleteProfile(req.session.user_id);
    res.redirect("/register");
});

app.get("/profile", (req, res) => {
    if (req.session.signatureId) {
        res.redirect("/petition");
    } else {
        res.render("profile", {
            layout: "main"
        });
    }
});

app.post("/profile", (req, res) => {
    db.createProfile(
        req.body.age,
        req.body.city,
        req.body.url,
        req.session.user_id
    );
    res.redirect("/petition");
});
app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main"
    });
});
app.post("/login", (req, res) => {
    db.getEmail(req.body.email);
    if (!req.body.email) {
        res.render("login", {
            layout: "main",
            error: true
        });
    } else {
        db.getEmail(req.body.email).then(function(results) {
            return bcrypt
                .compare(req.body.pass, results.rows[0].pass)
                .then(match => {
                    if (match) {
                        req.session.user_id = results.rows[0].id;
                        res.redirect("/petition");
                    } else {
                        res.render("login", {
                            layout: "main",
                            error: true
                        });
                    }
                });
            //
        });
    }

    // pass email to the function that has a database query
    //if there is error, re-render lon in template
    // no error - make a note of user id
});

app.get("/register", (req, res) => {
    res.render("register", {
        layout: "main"
    });
});

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.pass).then(hash => {
        db.createUsers(req.body.first, req.body.last, req.body.email, hash)
            .then(function(results) {
                req.session.user_id = results.rows[0].id;
                res.redirect("/profile");
            })
            .catch(err => {
                console.log(err);
            });
    });

    // store first last and email
    // hash the password
    //store the hash
    //insert a row into users table
    // once they sign
    //
    // remove first and last from signatures
    // req.session.userId = rows[0].id;
});
app.get("/", (req, res) => {
    res.redirect("/register");
});

app.get("/delete", (req, res) => {
    res.render("delete", {
        layout: "main"
    });
});

app.get("/delete/sig", (req, res) => {
    db.deleteSig(req.session.user_id)
        .then(function() {
            req.session.sigId = null;
            res.redirect("/register");
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/delete/profile", (req, res) => {
    db.deleteProfile(req.session.user_id);
    res.redirect("/register");
});

app.post("/delete", (req, res) => {
    res.redirect("/register");
});

app.get("/profile/edit", (req, res) => {
    res.render("editprofile", {
        layout: "main"
    });
});

app.post("/profile/edit", (req, res) => {
    if (req.body.pass) {
        bcrypt
            .hash(req.body.pass)
            .then(hash =>
                db
                    .updateUsersPass(
                        req.body.first,
                        req.body.last,
                        req.body.email,
                        hash
                    )
                    .then(function(results) {
                        res.redirect("/thanks");
                    })
            )
            .catch(err => {
                console.log(err);
            });
    } else {
        db.updateUsersNoPass(req.body.first, req.body.last, req.body.email)
            .then(function(results) {
                res.redirect("/thanks");
            })
            .catch(err => {
                console.log(err);
            });
    }
});

app.get("/thanks", (req, res) => {
    db.getSignature(req.session.signatureId)
        .then(function(results) {
            console.log(results);
            res.render("thanks", {
                layout: "main",
                results: results.rows[0].sig
            });
        })
        .catch(function(err) {
            console.log("Error in thanks: ", err);
        });
});

app.get("/petition", (req, res) => {
    if (!req.session.signatureId) {
        res.render("petition", {
            layout: "main"
        });
    } else {
        res.redirect("/thanks");
    }
});

app.post("/petition", function(req, res) {
    console.log(req.session.user_id);
    db.createSignatures(
        req.body.first,
        req.body.last,
        req.body.sig,
        req.session.user_id
    )
        .then(function(results) {
            req.session.signatureId = results.rows[0].id;
            res.redirect("/thanks");
        })
        .catch(err => {
            console.log("Error in post/petition: ", err);
        });
});

app.get("/signers", (req, res) => {
    if (!req.session.signatureId) {
        res.redirect("/petition"); //redirect to register
    } else {
        db.getSigners().then(function(results) {
            console.log(results.rows);
            res.render("signers", {
                layout: "main",
                results: results.rows
            });
        });
    }
});

app.get("/logout", function(req, res) {
    req.session = null;
    res.redirect("/register");
});

app.get("/signers/:city", (req, res) => {
    db.getCitySigners(req.params.city).then(signers => {
        res.render("cities", {
            layout: "main",
            results: signers.rows
        });
    });
});

app.listen(process.env.PORT || 8080, () =>
    ca.rainbow("I am ready to go, Victoria!")
);
