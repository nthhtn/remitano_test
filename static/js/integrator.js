$('#first-field-add').on('click', function () {
	var fieldForm = $('<div class="form-row field-form"></div>');
	var html = $('.field-form').html();
	fieldForm.html(html);
	var buttonGroup = $('<div class="form-group"></div>');
	var btnAdd = document.createElement('button');
	btnAdd.setAttribute('class', 'btn btn-fab btn-fab-mini btn-success');
	btnAdd.setAttribute('type', 'button');
	btnAdd.innerHTML = '<i class="material-icons">add</i>';
	btnAdd.onclick = function () {
		$('#first-field-add').click();
	};
	buttonGroup.append(btnAdd);
	var btnRemove = document.createElement('button');
	btnRemove.setAttribute('class', 'btn btn-fab btn-fab-mini btn-danger');
	btnRemove.setAttribute('type', 'button');
	btnRemove.innerHTML = '<i class="material-icons">remove</i>';
	btnRemove.onclick = function () {
		fieldForm.remove();
		buttonGroup.remove();
	};
	buttonGroup.append(btnRemove);
	$('#integrator-add-form').append(fieldForm);
	$('#integrator-add-form').append(buttonGroup);
});

function validateAddingIntegrator() {
	let isValid = true;
	$('#integrator-add-form input').each(function () {
		let value = $(this).val().trim();
		if (!value) {
			isValid = false;
			return;
		}
	});
	return isValid;
};

function validateUpdatingIntegrator() {
	let isValid = true;
	$('#integrator-update-form input').each(function () {
		let value = $(this).val().trim();
		if (!value) {
			isValid = false;
			return;
		}
	});
	return isValid;
};

$('#integrator-add-form input').on('keyup', (e) => {
	if (e.which === 13) { $('#integrator-add-btn').trigger('click'); }
});

$('#integrator-add-btn').on('click', () => {
	let data = {};
	if (!validateAddingIntegrator()) { return $('.error').text('Required field(s) missing'); }
	$('.error').text('');
	let fields = null;
	$('#integrator-add-form .field-form').each(function () {
		let name = $(this).find('.field-name').val().trim();
		let value = $(this).find('.field-value').val().trim();
		if (name) {
			if (!fields) { fields = {}; }
			fields[name] = value;
		}
	});
	data = {
		idCallcenter: $('#integrator-add-idcallcenter').val().trim(),
		integrator: $('#integrator-add-integrator').val().trim().toLowerCase(),
		host: $('#integrator-add-host').val().trim().toLowerCase(),
		description: $('#integrator-add-description').val().trim(),
		fields: fields
	};
	$.ajax({
		url: '/integrator',
		method: 'POST',
		data: data,
		success: (response) => {
			return !response.success ? $('#integrator-add-form .error').html(response.error) : window.location.href = '/';
		},
		error: (error) => {
			$('#integrator-add-form .error').html(error.responseJSON);
		}
	});
});

$('#second-field-add').on('click', function () {
	var fieldForm = $('<div class="form-row field-form"></div>');
	var html = $('.field-form').html();
	fieldForm.html(html);
	var buttonGroup = $('<div class="form-group"></div>');
	var btnAdd = document.createElement('button');
	btnAdd.setAttribute('class', 'btn btn-fab btn-fab-mini btn-success');
	btnAdd.setAttribute('type', 'button');
	btnAdd.innerHTML = '<i class="material-icons">add</i>';
	btnAdd.onclick = function () {
		$('#second-field-add').click();
	};
	buttonGroup.append(btnAdd);
	var btnRemove = document.createElement('button');
	btnRemove.setAttribute('class', 'btn btn-fab btn-fab-mini btn-danger');
	btnRemove.setAttribute('type', 'button');
	btnRemove.innerHTML = '<i class="material-icons">remove</i>';
	btnRemove.onclick = function () {
		fieldForm.remove();
		buttonGroup.remove();
	};
	buttonGroup.append(btnRemove);
	$('#integrator-update-form').append(fieldForm);
	$('#integrator-update-form').append(buttonGroup);
});

$('#integrator-table tbody tr td .update-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	let idCallcenter = $(this).closest('tr').find('td:nth-child(1)').text().trim();
	let integrator = $(this).closest('tr').find('td:nth-child(2)').text().trim();
	let host = $(this).closest('tr').find('td:nth-child(3)').text().trim();
	let description = $(this).closest('tr').find('td:nth-child(4)').text().trim();
	$('#integrator-update-id').val(id);
	$('#integrator-update-idcallcenter').val(idCallcenter);
	$('#integrator-update-integrator').val(integrator);
	$('#integrator-update-host').val(host);
	$('#integrator-update-description').val(description);
	let fieldtext = $(this).closest('tr').find('td:nth-child(5)').text().trim().split('\n');
	let fields = {};
	$('#integrator-update-form .field-form').remove();
	$('#integrator-update-form .form-group button').not('#second-field-add').closest('.form-group').remove();
	$('#second-field-add').closest('.form-group').before('<div class="form-row field-form">'
		+ '<div class="form-group col-md-6"><label>Field name</label><input type="text" class="form-control field-name"></div>'
		+ '<div class="form-group col-md-6"><label>Field value</label><input type="text" class="form-control field-value"></div></div>');
	fieldtext.forEach(function (line) {
		let arr = line.split(':');
		if (arr.length === 2) { fields[arr[0].trim()] = arr[1].trim(); }
	});
	for (let i = 0; i < Object.keys(fields).length; i++) {
		let key = Object.keys(fields)[i];
		if (i < Object.keys(fields).length - 1) {
			$('#second-field-add').trigger('click');
		}
		let nameElement = $('#integrator-update .field-name').get(i);
		let valueElement = $('#integrator-update .field-value').get(i);
		$(nameElement).val(key);
		$(valueElement).val(fields[key]);
	}
	$('#integrator-update').modal('show');
});

$('#integrator-update-btn').on('click', () => {
	let id = $('#integrator-update-id').val();
	let data = {};
	if (!validateUpdatingIntegrator()) { return $('.error').text('Required field(s) missing'); }
	$('.error').text('');
	let fields = null;
	$('#integrator-update-form .field-form').each(function () {
		let name = $(this).find('.field-name').val().trim();
		let value = $(this).find('.field-value').val().trim();
		if (name) {
			if (!fields) { fields = {}; }
			fields[name] = value;
		}
	});
	data = {
		idCallcenter: $('#integrator-update-idcallcenter').val().trim(),
		integrator: $('#integrator-update-integrator').val().trim().toLowerCase(),
		host: $('#integrator-update-host').val().trim().toLowerCase(),
		description: $('#integrator-update-description').val().trim(),
		fields: fields
	};
	$.ajax({
		url: '/integrator/' + id,
		method: 'PUT',
		data: data,
		success: (response) => {
			return !response.success ? $('#integrator-update-form .error').html(response.error) : window.location.href = '/';
		},
		error: (error) => {
			$('#integrator-update-form .error').html(error.responseJSON);
		}
	});
});

$('#integrator-table tbody tr td .delete-btn').on('click', function () {
	let id = $(this).closest('tr').attr('id');
	$('#integrator-delete-id').val(id);
	$('#integrator-delete').modal('show');
});

$('#integrator-delete-btn').on('click', () => {
	let id = $('#integrator-delete-id').val();
	$.ajax({
		url: '/integrator/' + id,
		method: 'DELETE',
		success: (response) => {
			window.location.href = '/';
		}
	});
});
