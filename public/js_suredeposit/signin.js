const signInForm = document.querySelector('#signin');

function togglePasswordVisibility() {
	var passField = document.getElementById("pass");
	var showBtn = document.querySelector(".show-password-btn");

	if (passField.type === "password") {
		passField.type = "text";
	} else {
		passField.type = "password";
	}
}

// add an event listener to the form's submit event
signInForm.addEventListener('submit', (event) => {
	// prevent the default form submission behavior
	event.preventDefault();

	// get the email and password fields
	const emailField = document.querySelector('#cEmail');
	const passwordField = document.querySelector('#pass');

	// get the error box element
	const errorBox = document.querySelector('.error-box');
	const errorText = document.querySelector('#error-box');

	// clear any existing error messages
	errorBox.style.display = 'none';
	errorText.textContent = '';

	// validate the email field
	const email = emailField.value.trim();
	if (!email) {
		errorText.textContent = 'Please enter your email address';
		errorBox.style.display = 'flex';
		emailField.focus();
		return;
	}

	// validate the password field
	const password = passwordField.value.trim();
	if (!password) {
		errorText.textContent = 'Please enter your password';
		errorBox.style.display = 'flex';
		passwordField.focus();
		return;
	}

	// if both fields are valid, submit the form data via AJAX
	fetch('/auth/signin', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			cEmail: email,
			pass: password
		})
	})
		.then(response => {
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response;
		})
		.then(response => response.json())
		.then(data => {
			// Do something with the response data
			// console.log(data);
			// Redirect to another page
			window.location.href = '/splash';
		})
		.catch(error => {
			// Handle error and show error message
			errorBox.style.display = 'flex';
			errorText.style.display = 'flex';
			console.log(error.message);
			if (error.response && error.response.status === 401) {
				errorText.innerHTML = 'Wrong email or password';
			} else if (error.response && error.response.status === 400) {
				errorText.innerHTML = 'Please enter your email and password';
			} else {
				errorText.innerHTML = 'Wrong email or password';
			}
			if (error.response && error.response.body) {
				try {
					const errorJson = JSON.parse(error.response.body);
					console.log(errorJson);
					if (errorJson.error && errorJson.error.message) {
						errorText.innerHTML = errorJson.error.message;
					}
				} catch (e) {
					// do nothing if response body is not a valid JSON string
				}
			}
		});
});
