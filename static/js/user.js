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
	let videoId = getYoutubeVideoId(url);
	if (!videoId) {
		$('#video-share .error').html('Invalid video URL');
		return;
	}
	$.ajax({
		url: '/video',
		method: 'POST',
		success: (response) => {
			window.location.href = '/';
		},
		error: (error) => {
			$('#video-share .error').html(error.responseJSON.error);
		}
	})
});
