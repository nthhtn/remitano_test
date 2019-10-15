function validateMio() {
	let isValid = true;
	$('#mio-add-form input').each(function () {
		let value = $(this).val().trim();
		if (!value) {
			isValid = false;
			return;
		}
	});
	return isValid;
};

$('#mio-add-form input').on('keyup', (e) => {
	if (e.which === 13) { $('#mio-add-btn').trigger('click'); }
});

$('#mio-add-btn').on('click', () => {
	let data = {};
	if (!validateMio()) { return $('.error').text('Required field(s) missing'); }
	$('.error').text('');
	data = {
		idCallcenter: $('#mio-add-idcallcenter').val().trim(),
		client_id: $('#mio-add-client-id').val().trim(),
		secure_secret: $('#mio-add-secure-secret').val().trim(),
		description: $('#mio-add-description').val().trim()
	};
	$.ajax({
		url: '/mio',
		method: 'POST',
		data: data,
		success: (response) => {
			return !response.success ? $('#mio-add-form .error').html(response.error) : window.location.href = '/';
		},
		error: (error) => {
			$('#mio-add-form .error').html(error.responseJSON);
		}
	});
});

$('#mio-table tbody tr td .view-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	$.ajax({
		url: '/mio/' + id,
		method: 'GET',
		success: (response) => {
			let list = response.success ? response.result : [];
			let element = $('#mio-view .list-group');
			$(element).html('');
			list.forEach((item) => {
				let itemElement = $('<li class="list-group-item">' + item.email + '</li>');
				$(element).append(itemElement);
			});
			$('#mio-view').modal('show');
		}
	});
});

$('#mio-table tbody tr td .update-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	let idCallcenter = $(this).closest('tr').find('td:nth-child(1)').text().trim();
	let client_id = $(this).closest('tr').find('td:nth-child(2)').text().trim();
	let secure_secret = $(this).closest('tr').find('td:nth-child(3)').text().trim();
	let description = $(this).closest('tr').find('td:nth-child(4)').text().trim();
	$('#mio-update-id').val(id);
	$('#mio-update-idcallcenter').val(idCallcenter);
	$('#mio-update-client-id').val(client_id);
	$('#mio-update-secure-secret').val(secure_secret);
	$('#mio-update-description').val(description);
	$('#mio-update').modal('show');
});

$('#mio-update-btn').on('click', () => {
	let id = $('#mio-update-id').val();
	let client_id = $('#mio-update-client-id').val();
	let secure_secret = $('#mio-update-secure-secret').val();
	let description = $('#mio-update-description').val();
	$.ajax({
		url: '/mio/' + id,
		method: 'PUT',
		data: { client_id, secure_secret, description },
		success: (response) => {
			return !response.success ? $('#mio-update-form .error').html(response.error) : window.location.href = '/';
		},
		error: (error) => {
			$('#mio-update-form .error').html(error.responseJSON);
		}
	});
});

$('#mio-table tbody tr td .delete-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	$('#mio-delete-id').val(id);
	$('#mio-delete').modal('show');
});

$('#mio-delete-btn').on('click', () => {
	let id = $('#mio-delete-id').val();
	$.ajax({
		url: '/mio/' + id,
		method: 'DELETE',
		success: (response) => {
			window.location.href = '/';
		}
	});
});
