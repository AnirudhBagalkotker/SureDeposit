const deposit = document.getElementById("deposit");
const withdrawal = document.getElementById("withdrawal");
const depositBox = document.getElementById("depositBox");
const withdrawalBox = document.getElementById("withdrawalBox");
const depositBtn = document.getElementById("depositBtn");
const withdrawalBtn = document.getElementById("withdrawalBtn");

fetch('/getData/history').then(response => response.json()).then(data => {
	const { deposits, withdrawals } = data
	deposits.forEach(deposit => {
		const success = parseInt(deposit.SUCCESS);
		let color = 'green';
		if (success === 0) color = 'red';
		const date = new Date(deposit.DTDATE);
		const successful = ["FAILED", "SUCCESS"];

		depositBox.innerHTML +=
			`<tr class="flex-colunm w-full">
				<td class="first flex-row w-full item-space">
					<span class="text2 b ${color}"> ${date.toString().substring(4, 15)} </span>
					<span class="colored-item h-6 b ${color}"> ₹${deposit.AMT} </span>
				</td>
				<td class="second flex-row w-full item-space">
					<span class="text2 b ${color}"> TXN ID: #${deposit.DTID}</span>
					<span class="text2 b ${color}"> ${successful[success]} </span>
				</td>
			</tr>
			<div class="hrstyle"></div>`;
	});
	withdrawals.forEach(withdrawal => {
		const success = parseInt(withdrawal.SUCCESS);
		let color = 'green';
		if (success === 0) color = 'yellow';
		const date = new Date(withdrawal.WRDATE);
		const type = ["", "Quick INT", "Standard INV", "Quick INV"];
		const successful = ["PROCESSING", "SUCCESS"];

		withdrawalBox.innerHTML +=
			`<tr class="flex-colunm w-full">
				<td class="first flex-row w-full item-space">
					<span class="text2 b ${color}"> ${date.toString().substring(4, 15)} </span>
					<span class="colored-item h-6 b ${color}"> ₹${withdrawal.AMT}  </span>
				</td>
				<td class="second flex-row w-full item-space">
					<span class="text2 b ${color}"> Type: ${type[withdrawal.WTYPE]}</span>
					<span class="text2 b ${color}"> ${successful[success]} </span>
				</td>
			</tr>
			<div class="hrstyle"></div>`;
	});
	if (deposits.length === 0) {
		depositBox.innerHTML =
			`<div class="margin-top padding flex-colunm ">
				<img src="img_suredeposit/no-deposit.svg" alt="No Deposit" class="no-deposit w-half h-auto">	
				<h3 class="b color margin-bottom text center">You Don\'t Have Any Deposits</h3>
			</div>`;
	}
	if (withdrawals.length === 0) {
		withdrawalBox.innerHTML =
			`<div class="margin-top padding flex-colunm ">
				<img src="img_suredeposit/no-deposit.svg" alt="No Deposit" class="no-deposit w-half h-auto">	
				<h3 class="b color margin-bottom text center">You Don\'t Have Any Withdrawals</h3>
			</div>`;
	}
}).catch(error => console.error(error));

withdrawal.classList.add("hidden");

dropdown();

const toggleMenu = (id) => {
	deposit.classList.toggle("hidden");
	withdrawal.classList.toggle("hidden");
	depositBtn.classList.toggle("active");
	withdrawalBtn.classList.toggle("active");
}