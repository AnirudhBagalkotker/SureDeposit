// importing packages
const express = require('express');
const bcrypt = require('bcrypt');
const pug = require('pug');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const mysql = require('mysql');
const Razorpay = require('razorpay');
const bodyParser = require("body-parser");
const nodeFetch = require('node-fetch');

//initializing express.js
const app = express();

//middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// declare static path
let staticPath = path.join(__dirname, "views");
app.use(express.static(staticPath));
express().use(bodyParser.urlencoded({
    extended: true
}));

express().use(bodyParser.json());

//set pug
// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, '/views'));

//dotenv config
dotenv.config({ path: './.env' });

//db connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
})

db.connect((error) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log("MySQL connected....");
    }
})

//app port
app.listen(3000, () => {
    console.log('listening on port 3000.......');
})

//routes
app.use('/', require('./routes/routes'));
// app.use('/auth', require('./routes/auth'));
app.use('/getData', require('./routes/getData'));
app.use('/setData', require('./routes/setData'));


app.post('/auth/signin', async (req, res) => {
    const email = req.body.cEmail;
    const password = req.body.pass;

    if (!email || !password) {
        console.log("Please Enter Your Email and Password");
        const msg = "Please Enter Your Email and Password";
        return res.status(400).send({
            error: {
                message: msg
            }
        });
    }

    db.query(
        "select * from USERS where EMAIL=?",
        [email],
        (error, result) => {
            console.log(email);
            console.log(result);
            if (error) {
                console.log(error);
                const msg = "Internal Server Error";
                return res.status(500).send({
                    error: {
                        message: msg
                    }
                });
            }
            if (result.length <= 0) {
                console.log("Wrong Email");
                const msg = "Wrong Email";
                return res.status(400).send({
                    error: {
                        message: msg
                    }
                });
            } else {
                const pass = result[0].PASSWORD;
                console.log(pass);
                bcrypt.compare(password, pass)
                    .then((passwordMatch) => {
                        if (!passwordMatch) {
                            console.log("Wrong Password");
                            const msg = "Wrong Password";
                            return res.status(401).send({
                                error: {
                                    message: msg
                                }
                            });
                        }
                        else {
                            if (!pass) {
                                console.log("Wrong Password");
                                const msg = "Wrong Password";
                                return res.status(401).send({
                                    error: {
                                        message: msg
                                    }
                                });
                            } else {
                                const id = result[0].UID;
                                const name = result[0].NAME;
                                const token = jwt.sign({ id: id, name: name }, process.env.JWT_SECRET, {
                                    expiresIn: process.env.JWT_EXPIRES_IN,
                                });
                                const cookieOptions = {
                                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                                    httpOnly: true,
                                };
                                res.status(200).cookie("log", token, cookieOptions).send({
                                    ok: {
                                        message: "Login Successful"
                                    }
                                });
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        const msg = "Internal Server Error";
                        return res.status(500).send({
                            error: {
                                message: msg
                            }
                        });
                    });
            }
        }
    );
});

//routes

//landing page
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(staticPath, "./landingPage.html"));
    // res.status(200).render('landingPage');
})

//about us page
app.get('/aboutus', (req, res) => {
    res.status(200).sendFile(path.join(staticPath, "./aboutus.html"));
    // res.status(200).render('aboutus');
})

//contact us page
app.get('/contact', (req, res) => {
    res.status(200).sendFile(path.join(staticPath, "./contactus.html"));
    // res.status(200).render('contactus');
})

//tnc page
app.get('/tnc', (req, res) => {
    res.status(200).sendFile(path.join(staticPath, "./tnc.html"));
    // res.status(200).render('tnc');
})

//privacyPolicy page
app.get('/privacy-policy', (req, res) => {
    res.status(200).sendFile(path.join(staticPath, "./privacyPolicy.html"));
    // res.status(200).render('privacyPolicy');
})

//refundPolicy page
app.get('/refund-policy', (req, res) => {
    res.status(200).sendFile(path.join(staticPath, "./refundPolicy.html"));
    // res.status(200).render('refundPolicy');
})

