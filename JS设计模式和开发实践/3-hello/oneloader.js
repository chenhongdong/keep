let loading = false,
	ajaxUrl = '';
	


function loadNews(callback, beforeSend) {
	if (!loading) {
		loading = true;
		$.ajax({
			beforeSend,
			url: `../data.json`,
			dataType: 'json',
			error: () => {
				loading = false;
			},
			success: function(res) {
				loading = false;
				callback(res.items, res.data);
			}
		});
	}
}






module.exports = {
	loadNews
};