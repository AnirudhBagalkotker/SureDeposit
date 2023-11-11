const uid = localStorage.getItem("uid");
const inv = localStorage.getItem("inv");
const bal = localStorage.getItem("bal");
const int = localStorage.getItem("int");
const Name = localStorage.getItem("name");
document.getElementById("bal").innerHTML = parseInt(bal);
document.getElementById("int").innerHTML = parseInt(int);
document.getElementById("nameBox").innerHTML = Name;

const investment = parseInt(inv);
const max = 500000;
const per = parseInt((investment / max) * 100);

const createGuage = () => {
	let guage = document.querySelector('#guage');
	guage.innerHTML = '<div class="GaugeMeter" data-percent="' + per + '" data-text="' + investment + '"></div>';
}

createGuage();

$(".GaugeMeter").gaugeMeter();