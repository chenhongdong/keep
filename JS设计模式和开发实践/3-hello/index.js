require('./styles/common.less');

let oneloader = require('./oneloader');
let entity = require('./entity');

let $ele = '<section><div class="g-card r-list"></div></section>';




entity.load($ele, $('.rightArea'));
