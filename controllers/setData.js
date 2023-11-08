const mysql = require("mysql");
const bodyParser = require("body-parser");
const express = require("express");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const db = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASS,
	database: process.env.DATABASE,
});

express().use(bodyParser.urlencoded({ extended: true }));

express().use(bodyParser.json());

exports.deposit = async (req, res) => {
	console.log(req.body);
	const amount = req.body.amt;
	const uid = req.body.uid;
	let Tdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
	db.query("insert into DEPOSIT set ?", { UID: uid, AMT: amount, DTDATE: Tdate, SUCCESS: 1 }, (error, result) => {
		if (error) console.error(error);
		else {
			// console.log(result);
			const ctid = result.insertId;
			db.query('UPDATE ACCOUNT SET CINV = CINV + ?, CBAL = CBAL + ?, TINV = TINV + ?, CINVDATE = ?, CTID = ? where UID = ?', [amount, amount, amount, Tdate, ctid, uid], (errors, results) => {
				if (error) console.error(errors);
				else {
					console.log(results);
					db.query('select * from ACCOUNT where UID = ?', [uid], (err, resu) => {
						if (err) console.error(err);
						else {
							// console.log(resu);
							if (resu[0].FINVDATE == null) {
								db.query('UPDATE ACCOUNT SET FINVDATE = ? where UID = ?', [Tdate, uid], (err, resu) => {
									if (err) console.error(err);
									else res.json({ success: true });
								})
							}
						}
					})
				}
			});
		}
	})
}

exports.withdraw = async (req, res) => {
	console.log(req.body);
	let amount = req.body.amt;
	let oamt = req.body.oamt;
	let wtype = req.body.wtype;
	let uid = req.body.uid;
	let Tdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
	db.query("insert into WITHDRAW set ?", { UID: uid, AMT: amount, WRDATE: Tdate, WTYPE: wtype }, (error, result) => {
		if (error) {
			console.log(error);
		} else {
			console.log(result);
			if (wtype == 1) {
				db.query('UPDATE ACCOUNT SET CINT = CINT - ?, CBAL = CBAL - ? where UID = ?', [oamt, oamt, uid], (errors, results) => {
					if (error) {
						console.error(errors);
					} else {
						console.log(results);
					}
				});
			}
			else {
				db.query('UPDATE ACCOUNT SET CINV = CINV - ?, CBAL = CBAL - ? where UID = ?', [oamt, oamt, uid], (errors, results) => {
					if (error) {
						console.error(errors);
					} else {
						console.log(results);
					}
				});
			}
		}
	})
}

exports.reinvest = async (req, res) => {
	console.log(req.body);
	let amount = req.body.amt;
	const uid = await getUID(req, res);
	let Tdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
	db.query("insert into REINVEST set ?",
		{ UID: uid, AMT: amount, RTDATE: Tdate },
		(error, result) => {
			if (error) {
				console.log(error);
			} else {
				console.log(result);
				db.query('UPDATE ACCOUNT SET CINT = CINT - ?, CINV = CINV + ? where UID = ?', [amount, amount, uid], (errors, results) => {
					if (error) {
						console.error(errors);
					} else {
						console.log(results);
					}
				});
			}
		}
	)
}

exports.profile = async (req, res) => {
	console.log(req.body);
	const name = req.body.cName;
	const phone = req.body.cPhone;
	const email = req.body.cEmail;
	const uid = await getUID(req, res);
	db.query('UPDATE USERS SET NAME = ?, PHONE = ?, EMAIL = ? where UID = ?', [name, phone, email, uid], (error, result) => {
		if (error) {
			console.error(error);
		} else {
			console.log(result);
			res.status(200).redirect('/profile');
		}
	})
}

exports.aadhar = async (req, res) => {
	console.log(req.body);
	const aadhar = req.body.cAadhar;
	const uid = await getUID(req, res);
	db.query('UPDATE USERS SET AADHAR = ? where UID = ?', [aadhar, uid], (err, resu) => {
		if (err) {
			console.error(err);
		} else {
			console.log(resu);
			res.status(200).redirect('/profile');
		}
	})
}

exports.bank = async (req, res) => {
	console.log(req.body);
	var BNAME = req.body.cbname;
	var ACCNO = req.body.caccno;
	var UPIID = req.body.cupiid;
	var IFSC = req.body.cifsc;
	var ACCNAME = req.body.caccname;
	const uid = await getUID(req, res);
	try {
		if (ACCNO == 0 || ACCNO == null || ACCNO == "") {
			ACCNO = null;
			ACCNAME = null;
			BNAME = null;
			IFSC = null;
			db.query('UPDATE BANK SET BNAME = ?, ACCNAME = ?, ACCNO = ?, IFSC = ?, UPIID = ? where UID = ?', [BNAME, ACCNAME, ACCNO, IFSC, UPIID, uid], (error, result) => {
				if (error) {
					console.error(error);
				} else {
					console.log(result);
					res.status(200).redirect('/profile');
				}
			})
		}
		else if (UPIID == 0 || UPIID == null || UPIID == "") {
			UPIID = null;
			db.query('UPDATE BANK SET BNAME = ?, ACCNAME = ?, ACCNO = ?, IFSC = ?, UPIID = ? where UID = ?', [BNAME, ACCNAME, ACCNO, IFSC, UPIID, uid], (error, result) => {
				if (error) {
					console.error(error);
				} else {
					console.log(result);
					res.status(200).redirect('/profile');
				}
			})
		}
		else {
			db.query('UPDATE BANK SET BNAME = ?, ACCNAME = ?, ACCNO = ?, IFSC = ?, UPIID = ? where UID = ?', [BNAME, ACCNAME, ACCNO, IFSC, UPIID, uid], (error, result) => {
				if (error) {
					console.error(error);
				} else {
					console.log(result);
					res.status(200).redirect('/profile');
				}
			})
		}
	}
	catch (error) {
		console.log(error)
	}
}

exports.ticket = async (req, res) => {
	console.log(req.body);
	const uid = await getUID(req, res);
	const title = req.body.title;
	const issue = req.body.issue;
	let Tdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
	db.query('insert into TICKETS set ?', { UID: uid, TITLE: title, ISSUE: issue, TICKDATE: Tdate }, (err, resu) => {
		if (err) {
			console.error(err);
		} else {
			console.log(resu);
			res.status(200).redirect('/viewticket');
		}
	})
}

exports.rewards = async (req, res) => {
	const uid = await getUID(req, res);
	console.log(req.body);
	let amount = req.body.amt;
	let Tdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
	db.query("insert into WITHDRAW set ?",
		{ UID: uid, AMT: amount, WRDATE: Tdate },
		(error, result) => {
			if (error) {
				console.log(error);
			} else {
				console.log(result);
				db.query('UPDATE USERS SET REWARDS = 0 where UID = ?', [uid], (errors, results) => {
					if (error) {
						console.error(errors);
					} else {
						console.log(results);
					}
				});
			}
		}
	)
}

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