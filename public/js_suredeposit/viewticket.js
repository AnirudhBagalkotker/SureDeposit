const tickets = document.getElementById("tickets");
const box = document.getElementById("ticketBox");

fetch('/getData/help').then(response => response.json()).then(data => {
	const { tick, result } = data;
	tickets.innerHTML = tick;
	result.forEach(ticket => {
		let solved = ticket.SOLVED;
		let color = 'yellow-box';
		if (solved === 1) {
			solved = "Solved";
			color = 'green-box';
		}
		else solved = "Pending";
		let date = new Date(ticket.TICKDATE);

		box.innerHTML += ` 
				<div class="colored-box ${color} flex-colunm ">
					<span class="colored-item h-6 b"> ${ticket.TITLE} </span>
					<span class="colored-item text2"> ${ticket.ISSUE} </span>
					<div class="colored-item flex-row">
						<span class="text2 b"> ${date.toString().substring(4, 15)} </span>
						<span class="text2 b"> ${solved} </span>
					</div>
				</div>
			`
	});
}).catch(error => console.error(error));