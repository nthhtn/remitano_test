$('#login-btn').on('click', () => {
	let email = $('#login-email').val();
	let password = $('#login-password').val();
	$.ajax({
		url: '/login',
		method: 'POST',
		data: { email: email, password: password },
		success: (response) => {

		},
		error: (error) => {

		}
	});
});
