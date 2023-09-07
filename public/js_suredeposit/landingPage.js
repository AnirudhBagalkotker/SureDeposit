const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		console.log(entry);
		if (entry.isIntersecting) {
			setTimeout(() => {
				entry.target.classList.add('show');
			}, 250);
		}
	});
});

const hiddenElements = document.querySelectorAll('.scroll');
hiddenElements.forEach((el) => observer.observe(el))

const qrBox = document.getElementById('qrBox');
const qrBtn = document.getElementById('qrBtn');
qrBtn.addEventListener("click", () => {
	qrBtn.classList.add("hidden");
	setTimeout(() => {
		qrBox.classList.remove("hidden");
	}, 200)
});