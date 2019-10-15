function validate() {
	let isValid = true;
	$('#signin-form input').each(function () {
		let value = $(this).val().trim();
		if (!value) {
			isValid = false;
			return;
		}
	});
	return isValid;
};

$('#signin-form input').on('keyup', (e) => {
	if (e.which === 13) { $('#signin-btn').trigger('click'); }
});

$('#signin-btn').on('click', () => {
	if (!validate()) { return $('.error').text('Missing field(s)'); }
	$('.error').text('');
	let data = {
		username: $('#username').val(),
		password: $('#password').val()
	};
	$.ajax({
		url: '/signin',
		method: 'POST',
		data: data,
		success: (response) => {
			window.location.href = '/';
		},
		error: (error) => {
			$('.error').html('Invalid username/password');
		}
	});
});
