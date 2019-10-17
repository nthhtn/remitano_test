$('#logout-btn').on('click', () => {
	$.ajax({
		url: '/logout',
		method: 'POST',
		success: (response) => {
			window.location.href = '/';
		}
	});
});

function getYoutubeVideoId(url) {
	if (!url) { return null; }
	let pattern = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
	let match = url.match(pattern);
	if (match && match[2].length == 11) {
		return match[2];
	}
	return null;
}

$('#video-share-btn').on('click', () => {
	let url = $('#video-share-url').val();
	let youtubeId = getYoutubeVideoId(url);
	if (!youtubeId) {
		$('#video-share .error').html('Invalid video URL');
		return;
	}
	$.ajax({
		url: '/video',
		method: 'POST',
		data: { url: url, youtubeId: youtubeId },
		success: (response) => {
			window.location.href = '/';
		},
		error: (error) => {
			$('#video-share .error').html(error.responseJSON.error);
		}
	})
});

$('.video-vote button').on('click', function () {
	let selfElement = $(this);
	let activeElement = $(this).closest('.video-vote').find('button.active');
	let value = $(this).hasClass('active') ? 'none' : $(this).attr('vote-value');
	let videoId = $(this).closest('.video-item').attr('video-id');
	$.ajax({
		url: '/vote',
		method: 'POST',
		data: { videoId: videoId, value: value },
		success: (response) => {
			value === 'none' ? $(selfElement).removeClass('active') : $(selfElement).addClass('active');
		}
	})
});
