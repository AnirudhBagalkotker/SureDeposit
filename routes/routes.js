const express = require('express');
const userController = require("../controllers/auth");
const app = express.Router();

//splash screen api
app.get("/api/splash", userController.isLoggedIn, (req, res) => {
    try {
        if (req.user) {
            uid = req.user.UID;
            const inv = req.user.CINV;
            const bal = req.user.CBAL;
            const int = req.user.CINT;
            const name = req.user.NAME;
            res.json({ uid, inv, bal, int, name });
        }
    }
    catch {
        res.status(200).redirect("/signup");
    }
});

module.exports = app;