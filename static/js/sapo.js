function validateSapo() {
	let isValid = true;
	$('#sapo-add-form input').each(function () {
		let value = $(this).val().trim();
		if (!value) {
			isValid = false;
			return;
		}
	});
	return isValid;
};

$('#sapo-add-form input').on('keyup', (e) => {
	if (e.which === 13) { $('#sapo-add-btn').trigger('click'); }
});

$('#sapo-add-btn').on('click', () => {
	let data = {};
	if (!validateSapo()) { return $('.error').text('Required field(s) missing'); }
	$('.error').text('');
	data = {
		idCallcenter: $('#sapo-add-idcallcenter').val().trim(),
		tenant: $('#sapo-add-tenant').val().trim(),
		token: $('#sapo-add-token').val().trim(),
		description: $('#sapo-add-description').val().trim()
	};
	$.ajax({
		url: '/sapo',
		method: 'POST',
		data: data,
		success: (response) => {
			return !response.success ? $('#sapo-add-form .error').html(response.error) : window.location.href = '/';
		},
		error: (error) => {
			$('#sapo-add-form .error').html(error.responseJSON);
		}
	});
});

$('#sapo-table tbody tr td .view-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	$.ajax({
		url: '/sapo/' + id,
		method: 'GET',
		success: (response) => {
			let list = response.success ? response.result : [];
			let element = $('#sapo-view .list-group');
			$(element).html('');
			list.forEach((item) => {
				let itemElement = $('<li class="list-group-item">' + item.email + '</li>');
				$(element).append(itemElement);
			});
			$('#sapo-view').modal('show');
		}
	});
});

$('#sapo-table tbody tr td .update-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	let idCallcenter = $(this).closest('tr').find('td:nth-child(1)').text().trim();
	let tenant = $(this).closest('tr').find('td:nth-child(2)').text().trim();
	let token = $(this).closest('tr').find('td:nth-child(3)').text().trim();
	let description = $(this).closest('tr').find('td:nth-child(4)').text().trim();
	$('#sapo-update-id').val(id);
	$('#sapo-update-idcallcenter').val(idCallcenter);
	$('#sapo-update-tenant').val(tenant);
	$('#sapo-update-token').val(token);
	$('#sapo-update-description').val(description);
	$('#sapo-update').modal('show');
});

$('#sapo-update-btn').on('click', () => {
	let id = $('#sapo-update-id').val();
	let tenant = $('#sapo-update-tenant').val();
	let token = $('#sapo-update-token').val();
	let description = $('#sapo-update-description').val();
	$.ajax({
		url: '/sapo/' + id,
		method: 'PUT',
		data: { tenant: tenant, token: token, description: description },
		success: (response) => {
			return !response.success ? $('#sapo-update-form .error').html(response.error) : window.location.href = '/';
		},
		error: (error) => {
			$('#sapo-update-form .error').html(error.responseJSON);
		}
	});
});

$('#sapo-table tbody tr td .delete-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	$('#sapo-delete-id').val(id);
	$('#sapo-delete').modal('show');
});

$('#sapo-delete-btn').on('click', () => {
	let id = $('#sapo-delete-id').val();
	$.ajax({
		url: '/sapo/' + id,
		method: 'DELETE',
		success: (response) => {
			window.location.href = '/';
		}
	});
});
