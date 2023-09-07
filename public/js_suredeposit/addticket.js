const titleField = document.getElementById("title");
const issueField = document.getElementById("issue");
const submitButton = document.getElementById("ticketBtn");

titleField.addEventListener("input", checkFields);
issueField.addEventListener("input", checkFields);

function checkFields() {
	if (titleField.value.trim() !== "" && issueField.value.trim() !== "") {
		submitButton.classList.remove("btn-unselect");
	} else {
		submitButton.classList.add("btn-unselect");
	}
}