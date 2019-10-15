function validate() {
	let isValid = true;
	$('#authorize-form input').each(function () {
		let value = $(this).val().trim();
		if (!value) {
			isValid = false;
			return;
		}
	});
	return isValid;
};

$('#authorize-form input').on('keyup', (e) => {
	if (e.which === 13) { $('#authorize-btn').trigger('click'); }
});

$('#authorize-btn').on('click', () => {
	if (!validate()) { return $('.error').text('Missing field(s)'); }
	$('.error').text('');
	let data = {
		email: $('#email').val(),
		password: $('#password').val(),
		refresh_token: $('#refresh_token').val(),
		access_token: $('#access_token').val(),
		retrievedAt: retrievedAt
	};
	$.ajax({
		url: '/authorize',
		method: 'POST',
		data: data,
		success: (response) => {
			$('#authorize-form').css('display','none');
			$('#success-form').css('display','block');
			$('#authorize-btn').css('display','none');
		},
		error: (error) => {
			$('.error').text('Invalid Gcalls username/password');
		}
	});
});
