const tickets = document.getElementById("tickets");
const box = document.getElementById("ticketBox");

fetch('/getData/help')
	.then(response => response.json())
	.then(data => {
		const { tick, result } = data;
		tickets.innerHTML = tick;
		result.forEach(ticket => {
			var solved = ticket.SOLVED;
			var color = 'yellow-box';
			if (solved == 1) {
				solved = "Solved";
				color = 'green-box';
			}
			else {
				solved = "Pending";
			}
			var date = ticket.TICKDATE;
			const [tdate, extra] = date.split('T');

			box.innerHTML += ` 
				<div class="ticket-box ${color} flex-colunm ">
					<span class="ticket-item h-6 b"> ${ticket.TITLE} </span>
					<span class="ticket-item text2"> ${ticket.ISSUE} </span>
					<div class="ticket-item flex-row">
						<span class="text2 b"> ${tdate} </span>
						<span class="text2 b"> ${solved} </span>
					</div>
				</div>
			`
		});

	})
	.catch(error => console.error(error));