//signup screen
app.get('/signup', (req, res) => {
    res.status(200).sendFile(path.join(staticPath, "./gets1.html"));
    // res.status(200).render('gets1');

});

//splash screen
app.get('/splash', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./splash.html"));
        // res.status(200).render('splash');
    }
    else {
        res.status(200).redirect("/signup");
    }
});

//signup1 screen
app.get('/signup1', (req, res) => {
    res.status(200).sendFile(path.join(staticPath, "./signup1.html"));
    // res.status(200).render('signup1');

});

//signin screen
app.get('/signin', (req, res) => {
    res.status(200).sendFile(path.join(staticPath, "./signin.html"));
    // res.status(200).render('signin');
});

//home route
app.get('/home', (req, res) => {
    const uid = getUID(req, res);
    if (uid != null) {
        res.status(200).sendFile(path.join(staticPath, "./home.html"));
        // res.status(200).render('home');
    }
    else {
        res.status(200).redirect("/signin");
    }
});

//profile screen
app.get('/profile', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./profile.html"));
        // res.status(200).render('profile');
    }
    else {
        res.status(200).redirect("/signup");
    }

});

//summary screen
app.get('/summary', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./summary.html"));
        // res.status(200).render('summary');
    }
    else {
        res.status(200).redirect("/signup");
    }

});

//history screen
app.get('/history', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./history.html"));
        // res.status(200).render('history');
    }
    else {
        res.status(200).redirect("/signup");
    }

});

//settings screen
app.get('/settings', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./settings.html"));
        // res.status(200).render('settings');
    }
    else {
        res.status(200).redirect("/signup");
    }

});

//edit profile setting screen
app.get('/editprofile', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./editprofilesetting.html"));
        // res.status(200).render('editprofilesetting');
    }
    else {
        res.status(200).redirect("/signup");
    }

});

//edit bank setting screen
app.get('/editbank', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./changebankaccsetting.html"));
        // res.status(200).render('changebankaccsetting');
    }
    else {
        res.status(200).redirect("/signup");
    }

});

//add aadhar setting screen
app.get('/addaadhar', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./addaadharsetting.html"));
        // res.status(200).render('changebankaccsetting');
    }
    else {
        res.status(200).redirect("/signup");
    }

});

//failure screen
app.get('/failure', (req, res) => {
    res.status(200).sendFile(path.join(staticPath, "./failure.html"));
    // res.status(200).render('failure');   
});

//success screen
app.get('/success', (req, res) => {
    res.status(200).sendFile(path.join(staticPath, "./success.html"));
    // res.status(200).render('success');        
});

//deposit screen
app.get('/deposit', (req, res) => {
    if (getUID(req, res)) {
        // res.status(200).sendFile(path.join(staticPath, "./deposit.html"));
        // res.status(200).render('deposit');
        res.status(200).sendFile(path.join(staticPath, "./maintenance.html"));
    }
    else {
        res.status(200).redirect("/signup");
    }
});

//confirm payment screen
app.get('/pay', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./confirmpayment.html"));
        // res.status(200).render('confirmpayment');   
    }
    else {
        res.status(200).redirect("/signup");
    }
});

//withdraw screen
app.get('/withdraw', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./withdraw.html"));
        // res.status(200).render('withdraw');
    }
    else {
        res.status(200).redirect("/signup");
    }
});

//withdraw2 screen
app.get('/withdraw2', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./withdraw2.html"));
        // res.status(200).render('withdraw2');
    }
    else {
        res.status(200).redirect("/signup");
    }
});

//withdraw3 screen
app.get('/withdraw3', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./withdraw3.html"));
        // res.status(200).render('withdraw3');
    }
    else {
        res.status(200).redirect("/signup");
    }
});

//withdrawreq screen
app.get('/withdrawreq', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./withdrawreq.html"));
        // res.status(200).render('withdrawreq');   
    }
    else {
        res.status(200).redirect("/signup");
    }
});

//withdrawres screen
app.get('/withdrawres', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./withdrawres.html"));
        // res.status(200).render('withdrawres');   
    }
    else {
        res.status(200).redirect("/signup");
    }
});

