const mysql = require("mysql");
const bodyParser = require("body-parser");
const express = require("express");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const db = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASS,
	database: process.env.DATABASE,
});

express().use(bodyParser.urlencoded({
	extended: true
}));

express().use(bodyParser.json());

exports.profile = async (req, res) => {
	try {
		const uid = await getUID(req, res);
		db.query('SELECT NAME, PHONE, EMAIL, AADHAR, GENDER FROM USERS WHERE UID = ?', [uid], async (err, result) => {
			try {
				const name = result[0].NAME;
				const phone = result[0].PHONE;
				const email = result[0].EMAIL;
				const aadhar = result[0].AADHAR;
				const gender = result[0].GENDER;
				res.json({ name, phone, email, aadhar, gender });
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: 'Internal server error' });
			}
		});
	} catch (error) {
		console.log(error);
		res.status(401).json({ message: 'Unauthorized' });
	}
}

exports.bank = async (req, res) => {
	try {
		const uid = await getUID(req, res);
		db.query('SELECT * FROM BANK WHERE UID = ?', [uid], async (err, result) => {
			try {
				const BNAME = result[0].BNAME;
				const ACCNO = result[0].ACCNO;
				const UPIID = result[0].UPIID;
				const IFSC = result[0].IFSC;
				const ACCNAME = result[0].ACCNAME;
				res.json({ BNAME, ACCNO, UPIID, IFSC, ACCNAME });
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: 'Internal server error' });
			}
		});
	} catch (error) {
		console.log(error);
		res.status(401).json({ message: 'Unauthorized' });
	}
}

exports.summary = async (req, res) => {
	try {
		const uid = await getUID(req, res);
		db.query('SELECT CBAL, CINT, CINV, TINV, TINT FROM ACCOUNT WHERE UID = ?', [uid], async (error, result) => {
			try {
				const cbal = result[0].CBAL;
				const cint = result[0].CINT;
				const cinv = result[0].CINV;
				const tinv = result[0].TINV;
				const tint = result[0].TINT;

				res.json({ cbal, cint, cinv, tinv, tint });

			} catch (err) {
				console.error(err);
				res.status(500).json({ message: 'Internal server error' });
			}
		});
	} catch (error) {
		console.log(error);
		res.status(401).json({ message: 'Unauthorized' });
	}
}

exports.help = async (req, res) => {
	try {
		const uid = await getUID(req, res);
		db.query('SELECT TICKID, TITLE, ISSUE, TICKDATE, SOLVED FROM TICKETS WHERE UID = ?', [uid], async (err, result) => {
			try {
				var tick;
				if (err || result == null || result.length == 0) {
					tick = 0;
					res.json({ tick, result });
				}
				else {
					db.query('SELECT COUNT(*) FROM TICKETS WHERE UID = ? and SOLVED = 0', [uid], async (erru, resu) => {
						try {
							if (erru) {
								res.status(500).json({ message: 'Internal server error' });
							}
							if (resu == null || resu.length == 0) {
								tick = 0;
							}
							else {
								tick = resu.length;
							}
							res.json({ tick, result });
						} catch (error) {
							console.error(error);
							res.status(500).json({ message: 'Internal server error' });
						}
					});
				}
			} catch (error) {
				console.error(error);
				res.status(500).json({ message: 'Internal server error' });
			}
		});
	} catch (error) {
		console.log(error);
		res.status(401).json({ message: 'Unauthorized' });
	}
}

exports.rewards = async (req, res) => {
	try {
		const uid = await getUID(req, res);
		db.query('SELECT NAME, REWARDS FROM USERS WHERE UID = ?', [uid], async (err, result) => {
			try {
				if (err) {
					res.status(500).json({ message: 'Internal server error' });
				}
				const rewards = result[0].REWARDS;
				const name = result[0].NAME;
				db.query('SELECT CINV FROM ACCOUNT WHERE UID = ?', [uid], async (err, resu) => {
					try {
						if (err) {
							dep = 0;
							res.json({ rewards, name, uid, dep });
						}
						const cinv = resu[0].CINV;
						if (cinv === null || cinv < 1000 || resu.length === 0) {
							dep = 0;
							res.json({ rewards, name, uid, dep });
						}
						else {
							dep = 1;
							res.json({ rewards, name, uid, dep });
						}
					} catch (err) {
						console.error(err);
						res.status(500).json({ message: 'Internal server error' });
					}
				});
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: 'Internal server error' });
			}
		});
	} catch (error) {
		console.log(error);
		res.status(401).json({ message: 'Unauthorized' });
	}
}

exports.referral = async (req, res) => {
	let dep;
	try {
		const uid = await getUID(req, res);
		const result = await new Promise((resolve, reject) => {
			db.query('SELECT UID FROM USERS WHERE REFERRAL = ?', [uid], (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});

		for (const re of result) {
			const resu = await new Promise((resolve, reject) => {
				db.query('SELECT CINV FROM ACCOUNT WHERE UID = ?', [re.UID], (err, resu) => {
					if (err) {
						reject(err);
					} else {
						resolve(resu);
					}
				});
			});

			const cinv = resu[0].CINV;
			if (cinv === null || cinv < 1000 || resu.length === 0) {
				dep = 0;
				res.json({ dep, uid });
				return;
			}
		}

		dep = 1;
		res.json({ dep, uid });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal server error' });
	}
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

