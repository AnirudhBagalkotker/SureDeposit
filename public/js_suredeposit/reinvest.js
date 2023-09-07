const amountInput = document.getElementById("amount-input");
const numberBtns = document.querySelectorAll(".number-btn");
const quickBtns = document.querySelectorAll(".qadd");
const clearBtn = document.querySelector(".clear");
const deleteBtn = document.querySelector(".delete");
const payBtn = document.getElementById("pay");
const intbox = document.getElementById("int");
var valBox = document.getElementById("val");

min = 1;
max = 0;

fetch('/api/deposit')
	.then(response => response.json())
	.then(data => {
		const curBalance = data.curBalance;
		const interest = data.interest;
		const principle = data.principle;

		// // Use the values of the variables here
		// console.log(curBalance, interest, principle);

		if (interest > 0) {
			max = interest;
		}
		intbox.innerText = max;
	})
	.catch(error => console.error(error));

let inputVal = "";

// Loop through all number buttons and add click event listener
numberBtns.forEach((button) => {
	button.addEventListener("click", () => {
		const num = button.textContent;
		if (!(inputVal == "" && num == "0")) {
			inputVal += num;
			if (inputVal > max) {
				inputVal = max;
			}
			updateInput(inputVal);
		}
	});
});

// Loop through all quick buttons and add click event listener
// quickBtns.forEach((qbutton) => {
//     qbutton.addEventListener("click", () => {
//         const num = qbutton.textContent;
//         inputVal = "";
//         if (num == "FULL") {
//             inputVal = "" + curBalance;
//         }
//         else if (num == "COLLECT INTEREST") {
//             inputVal = "" + interest;
//         }
//         else {
//             inputVal += num;
//         }
//         updateInput(inputVal);
//     });
// });

// Add click event listener to clear button
clearBtn.addEventListener("click", () => {
	inputVal = "";
	amountInput.value = inputVal;
	valBox.innerHTML = 0;
	payBtn.classList.add("btn-unselect");
});

// Add click event listener to delete button
deleteBtn.addEventListener("click", () => {
	inputVal = inputVal.slice(0, -1);
	if (inputVal != "") {
		updateInput(inputVal);
	}
	else {
		amountInput.value = "";
		valBox.innerHTML = 0;
		payBtn.classList.add("btn-unselect");
	}
});

// Update the input box with the new value
function updateInput(value) {
	payBtnClick(value);
	valBox.innerHTML = value;
	amountInput.value = "₹ " + value;
}

//check for the continue button to activate and deactivate
function payBtnClick(value) {
	if (((value) >= min && (value) <= max) && payBtn.classList.contains("btn-unselect")) {
		payBtn.classList.remove("btn-unselect");
	}
	else if (((value) < min) && !payBtn.classList.contains("btn-unselect")) {
		payBtn.classList.add("btn-unselect");
	}
}

payBtn.addEventListener("click", () => {
	var amt = valBox.innerHTML;
	localStorage.setItem("ramt", amt);
	location.href = "/confirmreinvest";
});