//reinvest screen
app.get('/reinvest', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./reinvest.html"));
        // res.status(200).render('reinvest');   
    }
    else {
        res.status(200).redirect("/signup");
    }
});

//confirmreinvest screen
app.get('/confirmreinvest', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./confirmreinvest.html"));
        // res.status(200).render('confirmreinvest');   
    }
    else {
        res.status(200).redirect("/signup");
    }
});

//help screen
app.get('/help', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./help.html"));
        // res.status(200).render('help');   
    }
    else {
        res.status(200).redirect("/signup");
    }
});

//viewticket screen
app.get('/viewticket', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./viewticket.html"));
        // res.status(200).render('viewtickets');   
    }
    else {
        res.status(200).redirect("/signup");
    }
});

//addticket screen
app.get('/addticket', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./addticket.html"));
        // res.status(200).render('addticket');   
    }
    else {
        res.status(200).redirect("/signup");
    }
});

//faqs screen
app.get('/faqs', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./faqs.html"));
        // res.status(200).render('faqs');   
    }
    else {
        res.status(200).redirect("/signup");
    }
});

//rewards screen
app.get('/rewards', (req, res) => {
    if (getUID(req, res)) {
        res.status(200).sendFile(path.join(staticPath, "./rewards.html"));
        // res.status(200).render('rewards');   
    }
    else {
        res.status(200).redirect("/signup");
    }
});

//deposit api
app.get('/api/deposit', async (req, res) => {
    try {
        const uid = await getUID(req, res);
        db.query('SELECT CBAL, CINT, CINV FROM ACCOUNT WHERE UID = ?', [uid], async (error, result) => {
            try {
                const curBalance = result[0].CBAL;
                const interest = result[0].CINT;
                const principle = result[0].CINV;

                res.json({ curBalance, interest, principle });

            } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Unauthorized' });
    }
})

//RazorPay
app.post('/orders', async (req, res) => {
    let { amount } = req.body;

    var instance = new Razorpay({ key_id: 'rzp_live_uQGjObim82lWnp', key_secret: '4quzQo8TjGYd6jG2ilgY4KNL' });

    let order = await instance.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: "receipt#1",
    });

    res.status(201).json({
        success: true,
        order,
        amount,
    })
})

// app.get('/razorpay/pay', async (req, res) => {
//     try {
//         const uid = await getUID(req, res);
//         db.query('SELECT NAME, PHONE, EMAIL FROM USERS WHERE UID = ?', [uid], async (error, result) => {
//             try {
//                 const name = result[0].NAME;
//                 const phone = result[0].PHONE;
//                 const email = result[0].EMAIL;
//                 res.json({ name, phone, email });

//             } catch (err) {
//                 console.error(err);
//                 res.status(500).json({ message: 'Internal server error' });
//             }
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(401).json({ message: 'Unauthorized' });
//     }
// });

app.post('/api/initiatePayment', async (req, res) => {
    const key = process.env.UPI_API_KEY;
    const amount = req.body.amount;
    const redirect_url = "https://suredeposit.in/success";
    const udf1 = "UDF1";
    const udf2 = "UDF2";
    const udf3 = "UDF3";
    try {
        const uid = await getUID(req, res);
        const p_info = `${uid}-SureDeposit Investment of Rs.${amount}`;
        db.query('SELECT NAME, PHONE, EMAIL FROM USERS WHERE UID = ?', [uid], async (error, result) => {
            try {
                const customer_name = result[0].NAME;
                const customer_mobile = result[0].PHONE + "";
                const customer_email = result[0].EMAIL;
                db.query('SELECT ID FROM CLIENT_TXN_ID', async (error, id) => {
                    try {
                        const clientID = id[0].ID + 1;
                        const client_txn_id = clientID + "";
                        db.query('UPDATE CLIENT_TXN_ID SET ID = ?', [client_txn_id]);
                        try {
                            const response = await nodeFetch('https://api.ekqr.in/api/create_order', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', },
                                body: JSON.stringify({ key, client_txn_id, amount, p_info, customer_name, customer_email, customer_mobile, redirect_url, udf1, udf2, udf3 }),
                            });
                            if (response.ok) {
                                const data_result = await response.json();
                                res.json(data_result);
                            } else {
                                console.error('API request failed');
                                res.status(401).json({ status: false, error: 'API request failed' });
                            }
                        } catch (error) { res.status(404).json({ status: false, error: 'Internal server error 1' }); }
                    } catch (err) {
                        console.error(err);
                        res.status(500).json({ status: false, error: 'Internal server error 2' });
                    }
                });
            } catch (err) {
                console.error(err);
                res.status(500).json({ status: false, error: 'Internal server error' });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({ status: false, error: 'Unauthorized' });
    }
});

app.post('/api/capturePayment', async (req, res) => {
    if (req.body.status === 'success') {
        const amt = parseInt(req.body.amount);
        const uid = parseInt(req.body.p_info.split('-')[0]);
        const response = await nodeFetch('https://suredeposit.in/setData/deposit', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amt: amt, uid: uid })
        });
        if (response.ok) {
            const data_result = await response.json();
            if (data_result.success === true) res.redirect('/success');
            else res.redirect('/failure');
        }
        else res.redirect('/failure');
    }
    else res.redirect('/failure');
});

