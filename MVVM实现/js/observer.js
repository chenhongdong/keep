function Observer(data) {
	this.data = data;
	this.walk(data);
}

Observer.prototype = {
	walk: function(data) {
		var self = this;
		Object.keys(data).forEach(function(key) {
			self.defineReactive(data, key, data[key]);
		});
	},
	defineReactive: function(data, key, val) {
		var dep = new Dep();
		
		Object.defineProperty(data, key, {
			enumerable: true,
			configurable: true,
			get: function getter() {
				if (Dep.target) {
					dep.addSub(Dep.target);
				}
				return val;
			},
			set: function setter(newVal) {
				if (newVal === val) {
					return;
				}
				val = newVal;
				dep.notify();
			}
		});
	}
};

function observe(val, vm) {
	if (!val || typeof val !== 'object') {
		return;
	}
	return new Observer(val);
}

function Dep() {
	this.subs = [];
}
Dep.prototype = {
	addSub: function(sub) {
		this.subs.push(sub);
	},
	notify: function() {
		this.subs.forEach(function(sub) {
			sub.update();
		});
	}
};
Dep.target = null;