const submitBtn = document.getElementById("submitBtn");
const cAadhar = document.getElementById("cAadhar");

fetch('/getData/profile')
	.then(response => response.json())
	.then(data => {
		const aadhar = data.aadhar;
		// console.log(aadhar);
		cAadhar.value = aadhar;
		if (aadhar == null || aadhar == 0 || aadhar == "") {
			cAadhar.removeAttribute('readonly');
			submitBtn.classList.remove("hidden");
		}
	})
	.catch(error => console.error(error));

