const amountInput = document.getElementById("amount-input");
const numberBtns = document.querySelectorAll(".number-btn");
const quickBtns = document.querySelectorAll(".qadd");
const clearBtn = document.querySelector(".clear");
const deleteBtn = document.querySelector(".delete");
const payBtn = document.getElementById("pay");
const bal = document.getElementById("bal");
var valBox = document.getElementById("val");

min = 100;
max = 0;

fetch('/api/withdraw')
    .then(response => response.json())
    .then(data => {
        curBalance = data.curBalance;
        interest = data.interest;
        principle = data.principle;
        bal.innerHTML += interest;
        if (interest > 0) {
            max = interest;
        }
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
    localStorage.setItem("wamt", amt);
    localStorage.setItem("oamt", amt);
    localStorage.setItem("per", -1);
    location.href = "/withdrawreq";
});
