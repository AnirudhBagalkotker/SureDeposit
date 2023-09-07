fetch('/getData/profile')
	.then(response => response.json())
	.then(data => {
		const name = data.name;
		const phone = data.phone;
		const email = data.email;
		var gender = data.gender;
		console.log(data);
		document.getElementById("cName").innerHTML = name;
		document.getElementById("cEmail").innerHTML = email;
		document.getElementById("cPhone").innerHTML = "+91 " + phone;
		if (gender == "M") {
			gender = "Male";
			document.querySelector('.profile__img').innerHTML = `<img src="img_suredeposit/boy.png" alt="">`
		}
		else if (gender == "F") {
			gender = "Female";
			document.querySelector('.profile__img').innerHTML = `<img src="img_suredeposit/girl.png" alt="">`
		}
		else {
			gender = "Others";
			document.querySelector('.profile__img').innerHTML = `<img src="img_suredeposit/others.png" alt="">`
		}
		document.getElementById("cGender").innerHTML = gender;

	})
	.catch(error => console.error(error));

fetch('/getData/bank')
	.then(response => response.json())
	.then(data => {
		const BNAME = data.BNAME;
		const ACCNO = data.ACCNO;
		const UPIID = data.UPIID;
		// console.log(data);
		if (BNAME == null && ACCNO == null && UPIID == null) {
			document.getElementById("nulbox").classList.remove("hidden");
		}
		if (BNAME != null) {
			document.getElementById("bnameBox").classList.remove("hidden");
			document.getElementById("bname").innerHTML += BNAME;
		}
		if (ACCNO != null) {
			document.getElementById("accnoBox").classList.remove("hidden");
			document.getElementById("accno").innerHTML += ACCNO;
		}
		if (UPIID != null) {
			document.getElementById("upiidBox").classList.remove("hidden");
			document.getElementById("upiid").innerHTML += UPIID;
		}
	})
	.catch(error => console.error(error));