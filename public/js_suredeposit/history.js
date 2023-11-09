const depositBox = document.getElementById("depositBox");
const withdrawalBox = document.getElementById("withdrawalBox");
const depositBtn = document.getElementById("depositBtn");
const withdrawalBtn = document.getElementById("withdrawalBtn");

fetch('/getData/history').then(response => response.json()).then(data => {
	const { deposits, withdrawals } = data
	if (deposits.length === 0) {
		depositBox.innerHTML +=
			`<div class="grey-box padding flex-colunm ">
				<img src="img_suredeposit/no-deposit.svg" alt="No Deposit" class="no-deposit w-half h-auto">	
				<h3 class="b color margin-bottom text center">You Don\'t Have Any Deposits</h3>
			</div>`;
	}
	if (withdrawals.length === 0) {
		withdrawalBox.innerHTML +=
			`<div class="grey-box padding flex-colunm ">
				<img src="img_suredeposit/no-deposit.svg" alt="No Deposit" class="no-deposit w-half h-auto">	
				<h3 class="b color margin-bottom text center">You Don\'t Have Any Withdrawals</h3>
			</div>`;
	}
	deposits.forEach(deposit => {
		let success = parseInt(deposit.SUCCESS);
		let color = 'green-box';
		if (success === 0) color = 'red-box';
		let date = new Date(deposit.DTDATE);

		depositBox.innerHTML += ` 
				<div class="colored-box ${color} flex-colunm ">
					<span class="colored-item h-6 b"> Deposit Amount: ₹${deposit.AMT} </span>
					<span class="colored-item text2">  </span>
					<div class="colored-item flex-row">
						<span class="text2 b"> ${date.toString().substring(4, 15)} </span>
						<span class="text2 b"> TXN ID: #${deposit.DTID} </span>
					</div>
				</div>
			`
	});
	withdrawals.forEach(withdrawal => {
		let success = parseInt(withdrawal.SUCCESS);
		let color = 'green-box';
		if (success === 0) color = 'yellow-box';
		let date = new Date(withdrawal.WRDATE);
		const type = ["", "Quick INT", "Standard INV", "Quick INV"];

		withdrawalBox.innerHTML += ` 
				<div class="colored-box ${color} flex-colunm ">
					<span class="colored-item h-6 b"> Withdrawal Amount: ₹${withdrawal.AMT} </span>
					<span class="colored-item text2"> Type: ${type[withdrawal.WTYPE]} </span>
					<div class="colored-item flex-row">
						<span class="text2 b"> ${date.toString().substring(4, 15)} </span>
						<span class="text2 b"> TXN ID: #${withdrawal.WTID} </span>
					</div>
				</div>
			`
	});
}).catch(error => console.error(error));

withdrawalBox.classList.add("hidden");

const toggleMenu = (id) => {
	depositBox.classList.toggle("hidden");
	withdrawalBox.classList.toggle("hidden");
	depositBtn.classList.toggle("active");
	withdrawalBtn.classList.toggle("active");
}