//withdraw api
app.get('/api/withdraw', async (req, res) => {
    try {
        const uid = await getUID(req, res);
        console.log(uid);
        db.query('SELECT CBAL, CINT, CINV FROM ACCOUNT WHERE UID = ?', [uid], async (error, result) => {
            try {
                const curBalance = result[0].CBAL;
                const interest = result[0].CINT;
                const principle = result[0].CINV;

                res.json({ curBalance, interest, principle });
                console.log(curBalance);

            } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Unauthorized' });
    }
});

//uid function
async function getUID(req, res) {
    if (req.cookies.log) {
        console.log(req.cookies.log);
        try {
            const decode = await promisify(jwt.verify)(
                req.cookies.log,
                process.env.JWT_SECRET
            );
            const uid = decode.id;
            return uid;
        } catch (error) {
            console.log(error);
            res.status(200).redirect('/signin');
        }
    } else {
        res.status(200).redirect('/signin');
    }
};

isLoggedIn = async (req, res, next) => {
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

app.post('/auth/code', async (req, res) => {
    var referral = req.body.id;
    if (referral == "YT100" || referral == "IG100" || referral == "TW100" || referral == "FB100") {
        const x = 1;
        return res.json({ x });
    }
    var nameField = referral.slice(0, 2);
    var id = referral.slice(2);
    db.query('SELECT NAME FROM USERS WHERE UID = ?', [id], async (err, result) => {
        try {
            var name = result[0].NAME;
            if (name.slice(0, 2).toUpperCase() == nameField) {
                const x = 1;
                return res.json({ x });
            }
            else {
                const x = 0;
                return res.json({ x });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
})

app.post('/auth/signup1', async (req, res) => {

    // Regex patterns for validation
    const strongPassRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-+={}[\]:";'<>,.?/\\])(?=.{8,})/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^\S+@\S+\.\S+$/;
    // console.log(req.body);
    // console.log(req.body.cName);
    // console.log(req.body.cPhone);
    // console.log(req.body.cEmail);
    // console.log(req.body.pass);
    // console.log(req.body.cpass);
    // console.log(req.body.age_checkbox);
    // console.log(req.body.gender);
    db.query(
        "select EMAIL from USERS where EMAIL=?",
        [req.body.cEmail],
        async (error, result) => {
            if (error) {
                console.log(error);
            }
            if (result.length > 0) {
                // console.log("Account already exists");
                const msg = "Account already exists";
                return res.status(401).send({
                    error: {
                        message: msg
                    }
                });
            }
            else if (req.body.pass !== req.body.cpass) {
                const msg = "Password do not match";
                return res.status(400).send({
                    error: {
                        message: msg
                    }
                });
            }
            else if (!strongPassRegex.test(req.body.pass)) {
                // console.log("Password is weak");
                const msg = "Password is weak";
                return res.status(400).send({
                    error: {
                        message: msg
                    }
                });
            }
            else if (!phoneRegex.test(req.body.cPhone)) {
                // console.log("Phone Number Invalid");
                const msg = "Phone Number Invalid";
                return res.status(400).send({
                    error: {
                        message: msg
                    }
                });
            }
            else if (!emailRegex.test(req.body.cEmail)) {
                // console.log("Email Invalid");
                const msg = "Email Invalid";
                return res.status(400).send({
                    error: {
                        message: msg
                    }
                });
            }
            let hashedPassword = await bcrypt.hash(req.body.pass, 12);
            // console.log(hashedPassword);
            const email = req.body.cEmail;
            const uname = req.body.cName;
            const gender = req.body.gender;
            let Tdate = new Date().toISOString().slice(0, 19).replace('T', ' ');

            ref = 50;
            reward = req.body.rewards;
            if (req.body.rewards != null) {
                ref = 100;
            }
            if (req.body.rewards == "YT100") {
                reward = 1;
            }
            else if (req.body.rewards == "TW100") {
                reward = 2;
            }
            else if (req.body.rewards == "IG100") {
                reward = 3;
            }
            else if (req.body.rewards == "FB100") {
                reward = 4;
            }

            db.query(
                "insert into USERS set ?",
                { NAME: req.body.cName, PHONE: req.body.cPhone, EMAIL: req.body.cEmail, PASSWORD: hashedPassword, GENDER: gender, REWARDS: ref, SIGNUPDATE: Tdate, REFERRAL: reward },
                (error, result) => {

                    if (error) {
                        console.log(error);
                        const msg = "Internal Server Error";
                        return res.status(500).send({
                            error: {
                                message: msg
                            }
                        });
                    } else {
                        console.log(result);
                        uid = result.insertId;
                        console.log(uid);

                        db.query(
                            "insert into ACCOUNT set ?",
                            { UID: uid },
                            (error2, result2) => {

                                if (error2) {
                                    console.log(error2);
                                    const msg = "Internal Server Error";
                                    return res.status(500).send({
                                        error: {
                                            message: msg
                                        }
                                    });
                                } else {

                                    db.query(
                                        "insert into BANK set ?",
                                        { UID: uid },
                                        (error3, result3) => {

                                            if (error3) {
                                                console.log(error3);
                                                const msg = "Internal Server Error";
                                                return res.status(500).send({
                                                    error: {
                                                        message: msg
                                                    }
                                                });
                                            } else {
                                                const token = jwt.sign({ id: uid, name: uname }, process.env.JWT_SECRET, {
                                                    expiresIn: process.env.JWT_EXPIRES_IN,
                                                });
                                                console.log("The Token is " + token);
                                                const cookieOptions = {
                                                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                                                    httpOnly: true,
                                                };
                                                if (req.body.rewards == "YT100" || req.body.rewards == "IG100" || req.body.rewards == "TW100" || req.body.rewards == "FB100") {
                                                    db.query('UPDATE SOCIAL SET TOTAL = TOTAL + 1 WHERE SNAME = ?', [req.body.rewards], (err, resu) => {
                                                        if (err) {
                                                            console.error(err);
                                                        } else {
                                                            console.log(resu);
                                                        }
                                                    })
                                                }
                                                else if (req.body.rewards != null) {
                                                    const x = 100;
                                                    db.query('UPDATE USERS SET REWARDS = REWARDS + ? where UID = ?', [x, req.body.rewards], (err, resu) => {
                                                        if (err) {
                                                            console.error(err);
                                                        } else {
                                                            console.log(resu);
                                                        }
                                                    })
                                                }
                                                res.status(200).cookie("log", token, cookieOptions).send({
                                                    ok: {
                                                        message: "Login Successful"
                                                    }
                                                });
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
});

app.get('/auth/signout', async (req, res) => {
    res.cookie("log", "logout", {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true,
    });
    res.status(200).redirect("/signin");
});

// 404 route
app.get('/404', (req, res) => {
    res.status(200).sendFile(path.join(staticPath, "./404s.html"));
    // res.status(404).render('404s.html');
});

app.use((req, res) => {
    res.redirect('/404');
});
