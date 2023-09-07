const form = document.getElementById("signup");
const nameInput = document.getElementById("cName");
const phoneInput = document.getElementById("cPhone");
const emailInput = document.getElementById("cEmail");
const passInput = document.getElementById("pass");
const cpassInput = document.getElementById("cpass");
const ageCheckbox = document.getElementById("age_checkbox");
const signupBtn = document.getElementById("signupBtn");
const inputFields = document.querySelectorAll('.field-value');
const ageCheck = document.querySelector('#age_checkbox');
const referral = document.getElementById("referralCode")
const submitBtn = document.querySelector('#signupBtn');
const codeBtn = document.querySelector('#codeCheck');


// Step Btns
const formSteps = document.querySelectorAll('.step');
const nextBtns = document.querySelectorAll('.nextBtn');
const prevBtns = document.querySelectorAll('.prevBtn');


// get the error box element
const errorBox = document.querySelector('.error-box');
const errorText = document.querySelector('#error-box');


// Regex patterns for validation
const strongPassRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-+={}[\]:";'<>,.?/\\])(?=.{8,})/;
const phoneRegex = /^\d{10}$/;
const emailRegex = /^\S+@\S+\.\S+$/;

// Set the current step to 1
let currentStep = 1;

function hideSteps() {
    formSteps.forEach((step) => {
        step.classList.add('hidden');
    });
    formSteps[currentStep - 1].classList.remove('hidden');
}

function showNext() {
    currentStep++;
    hideSteps();
}

function showPrev() {
    currentStep--;
    hideSteps();
}

function showError(message) {
    errorBox.style.display = 'flex';
    errorText.style.display = 'flex';
    errorText.textContent = message;
    setTimeout(() => {
        errorText.textContent = "";
        errorText.style.display = 'none';
        errorBox.style.display = 'none';
    }, 2000);

}

nextBtns.forEach((nextBtn) => {
    nextBtn.addEventListener('click', () => {
        // console.log("clicked");
        if (currentStep === 1) {
            if (nameInput.checkValidity() && phoneInput.checkValidity()) {
                showNext();
            } else {
                showError('Please enter a valid name and phone number.');
            }
        } else if (currentStep === 2) {
            if (emailInput.checkValidity()) {
                showNext();
            } else {
                showError('Please enter a valid email address.');
            }
        } else if (currentStep === 3) {
            if (passInput.checkValidity() && cpassInput.checkValidity()) {
                showNext();
            } else {
                showError('Please enter Password and Confirm password.');
            }
        }
    });
});

prevBtns.forEach((prevBtn) => {
    prevBtn.addEventListener('click', () => {
        showPrev();
    });
});

// Hide all the steps except the first one
hideSteps();

// Function to check if all fields are not empty
function checkAllFieldsNotEmpty() {
    let allFieldsNotEmpty = true;
    inputFields.forEach((inputField) => {
        if (inputField.value === '') {
            allFieldsNotEmpty = false;
        }
    });
    return allFieldsNotEmpty;
}

// Add an event listener to each input field to check if it's not empty
inputFields.forEach((inputField) => {
    inputField.addEventListener('input', () => {
        if (checkAllFieldsNotEmpty() && ageCheck.checked) {
            submitBtn.classList.remove('btn-unselect');
            submitBtn.removeAttribute('disabled');
        } else {
            submitBtn.classList.add('btn-unselect');
            submitBtn.setAttribute('disabled', true);
        }
    });
});

codeBtn.addEventListener("click", () => {
    if (referral.value != '') {
        const referralId = referral.value;
        fetch('/auth/code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: referralId
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(data.x);
                if (data.x == 1) {
                    // console.log("first");
                    const tick = document.querySelector('.tick');
                    tick.style.display = 'inline';
                    referral.readOnly = true;
                    // codeBtn.classList.add("hidden");
                }
                else {
                    // console.log("second");
                    showError('Wrong Referral Code')
                    referral.focus();
                    return;
                }
            })
    }
});

