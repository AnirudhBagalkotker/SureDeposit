const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const bodyParser = require("body-parser");
const express = require("express");

express().use(bodyParser.urlencoded({
    extended: true
}));

express().use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
});

exports.signup1 = (req, res) => {

    // Regex patterns for validation
    const strongPassRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-+={}[\]:";'<>,.?/\\])(?=.{8,})/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^\S+@\S+\.\S+$/;
    console.log(req.body);
    console.log(req.body.cName);
    console.log(req.body.cPhone);
    console.log(req.body.cEmail);
    console.log(req.body.pass);
    console.log(req.body.cpass);
    console.log(req.body.age_checkbox);
    db.query(
        "select PHONE from USERS where PHONE=?",
        [req.body.cPhone],
        async (error, result) => {
            if (error) {
                console.log(error);
            }

            if (result.length > 0) {
                console.log("Account already exists");
                return res.render("signup1", {
                    msg: "Account already exists",
                    msg_type: "error",
                });
            }
            else if (req.body.pass !== req.body.cpass) {
                return res.render("signup1", {
                    msg: "Password do not match",
                    msg_type: "error",
                });
            }
            else if (!strongPassRegex.test(req.body.pass)) {
                console.log("Password is weak");
                return res.render("signup1", {
                    msg: "Password is weak",
                    msg_type: "error",
                });
            }
            else if (!phoneRegex.test(req.body.cPhone)) {
                console.log("Phone Number Invalid");
                return res.render("signup1", {
                    msg: "Phone Number Invalid",
                    msg_type: "error",
                });
            }
            else if (!emailRegex.test(req.body.cEmail)) {
                console.log("Email Invalid");
                return res.render("signup1", {
                    msg: "Email Invalid",
                    msg_type: "error",
                });
            }
            let hashedPassword = await bcrypt.hash(req.body.pass, 8);
            console.log(hashedPassword);
            const email = req.body.cEmail;
            const uname = req.body.cName;

            db.query(
                "insert into USERS set ?",
                { NAME: req.body.cName, PHONE: req.body.cPhone, EMAIL: req.body.cEmail, PASSWORD: hashedPassword },
                (error, result) => {

                    if (error) {
                        console.log(error);
                    } else {
                        console.log(result);
                        uid = result.insertId;
                        console.log(uid);
                        const token = jwt.sign({ id: uid, name: uname }, process.env.JWT_SECRET, {
                            expiresIn: process.env.JWT_EXPIRES_IN,
                        });
                        console.log("The Token is " + token);
                        const cookieOptions = {
                            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                            httpOnly: true,
                        };
                        res.cookie("log", token, cookieOptions);

                        db.query(
                            "insert into ACCOUNT set ?",
                            { UID: uid },
                            (error2, result2) => {

                                if (error2) {
                                    console.log(error2);
                                } else {

                                    db.query(
                                        "insert into BANK set ?",
                                        { UID: uid },
                                        (error3, result3) => {

                                            if (error3) {
                                                console.log(error3);
                                            } else {
                                                res.status(200).redirect("/splash");
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            );
        }
    );
};

exports.isLoggedIn = async (req, res, next) => {
    // req.name = "Check Login....";
    // console.log("req.cookies: ", req.cookies);
    if (req.cookies.log) {
        try {
            const decode = await promisify(jwt.verify)(
                req.cookies.log,
                process.env.JWT_SECRET
            );
            // console.log(decode);
            db.query(
                "select * from USERS U join ACCOUNT A on A.UID = U.UID where U.UID=?",
                [decode.id],
                (err, results) => {
                    // console.log(results);
                    if (!results) {
                        return next();
                    }
                    req.user = results[0];
                    return next();
                }
            );
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }
};

exports.signout = async (req, res) => {
    res.cookie("log", "logout", {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true,
    });
    res.status(200).redirect("/signin");
};