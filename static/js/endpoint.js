$('#first-param-add').on('click', function () {
	var paramForm = $('<div class="form-row param-form"></div>');
	var html = $('.param-form').html();
	paramForm.html(html);
	var buttonGroup = $('<div class="form-group"></div>');
	var btnAdd = document.createElement('button');
	btnAdd.setAttribute('class', 'btn btn-fab btn-fab-mini btn-success');
	btnAdd.setAttribute('type', 'button');
	btnAdd.innerHTML = '<i class="material-icons">add</i>';
	btnAdd.onclick = function () {
		$('#first-param-add').click();
	};
	buttonGroup.append(btnAdd);
	var btnRemove = document.createElement('button');
	btnRemove.setAttribute('class', 'btn btn-fab btn-fab-mini btn-danger');
	btnRemove.setAttribute('type', 'button');
	btnRemove.innerHTML = '<i class="material-icons">remove</i>';
	btnRemove.onclick = function () {
		paramForm.remove();
		buttonGroup.remove();
	};
	buttonGroup.append(btnRemove);
	$('#endpoint-add-form').append(paramForm);
	$('#endpoint-add-form').append(buttonGroup);
});

function validateAddingEndpoint() {
	let isValid = true;
	$('#endpoint-add-form input').each(function () {
		let value = $(this).val().trim();
		if (!value && !$(this).hasClass('param-name')) {
			isValid = false;
			return;
		}
	});
	return isValid;
};

function validateUpdatingEndpoint() {
	let isValid = true;
	$('#endpoint-update-form input').each(function () {
		let value = $(this).val().trim();
		if (!value) {
			isValid = false;
			return;
		}
	});
	return isValid;
};

$('#endpoint-add-form input').on('keyup', (e) => {
	if (e.which === 13) { $('#endpoint-add-btn').trigger('click'); }
});

$('#endpoint-add-btn').on('click', () => {
	let data = {};
	if (!validateAddingEndpoint()) { return $('.error').text('Required field(s) missing'); }
	$('.error').text('');
	let parameters = null;
	$('#endpoint-add-form .param-form').each(function () {
		let name = $(this).find('.param-name').val().trim();
		let location = $(this).find('.param-location').val().trim();
		if (name) {
			if (!parameters) { parameters = {}; }
			parameters[name] = location;
		}
	});
	data = {
		name: $('#endpoint-add-name').val().trim().toLowerCase(),
		integrator: $('#endpoint-add-integrator').val().trim().toLowerCase(),
		description: $('#endpoint-add-description').val().trim(),
		url: $('#endpoint-add-url').val().trim(),
		method: $('#endpoint-add-method').val().trim(),
		parameters: parameters
	};
	$.ajax({
		url: '/endpoint',
		method: 'POST',
		data: data,
		success: (response) => {
			return !response.success ? $('#endpoint-add-form .error').html(response.error) : window.location.href = '/';
		},
		error: (error) => {
			$('#endpoint-add-form .error').html(error.responseJSON);
		}
	});
});

$('#second-param-add').on('click', function () {
	var paramForm = $('<div class="form-row param-form"></div>');
	var html = $('.param-form').html();
	paramForm.html(html);
	var buttonGroup = $('<div class="form-group"></div>');
	var btnAdd = document.createElement('button');
	btnAdd.setAttribute('class', 'btn btn-fab btn-fab-mini btn-success');
	btnAdd.setAttribute('type', 'button');
	btnAdd.innerHTML = '<i class="material-icons">add</i>';
	btnAdd.onclick = function () {
		$('#second-param-add').click();
	};
	buttonGroup.append(btnAdd);
	var btnRemove = document.createElement('button');
	btnRemove.setAttribute('class', 'btn btn-fab btn-fab-mini btn-danger');
	btnRemove.setAttribute('type', 'button');
	btnRemove.innerHTML = '<i class="material-icons">remove</i>';
	btnRemove.onclick = function () {
		paramForm.remove();
		buttonGroup.remove();
	};
	buttonGroup.append(btnRemove);
	$('#endpoint-update-form').append(paramForm);
	$('#endpoint-update-form').append(buttonGroup);
});