// Add an event listener to the age check checkbox to toggle the submit button
ageCheck.addEventListener('click', () => {
    if (checkAllFieldsNotEmpty() && ageCheck.checked) {
        submitBtn.classList.remove('btn-unselect');
        submitBtn.removeAttribute('disabled');

        // get the form element
        const signUpForm = document.querySelector('#signup');

        // add an event listener to the form's submit event
        signUpForm.addEventListener('submit', (event) => {
            // prevent the default form submission behavior
            event.preventDefault();

            // get the form fields
            const nameField = document.querySelector('#cName');
            const phoneField = document.querySelector('#cPhone');
            const emailField = document.querySelector('#cEmail');
            const passwordField = document.querySelector('#pass');
            const confirmPasswordField = document.querySelector('#cpass');
            const genderField = document.querySelector('input[name="gender"]:checked');
            const ageCheckbox = document.querySelector('#age_checkbox');

            // clear any existing error messages
            errorBox.style.display = 'none';
            errorText.textContent = '';

            // validate the name field
            const name = nameField.value.trim();
            if (!name) {
                showError('Please enter your name')
                nameField.focus();
                return;
            }

            // validate the phone number field
            const phone = phoneField.value.trim();
            if (!phone) {
                showError('Please enter your phone number')
                phoneField.focus();
                return;
            }

            if (!phoneRegex.test(phone)) {
                showError('Please enter a valid phone number')
                phoneField.focus();
                return;
            }

            // validate the email field
            const email = emailField.value.trim();
            if (!email) {
                showError('Please enter your email address')
                emailField.focus();
                return;
            }

            if (!emailRegex.test(email)) {
                showError('Please enter a valid email address')
                referral.focus();
                return;
            }

            // validate the password field
            const password = passwordField.value.trim();
            if (!password) {
                showError('Please enter your password')
                passwordField.focus();
                return;
            }

            if (!strongPassRegex.test(password)) {
                showError('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character')
                passwordField.focus();
                return;
            }

            // validate the confirm password field
            const confirmPassword = confirmPasswordField.value.trim();
            if (!confirmPassword) {
                showError('Please confirm your password')
                referral.focus();
                return;
            }

            // validate that password and confirm password match
            if (password !== confirmPassword) {
                showError('Password and confirm password do not match')
                referral.focus();
                return;
            }

            // validate the gender field
            if (!genderField) {
                showError('Please select your gender')
                referral.focus();
                return;
            }

            // validate the age checkbox
            if (!ageCheckbox.checked) {
                showError('Please confirm that your age and agree to the terms')
                referral.focus();
                return;
            }

            d = 1;

            if (referral.value != '') {
                const referralId = referral.value;
                fetch('/auth/code', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: referralId
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        console.log(data.x);
                        if (data.x == 1) {
                            console.log("first");
                            const tick = document.querySelector('.tick');
                            tick.style.display = 'inline';
                            referral.readOnly = true;
                        }
                        else {
                            d = 0;
                            console.log("second");
                            showError('Wrong Referral Code')
                            referral.focus();
                            return;
                        }
                    })
            }
            else {
                d = 0;
            }
            var referralId = "";
            if ((referral.value == '' || referral.value == null) && (d == 0)) {
                referralId = null;
            }
            else if (referral.value == "YT100" || referral.value == "IG100" || referral.value == "TW100" || referral.value == "FB100") {
                referralId = referral.value;
            }
            else {
                referralId = referral.value.slice(2);
            }

            // console.log(referralId);
            // if all fields are valid, submit the form data via AJAX
            fetch('/auth/signup1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cName: name,
                    cPhone: phone,
                    cEmail: email,
                    pass: password,
                    cpass: confirmPassword,
                    age_checkbox: ageCheckbox.value,
                    gender: genderField.value,
                    rewards: referralId
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
                        errorText.innerHTML = 'Account already exists';
                    } else if (error.response && error.response.status === 400) {
                        errorText.innerHTML = 'Password do not match';
                    } else {
                        errorText.innerHTML = 'Account already exists';
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
    } else {
        submitBtn.classList.add('btn-unselect');
        submitBtn.setAttribute('disabled', true);
    }
});