



const loader = require('./oneloader');





function renderEntity(data) {

	let html = `<section class="g-card entity"><h3>关注的人还看了</h3><ul>`;

	for (let i = 0, len = Math.floor(data.length / 3) * 3; i < len; i++) {
		html += `<li><a href="/ns?q=nba&src=entity" data-index="">${data[i]}</a></li>`;
	}
	html += '</ul></section>';

	return html;
}

function entityCallback($wrap, $pos, result) {
	let html = renderEntity(result);
	console.log(html);
    $('.rightArea').append(html);
}

function entity($wrap, $pos, result) {

    entityCallback($wrap, $pos, result)
	
}







module.exports = {
	load: function($ele, $list) {
        loader.loadNews(function(items, data) {
        	console.log(items);
            console.log(data);
            entity($ele, $list, data);
        });
	},
}
