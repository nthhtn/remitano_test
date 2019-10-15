function validateFpt() {
	let isValid = true;
	$('#fpt-add-form input').each(function () {
		let value = $(this).val().trim();
		if (!value) {
			isValid = false;
			return;
		}
	});
	return isValid;
};

$('#fpt-add-form input').on('keyup', (e) => {
	if (e.which === 13) { $('#fpt-add-btn').trigger('click'); }
});

$('#fpt-add-btn').on('click', () => {
	let data = {};
	if (!validateFpt()) { return $('.error').text('Required field(s) missing'); }
	$('.error').text('');
	data = {
		idCallcenter: $('#fpt-add-idcallcenter').val().trim(),
		client_id: $('#fpt-add-clientid').val().trim(),
		client_secret: $('#fpt-add-clientsecret').val().trim(),
		session_id: $('#fpt-add-sessionid').val().trim(),
		scope: $('#fpt-add-scope').val().trim(),
		brand: $('#fpt-add-brand').val().trim(),
		description: $('#fpt-add-description').val().trim()
	};
	$.ajax({
		url: '/fpt',
		method: 'POST',
		data: data,
		success: (response) => {
			return !response.success ? $('#fpt-add-form .error').html(response.error) : window.location.href = '/';
		},
		error: (error) => {
			$('#fpt-add-form .error').html(error.responseJSON);
		}
	});
});

$('#fpt-table tbody tr td .view-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	$.ajax({
		url: '/fpt/' + id,
		method: 'GET',
		success: (response) => {
			let list = response.success ? response.result : [];
			let element = $('#fpt-view .list-group');
			$(element).html('');
			list.forEach((item) => {
				let itemElement = $('<li class="list-group-item">' + item.email + '</li>');
				$(element).append(itemElement);
			});
			$('#fpt-view').modal('show');
		}
	});
});

$('#fpt-table tbody tr td .update-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	let idCallcenter = $(this).closest('tr').find('td:nth-child(1)').text().trim();
	let client_id = $(this).closest('tr').find('td:nth-child(2)').text().trim();
	let client_secret = $(this).closest('tr').find('td:nth-child(3)').text().trim();
	let session_id = $(this).closest('tr').find('td:nth-child(4)').text().trim();
	let scope = $(this).closest('tr').find('td:nth-child(5)').text().trim();
	let brand = $(this).closest('tr').find('td:nth-child(6)').text().trim();
	let description = $(this).closest('tr').find('td:nth-child(7)').text().trim();
	$('#fpt-update-id').val(id);
	$('#fpt-update-idcallcenter').val(idCallcenter);
	$('#fpt-update-clientid').val(client_id);
	$('#fpt-update-clientsecret').val(client_secret);
	$('#fpt-update-sessionid').val(session_id);
	$('#fpt-update-scope').val(scope);
	$('#fpt-update-brand').val(brand);
	$('#fpt-update-description').val(description);
	$('#fpt-update').modal('show');
});

$('#fpt-update-btn').on('click', () => {
	let id = $('#fpt-update-id').val();
	let client_id = $('#fpt-update-clientid').val();
	let client_secret = $('#fpt-update-clientsecret').val();
	let brand = $('#fpt-update-brand').val();
	let scope = $('#fpt-update-scope').val();
	let session_id = $('#fpt-update-sessionid').val();
	let description = $('#fpt-update-description').val();
	$.ajax({
		url: '/fpt/' + id,
		method: 'PUT',
		data: { client_id, client_secret, brand, scope, session_id, description },
		success: (response) => {
			return !response.success ? $('#fpt-update-form .error').html(response.error) : window.location.href = '/';
		},
		error: (error) => {
			$('#fpt-update-form .error').html(error.responseJSON);
		}
	});
});

$('#fpt-table tbody tr td .delete-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	$('#fpt-delete-id').val(id);
	$('#fpt-delete').modal('show');
});

$('#fpt-delete-btn').on('click', () => {
	let id = $('#fpt-delete-id').val();
	$.ajax({
		url: '/fpt/' + id,
		method: 'DELETE',
		success: (response) => {
			window.location.href = '/';
		}
	});
});
