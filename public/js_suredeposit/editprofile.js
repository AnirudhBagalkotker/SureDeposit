fetch('/getData/profile')
	.then(response => response.json())
	.then(data => {
		const name = data.name;
		const phone = data.phone;
		const email = data.email;
		// const aadhar = data.aadhar;
		document.getElementById("cName").value = name;
		document.getElementById("cEmail").value = email;
		document.getElementById("cPhone").value = parseInt(phone);
		// document.getElementById("cAadhar").value = aadhar;
	})
	.catch(error => console.error(error));

