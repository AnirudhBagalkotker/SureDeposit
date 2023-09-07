var int = parseInt(localStorage.getItem("int"));
var inv = parseInt(localStorage.getItem("inv"));
var bal = parseInt(localStorage.getItem("bal"));
var amt = parseInt(localStorage.getItem("wamt"));
var oamt = parseInt(localStorage.getItem("oamt"));
var per = parseInt(localStorage.getItem("per"));
var uid = parseInt(localStorage.getItem("uid"));
var wtype = 1

if (per == 0) {
	wtype = 2;
}
else if (per == 1) {
	wtype = 3;
}

async function withdrawSuccess() {
	let response = await fetch('/setData/withdraw', {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			amt: amt,
			wtype: wtype,
			oamt: oamt,
			uid: uid,
		})
	})

	let withdrawResponse = await response.json();
	// console.log(withdrawResponse);
}

withdrawSuccess();

if (wtype == 1) {
	bal -= oamt;
	int -= oamt;
	localStorage.setItem("int", int);
	localStorage.setItem("bal", bal);
}
else {
	bal -= oamt;
	inv -= oamt;
	localStorage.setItem("inv", inv);
	localStorage.setItem("bal", bal);
}

localStorage.removeItem("wamt");
localStorage.removeItem("oamt");
localStorage.removeItem("per");
