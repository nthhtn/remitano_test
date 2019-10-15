function validateHubspot() {
	let isValid = true;
	$('#hubspot-add-form input').each(function () {
		let value = $(this).val().trim();
		if (!value) {
			isValid = false;
			return;
		}
	});
	return isValid;
};

$('#hubspot-add-form input').on('keyup', (e) => {
	if (e.which === 13) { $('#hubspot-add-btn').trigger('click'); }
});

$('#hubspot-add-btn').on('click', () => {
	let data = {};
	if (!validateHubspot()) { return $('.error').text('Required field(s) missing'); }
	$('.error').text('');
	data = {
		idCallcenter: $('#hubspot-add-idcallcenter').val().trim(),
		hapikey: $('#hubspot-add-hapikey').val().trim(),
		description: $('#hubspot-add-description').val().trim()
	};
	$.ajax({
		url: '/hubspot',
		method: 'POST',
		data: data,
		success: (response) => {
			return !response.success ? $('#hubspot-add-form .error').html(response.error) : window.location.href = '/';
		},
		error: (error) => {
			$('#hubspot-add-form .error').html(error.responseJSON);
		}
	});
});

$('#hubspot-table tbody tr td .view-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	$.ajax({
		url: '/hubspot/' + id,
		method: 'GET',
		success: (response) => {
			let list = response.success ? response.result : [];
			let element = $('#hubspot-view .list-group');
			$(element).html('');
			list.forEach((item) => {
				let itemElement = $('<li class="list-group-item">' + item.email + '</li>');
				$(element).append(itemElement);
			});
			$('#hubspot-view').modal('show');
		}
	});
});

$('#hubspot-table tbody tr td .update-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	let idCallcenter = $(this).closest('tr').find('td:nth-child(1)').text().trim();
	let hapikey = $(this).closest('tr').find('td:nth-child(2)').text().trim();
	let description = $(this).closest('tr').find('td:nth-child(4)').text().trim();
	$('#hubspot-update-id').val(id);
	$('#hubspot-update-idcallcenter').val(idCallcenter);
	$('#hubspot-update-hapikey').val(hapikey);
	$('#hubspot-update-description').val(description);
	$('#hubspot-update').modal('show');
});

$('#hubspot-update-btn').on('click', () => {
	let id = $('#hubspot-update-id').val();
	let hapikey = $('#hubspot-update-hapikey').val();
	let description = $('#hubspot-update-description').val();
	$.ajax({
		url: '/hubspot/' + id,
		method: 'PUT',
		data: { hapikey: hapikey, description: description },
		success: (response) => {
			return !response.success ? $('#hubspot-update-form .error').html(response.error) : window.location.href = '/';
		},
		error: (error) => {
			$('#hubspot-update-form .error').html(error.responseJSON);
		}
	});
});

$('#hubspot-table tbody tr td .delete-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	$('#hubspot-delete-id').val(id);
	$('#hubspot-delete').modal('show');
});

$('#hubspot-delete-btn').on('click', () => {
	let id = $('#hubspot-delete-id').val();
	$.ajax({
		url: '/hubspot/' + id,
		method: 'DELETE',
		success: (response) => {
			window.location.href = '/';
		}
	});
});
