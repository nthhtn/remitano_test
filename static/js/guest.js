function validateEmail(email) {
	let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return pattern.test(email);
};

$('#login-btn').on('click', () => {
	let email = $('#login-email').val();
	if (!validateEmail(email)) {
		$('#login-form .login-error').html('Invalid email');
		return;
	}
	let password = $('#login-password').val();
	if (!password) {
		$('#login-form .login-error').html('Invalid password');
		return;
	}
	$.ajax({
		url: '/login',
		method: 'POST',
		data: { email: email, password: password },
		success: (response) => {
			window.location.href = '/';
		},
		error: (error) => {
			$('#login-form .login-error').html(error.responseJSON.error);
		}
	});
});
