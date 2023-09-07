const tickets = document.getElementById("tickets");
const raiseTicket = document.getElementById("raise-ticket");
const viewTicket = document.getElementById("view-ticket");

fetch('/getData/help')
	.then(response => response.json())
	.then(data => {
		const tick = data.tick;
		tickets.innerHTML = tick;
		if (tick > 0) {
			viewTicket.classList.remove("hidden");
			raiseTicket.classList.add("hidden");
		}
	})
	.catch(error => console.error(error));