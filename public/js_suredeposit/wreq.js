const payBtn = document.getElementById("withdrawBtn");
const perTxt = document.getElementById("per");
const h48 = document.getElementById("h48");
const h5 = document.getElementById("h5");

var amt = localStorage.getItem("wamt");
var per = localStorage.getItem("per");
var amttxt = "₹ " + amt;
document.querySelector('#amount-input').value = amttxt;

if (per == 0) {
	h48.classList.add("hidden");
	h5.classList.remove("hidden");
}
if (per == 1) {
	fetch('/getData/summary').then(response => response.json()).then(data => {
		const cinvdate = new Date(data.cinvdate);
		const today = new Date();
		const diff = (today - cinvdate) / (1000 * 60 * 60 * 24)
		if (diff >= 30) perTxt.innerHTML = `1% Withdrawal fee`;
		else {
			perTxt.innerHTML = `NOTE: You cannot withdraw before one month of depositing`;
			payBtn.classList.add("btn-unselect");
			payBtn.setAttribute("disabled", true);
		}
	})
}

fetch('/getData/bank')
	.then(response => response.json())
	.then(data => {
		const BNAME = data.BNAME;
		const ACCNO = data.ACCNO;
		const UPIID = data.UPIID;
		document.getElementById("bname").innerHTML = BNAME;
		if ((BNAME == null || BNAME == "") && (ACCNO == null || ACCNO == "") && (UPIID == null || UPIID == "")) {
			payBtn.classList.add("btn-unselect");
			document.getElementById("bname").style.display = 'none';
			document.getElementById("accno").style.display = 'none';
			document.getElementById("upiid").style.display = 'none';
			document.getElementById("txt").classList.remove("hidden");
		}
		else if (ACCNO != null || ACCNO != "") {
			document.getElementById("accno").innerHTML = ACCNO;
		}
		else if (UPIID != null || UPIID != "") {
			document.getElementById("upiid").innerHTML = UPIID;
		}
	})
	.catch(error => console.error(error));