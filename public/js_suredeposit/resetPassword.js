const screen = document.getElementById("screen");
const otpBox = document.getElementById("otpBox");
const otp_box = document.querySelectorAll(".otp-box");
const count = document.getElementById("count");
const expireText = document.getElementById("expireText");
const submitBtn = document.getElementById("submitBtn");

const searchParams = new URLSearchParams(window.location.search);
const token = searchParams.get('token');
const email = searchParams.get('email').trim();

submitBtn.classList.add("btn-unselect");
submitBtn.setAttribute("disabled", true);

const timer = (() => {
	if (token === null || token === undefined || token.length <= 6 || token.substring(4, 6) !== "RP") {
		expireText.innerHTML = `Your OTP is Expired. Please try again 1`;
		return;
	} else {
		const time = Math.floor(parseInt(token.substring(6)) / 1000);
		const time2 = Math.floor((new Date().getTime()) / 1000);
		if (time2 - time > 300) {
			expireText.innerHTML = `Your OTP is Expired. Please try again 2`;
			return;
		}
		else {
			count.innerText = time2 - time;
			const expireInterval = setInterval(() => {
				count.innerText--;
				if (count.innerText == 0) clearInterval(expireInterval);
			}, 1000);
		}
	}
})();

otp_box.forEach((otp, index) => {
	otp.addEventListener("keyup", (event) => {
		const curIndex = otp;
		const nextInput = otp.nextElementSibling;
		const prevInput = otp.previousElementSibling;
		if (nextInput && nextInput.hasAttribute("disabled") && curIndex.value !== "") {
			nextInput.removeAttribute("disabled", true);
			nextInput.focus();
		} else if (prevInput && prevInput.hasAttribute("disabled") && curIndex.value !== "") {
			prevInput.removeAttribute("disabled", true);
			prevInput.focus();
		} else if (curIndex.value !== "") {
			nextInput.removeAttribute("disabled", true);
			nextInput.focus();
		}
		if (event.key === "Backspace") {
			otp_box.forEach((otp, index1) => {
				if (index <= index1 && prevInput) {
					otp.setAttribute("disabled", true);
					prevInput.focus();
					prevInput.value = "";
				}
			})
		}
		if (!otp_box[3].disabled && otp_box[3].value !== "") {
			otp_box.blur;
			submitBtn.classList.remove("btn-unselect");
			submitBtn.removeAttribute("disabled", true);
		}
	})
})

const verifyOTP = () => {
	// clear any existing error messages
	errorText.textContent = '';
	errorBox.style.display = 'none';

	const otp = `${otp_box[0].value}${otp_box[1].value}${otp_box[2].value}${otp_box[3].value}`;
	if (parseInt(token.substring(0, 4)) === otp) showResetPassword();
	else {
		errorBox.style.display = 'flex';
		errorText.textContent = "Please enter valid OTP";
		otp_box.forEach(otp => { otp.value = null; });
		return;
	}
}

const showResetPassword = () => {
	otpBox.style.display = 'none';
	screen.innerHTML = `
	<div class="flex-colunm signin-container">
		<form id="reset-password" class="signin-box" name="reset-password" action="/auth/reset-password" method="POST">
			<div class="fields">
				<label for="pass" class="field-name">New Password</label>
				<div class="password-field">
					<input type="password" value="" class="field-value" id="pass" name="pass" required
						placeholder="New Password" minlength="8" >
					<button type="button" class="show-password-btn" onclick="togglePasswordVisibility()">
						<img src="img_suredeposit/eye.svg" alt="" class="show-password-icon">
					</button>
				</div>
			</div>
			<div class="fields">
				<label for="cpass" class="field-name">Confirm Password</label>
				<input type="password" class="field-value" id="cpass" name="cpass" placeholder="Confirm Password"
					minlength="8" required>
			</div>
			<div class="flex item-center">
				<button type="submit" class="btn" id="submitBtn">Reset Password</button>
			</div>
			<div class="error-box item-center">
				<p id="error-box" class="center"></p>
			</div>
		</form>
	</div>
	`;

	const resetPasswordForm = document.getElementById("reset-password");
	resetPasswordForm.addEventListener("submit", (event) => {
		event.preventDefault();
		const submitBtn = document.getElementById("submitBtn");
		submitBtn.classList.add("btn-unselect");
		submitBtn.setAttribute("disabled", true);

		const passField = document.getElementById("pass");
		const cpassField = document.getElementById("cpass");
		if (!passField.value.trim()) {
			errorBox.style.display = 'flex';
			errorText.textContent = "Please enter password";
			passField.focus();
			submitBtn.classList.remove("btn-unselect");
			submitBtn.removeAttribute("disabled");
			return;
		}
		else if (!cpassField.value.trim()) {
			errorBox.style.display = 'flex';
			errorText.textContent = "Please enter confirm password";
			cpassField.focus();
			submitBtn.classList.remove("btn-unselect");
			submitBtn.removeAttribute("disabled");
			return;
		}
		else if (passField.value.trim() !== cpassField.value.trim()) {
			errorBox.style.display = 'flex';
			errorText.textContent = "Passwords do not match";
			passField.focus();
			cpassField.focus();
			submitBtn.classList.remove("btn-unselect");
			submitBtn.removeAttribute("disabled");
			return;
		}
		else {
			fetch('/auth/reset-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ cEmail: email, pass: passField.value.trim() })
			}).then(response => {
				if (!response.ok) throw Error(response.statusText);
				return response;
			}).then(response => response.json()).then(data => {
				if (data.success === true) {
					screen.innerHTML = `
					<section class="screen flex-colunm item-center center" id="payment_success">
						<div id="imgBox" class="flex-colunm item-center center">
							<img src="img_suredeposit/check.svg" alt="">
						</div>
						<h2 class="color margin-bottom">Password Reset Successful</h2>
						<a href="/signin" class="btn">Signin</a>
					</section>
					`;
				}
				else throw Error(data.error);
			}).catch(error => {
				errorBox.style.display = 'flex';
				errorText.textContent = error.message;
				submitBtn.classList.remove("btn-unselect");
				submitBtn.removeAttribute("disabled");
			})
		}
	})
}