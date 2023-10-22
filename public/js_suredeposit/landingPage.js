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

function register() {
	if (window.innerWidth < 1024) {
		window.location.href = "https://play.google.com/store/apps/details?id=com.Pageturners_tech.sure_deposit_AIA_store";
	} else {
		window.location.href = "/signup";
	}
}