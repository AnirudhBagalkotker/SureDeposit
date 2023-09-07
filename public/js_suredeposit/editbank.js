const choice = document.getElementById("choice");
const accno = document.getElementById("accno");
const ifsc = document.getElementById("ifsc");
const upi = document.getElementById("upi");
const bankname = document.getElementById("bankname");
// const choice = document.getElementById("choice");

function change() {
	accno.classList.toggle("hidden");
	ifsc.classList.toggle("hidden");
	upi.classList.toggle("hidden");
	bankname.classList.toggle("hidden");
}

fetch('/getData/bank')
	.then(response => response.json())
	.then(data => {
		const BNAME = data.BNAME;
		const ACCNO = data.ACCNO;
		const UPIID = data.UPIID;
		const IFSC = data.IFSC;
		const ACCNAME = data.ACCNAME;
		if (BNAME != null || BNAME != "") {
			document.getElementById("cbname").value = BNAME;
		}
		if (ACCNO != null || ACCNO != "") {
			document.getElementById("caccno").value = ACCNO;
		}
		if (ACCNAME != null || ACCNAME != "") {
			document.getElementById("caccname").value = ACCNAME;
		}
		if (IFSC != null || IFSC != "") {
			document.getElementById("cifsc").value = IFSC;
		}
		if (UPIID != null || UPIID != "") {
			document.getElementById("cupiid").value = UPIID;
		}
	})
	.catch(error => console.error(error));