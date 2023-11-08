const payment_success = document.getElementById("payment_success");
const loader = document.getElementById("loader");
payment_success.classList.add("hidden");
payment_success.classList.remove("hidden");
loader.classList.add("hidden");
localStorage.removeItem("amt");