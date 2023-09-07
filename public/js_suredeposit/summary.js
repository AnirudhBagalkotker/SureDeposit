fetch('/getData/summary')
	.then(response => response.json())
	.then(data => {
		const cbal = data.cbal;
		const cinv = data.cinv;
		const cint = data.cint;
		const tint = data.tint;
		const tinv = data.tinv;
		document.getElementById("cbal").innerHTML = "₹ " + cbal;
		document.getElementById("cint").innerHTML = "₹ " + cint;
		document.getElementById("cinv").innerHTML = "₹ " + cinv;
		document.getElementById("tint").innerHTML = "₹ " + tint;
		document.getElementById("tinv").innerHTML = "₹ " + tinv;
	})
	.catch(error => console.error(error));