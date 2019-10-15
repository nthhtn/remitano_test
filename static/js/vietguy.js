function validateVietguy() {
	let isValid = true;
	$('#vietguy-add-form input').each(function () {
		let value = $(this).val().trim();
		if (!value) {
			isValid = false;
			return;
		}
	});
	return isValid;
};

$('#vietguy-add-form input').on('keyup', (e) => {
	if (e.which === 13) { $('#vietguy-add-btn').trigger('click'); }
});

$('#vietguy-add-btn').on('click', () => {
	let data = {};
	if (!validateVietguy()) { return $('.error').text('Required field(s) missing'); }
	$('.error').text('');
	data = {
		idCallcenter: $('#vietguy-add-idcallcenter').val().trim(),
		account: $('#vietguy-add-account').val().trim(),
		password: $('#vietguy-add-password').val().trim(),
		brand: $('#vietguy-add-brand').val().trim(),
		description: $('#vietguy-add-description').val().trim()
	};
	$.ajax({
		url: '/vietguy',
		method: 'POST',
		data: data,
		success: (response) => {
			return !response.success ? $('#vietguy-add-form .error').html(response.error) : window.location.href = '/';
		},
		error: (error) => {
			$('#vietguy-add-form .error').html(error.responseJSON);
		}
	});
});

$('#vietguy-table tbody tr td .view-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	$.ajax({
		url: '/vietguy/' + id,
		method: 'GET',
		success: (response) => {
			let list = response.success ? response.result : [];
			let element = $('#vietguy-view .list-group');
			$(element).html('');
			list.forEach((item) => {
				let itemElement = $('<li class="list-group-item">' + item.email + '</li>');
				$(element).append(itemElement);
			});
			$('#vietguy-view').modal('show');
		}
	});
});

$('#vietguy-table tbody tr td .update-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	let idCallcenter = $(this).closest('tr').find('td:nth-child(1)').text().trim();
	let account = $(this).closest('tr').find('td:nth-child(2)').text().trim();
	let password = $(this).closest('tr').find('td:nth-child(3)').text().trim();
	let brand = $(this).closest('tr').find('td:nth-child(4)').text().trim();
	let description = $(this).closest('tr').find('td:nth-child(5)').text().trim();
	$('#vietguy-update-id').val(id);
	$('#vietguy-update-idcallcenter').val(idCallcenter);
	$('#vietguy-update-account').val(account);
	$('#vietguy-update-password').val(password);
	$('#vietguy-update-brand').val(brand);
	$('#vietguy-update-description').val(description);
	$('#vietguy-update').modal('show');
});

$('#vietguy-update-btn').on('click', () => {
	let id = $('#vietguy-update-id').val();
	let account = $('#vietguy-update-account').val();
	let password = $('#vietguy-update-password').val();
	let brand = $('#vietguy-update-brand').val();
	let description = $('#vietguy-update-description').val();
	$.ajax({
		url: '/vietguy/' + id,
		method: 'PUT',
		data: { account: account, password: password, brand: brand, description: description },
		success: (response) => {
			return !response.success ? $('#vietguy-update-form .error').html(response.error) : window.location.href = '/';
		},
		error: (error) => {
			$('#vietguy-update-form .error').html(error.responseJSON);
		}
	});
});

$('#vietguy-table tbody tr td .delete-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	$('#vietguy-delete-id').val(id);
	$('#vietguy-delete').modal('show');
});

$('#vietguy-delete-btn').on('click', () => {
	let id = $('#vietguy-delete-id').val();
	$.ajax({
		url: '/vietguy/' + id,
		method: 'DELETE',
		success: (response) => {
			window.location.href = '/';
		}
	});
});
