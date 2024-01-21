// Error box elements
const errorBox = document.querySelector('.error-box');
const errorText = document.querySelector('#error-box');

function forgotPassword() {
	const emailField = document.querySelector('#cEmail');
	const email = emailField.value.trim();

	// clear any existing error messages
	errorText.textContent = '';
	errorBox.style.display = 'none';

	if (!email) {
		errorText.textContent = 'Please enter your Email address';
		errorBox.style.display = 'flex';
		emailField.focus();
		return;
	}

	else fetchRequest(email);
}

function resendOTP() {
	const searchParams = new URLSearchParams(window.location.search);
	const email = searchParams.get('email');
	if (!email) window.location.href = '/forgot-password';

	fetchRequest(email);
}

function fetchRequest(email) {
	fetch('/auth/forgot-password', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ cEmail: email })
	}).then(response => {
		if (!response.ok) throw Error(response.statusText);
		return response;
	}).then(response => response.json()).then(data => {
		if (data.success === true) {
			const token = `${data.otp}RP${data.token}`;
			window.location.href = `/reset-password?email=${email}&token=${token}`;
		}
		else throw Error(data.error);
	}).catch(error => {
		errorText.textContent = error.message;
		errorBox.style.display = 'flex';
	})
}