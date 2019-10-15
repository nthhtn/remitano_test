function validateNhanh() {
	let isValid = true;
	$('#nhanh-add-form input').each(function () {
		let value = $(this).val().trim();
		if (!value) {
			isValid = false;
			return;
		}
	});
	return isValid;
};

$('#nhanh-add-form input').on('keyup', (e) => {
	if (e.which === 13) { $('#nhanh-add-btn').trigger('click'); }
});

$('#nhanh-add-btn').on('click', () => {
	let data = {};
	if (!validateNhanh()) { return $('.error').text('Required field(s) missing'); }
	$('.error').text('');
	data = {
		idCallcenter: $('#nhanh-add-idcallcenter').val().trim(),
		apiUsername: $('#nhanh-add-apiusername').val().trim(),
		secretKey: $('#nhanh-add-secretkey').val().trim(),
		storeId: $('#nhanh-add-storeid').val().trim(),
		description: $('#nhanh-add-description').val().trim()
	};
	$.ajax({
		url: '/nhanh',
		method: 'POST',
		data: data,
		success: (response) => {
			return !response.success ? $('#nhanh-add-form .error').html(response.error) : window.location.href = '/';
		},
		error: (error) => {
			$('#nhanh-add-form .error').html(error.responseJSON);
		}
	});
});

$('#nhanh-table tbody tr td .view-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	$.ajax({
		url: '/nhanh/' + id,
		method: 'GET',
		success: (response) => {
			let list = response.success ? response.result : [];
			let element = $('#nhanh-view .list-group');
			$(element).html('');
			list.forEach((item) => {
				let itemElement = $('<li class="list-group-item">' + item.email + '</li>');
				$(element).append(itemElement);
			});
			$('#nhanh-view').modal('show');
		}
	});
});

$('#nhanh-table tbody tr td .update-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	let idCallcenter = $(this).closest('tr').find('td:nth-child(1)').text().trim();
	let apiUsername = $(this).closest('tr').find('td:nth-child(2)').text().trim();
	let secretKey = $(this).closest('tr').find('td:nth-child(3)').text().trim();
	let storeId = $(this).closest('tr').find('td:nth-child(4)').text().trim();
	let description = $(this).closest('tr').find('td:nth-child(5)').text().trim();
	$('#nhanh-update-id').val(id);
	$('#nhanh-update-idcallcenter').val(idCallcenter);
	$('#nhanh-update-apiusername').val(apiUsername);
	$('#nhanh-update-secretkey').val(secretKey);
	$('#nhanh-update-storeid').val(storeId);
	$('#nhanh-update-description').val(description);
	$('#nhanh-update').modal('show');
});

$('#nhanh-update-btn').on('click', () => {
	let id = $('#nhanh-update-id').val();
	let apiUsername = $('#nhanh-update-apiusername').val();
	let secretKey = $('#nhanh-update-secretkey').val();
	let storeId = $('#nhanh-update-storeid').val();
	let description = $('#nhanh-update-description').val();
	$.ajax({
		url: '/nhanh/' + id,
		method: 'PUT',
		data: { apiUsername: apiUsername, secretKey: secretKey, storeId: storeId, description: description },
		success: (response) => {
			return !response.success ? $('#nhanh-update-form .error').html(response.error) : window.location.href = '/';
		},
		error: (error) => {
			$('#nhanh-update-form .error').html(error.responseJSON);
		}
	});
});

$('#nhanh-table tbody tr td .delete-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	$('#nhanh-delete-id').val(id);
	$('#nhanh-delete').modal('show');
});

$('#nhanh-delete-btn').on('click', () => {
	let id = $('#nhanh-delete-id').val();
	$.ajax({
		url: '/nhanh/' + id,
		method: 'DELETE',
		success: (response) => {
			window.location.href = '/';
		}
	});
});