$('#endpoint-table tbody tr td .update-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	let name = $(this).closest('tr').find('td:nth-child(1)').text().trim();
	let integrator = $(this).closest('tr').find('td:nth-child(2)').text().trim();
	let description = $(this).closest('tr').find('td:nth-child(3)').text().trim();
	let url = $(this).closest('tr').find('td:nth-child(4)').text().trim();
	let method = $(this).closest('tr').find('td:nth-child(5)').text().trim();
	$('#endpoint-update-id').val(id);
	$('#endpoint-update-name').val(name);
	$('#endpoint-update-integrator').val(integrator);
	$('#endpoint-update-description').val(description);
	$('#endpoint-update-url').val(url);
	$('#endpoint-update-method').val(method);
	let paratext = $(this).closest('tr').find('td:nth-child(6)').text().trim().split('\n');
	let parameters = {};
	$('#endpoint-update-form .param-form').remove();
	$('#endpoint-update-form .form-group button').not('#second-param-add').closest('.form-group').remove();
	$('#second-param-add').closest('.form-group').before('<div class="form-row param-form">'
		+ '<div class="form-group col-md-6"><label>Parameter name</label><input type="text" class="form-control param-name"></div>'
		+ '<div class="form-group col-md-6"><label>Parameter location</label><select class="form-control param-location">'
		+ '<option selected value="query">Query</option><option value="body">Body</option><option value="header">Header</option>'
		+ '<option value="path">Path</option></select></div></div>');
	paratext.forEach(function (line) {
		let arr = line.split(' : ');
		if (arr.length === 2) { parameters[arr[0].trim()] = arr[1].trim(); }
	});
	for (let i = 0; i < Object.keys(parameters).length; i++) {
		let key = Object.keys(parameters)[i];
		if (i < Object.keys(parameters).length - 1) {
			$('#second-param-add').trigger('click');
		}
		let nameElement = $('#endpoint-update .param-name').get(i);
		let locationElement = $('#endpoint-update .param-location').get(i);
		$(nameElement).val(key);
		$(locationElement).val(parameters[key]);
	}
	$('#endpoint-update').modal('show');
});

$('#endpoint-update-btn').on('click', () => {
	let id = $('#endpoint-update-id').val();
	let data = {};
	if (!validateUpdatingEndpoint()) { return $('.error').text('Required field(s) missing'); }
	$('.error').text('');
	let parameters = null;
	$('#endpoint-update-form .param-form').each(function () {
		let name = $(this).find('.param-name').val().trim();
		let location = $(this).find('.param-location').val().trim();
		if (name) {
			if (!parameters) { parameters = {}; }
			parameters[name] = location;
		}
	});
	data = {
		name: $('#endpoint-update-name').val().trim().toLowerCase(),
		integrator: $('#endpoint-update-integrator').val().trim().toLowerCase(),
		description: $('#endpoint-update-description').val().trim(),
		url: $('#endpoint-update-url').val().trim(),
		method: $('#endpoint-update-method').val().trim(),
		parameters: parameters
	};
	$.ajax({
		url: '/endpoint/' + id,
		method: 'PUT',
		data: data,
		success: (response) => {
			return !response.success ? $('#endpoint-update-form .error').html(response.error) : window.location.href = '/';
		},
		error: (error) => {
			$('#endpoint-update-form .error').html(error.responseJSON);
		}
	});
});

$('#endpoint-table tbody tr td .delete-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	$('#endpoint-delete-id').val(id);
	$('#endpoint-delete').modal('show');
});

$('#endpoint-delete-btn').on('click', () => {
	let id = $('#endpoint-delete-id').val();
	$.ajax({
		url: '/endpoint/' + id,
		method: 'DELETE',
		success: (response) => {
			window.location.href = '/';
		}
	});
});
