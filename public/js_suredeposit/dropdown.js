async function dropdown() {
	const faqRows = document.querySelectorAll('.faq-row');

	faqRows.forEach((row) => {
		const arrow = row.querySelector('.faq-arrow');

		row.addEventListener('click', function () {
			const content = row.nextElementSibling;

			if (content.classList.contains('faq-content')) {
				// Toggle the height of the content row
				content.classList.toggle('open');
				content.classList.toggle('hidden');
				arrow.classList.toggle('open');

				// Rotate the arrow image in the clicked row
				if (content.classList.contains('open')) {
					content.style.height = content.scrollHeight + 'px';
				} else {
					content.style.height = 0;
				}

				// Rotate the arrow image in the clicked row
				if (arrow.classList.contains('open')) {
					arrow.style.transform = 'rotate(90deg)';
				} else {
					arrow.style.transform = 'rotate(0deg)';
				}
			}
		});
	});
}