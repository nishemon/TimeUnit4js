(function(global) {
	'use strict';
	if (global.TimeUnit) {
		return;
	}

	/**
	 *
	 * @param {number} factor
	 * @constructor
	 */
	var TimeUnit = function(factor) {
		this._f = factor;
	};

	/**
	 *
	 * @param factor
	 * @return {TimeUnit}
	 * @static
	 */
	TimeUnit.factor = function(factor) {
		var v;
		TimeUnit.values = TimeUnit.values || {};
		v = TimeUnit.values[factor];
		if (!v) {
			v = TimeUnit.values[factor] = new TimeUnit(factor);
		}
		return v;
	};

	// NANOSECONDS
	/**
	 * @const
	 * @type {TimeUnit}
	 */
	TimeUnit.MILLISECONDS = TimeUnit.factor(1);
	/**
	 * @const
	 * @type {TimeUnit}
	 */
//	TimeUnit.MICROSECONDS = TimeUnit.factor(10);

	/** to minify */
	var F = 1000;
	/**
	 * @const
	 * @type {TimeUnit}
	 */
	TimeUnit.SECONDS = TimeUnit.factor(F);
	/**
	 * @const
	 * @type {TimeUnit}
	 */
	TimeUnit.MINUTES = TimeUnit.factor(F *= 60);
	/**
	 * @const
	 * @type {TimeUnit}
	 */
	TimeUnit.HOURS = TimeUnit.factor(F *= 60);
	/**
	 * @const
	 * @type {TimeUnit}
	 */
	TimeUnit.DAYS = TimeUnit.factor(F *= 24);
	/**
	 * @const
	 * @type {TimeUnit}
	 */
	TimeUnit.WEEKS = TimeUnit.factor(F * 7);

	/** hack to minify */
	var TimeUnitPrototype = TimeUnit.prototype; // jshint ignore:line
	TimeUnit.prototype.toString = function() {
		var name;
		for (name in TimeUnit) {
			if (TimeUnit.hasOwnProperty(name)) {
				if (TimeUnit[name]._f === this._f) {
					return name;
				}
			}
		}
		return 'TimeUnit.factor(' + this._f + ')';
	};

	/**
	 *
	 * @param {number} value
	 * @param {TimeUnit} unit
	 * @return {number}
	 */
	TimeUnit.prototype.from = function(value, unit) {
		return value * unit._f / this._f;
	};

	/**
	 * @param value
	 * @return {number}
	 */
	TimeUnit.prototype.toMillis = function(value) {
		return TimeUnit.MILLISECONDS.from(value, this);
	};

/*
	TimeUnit.prototype.toMicros = function(value) {
		return TimeUnit.MICROSECONDS.from(value, this);
	};
*/

	/**
	 *
	 * @param value
	 * @return {number}
	 */
	TimeUnit.prototype.toSeconds = function(value) {
		return TimeUnit.SECONDS.from(value, this);
	};
	/**
	 *
	 * @param value
	 * @return {number}
	 */
	TimeUnit.prototype.toMinutes = function(value) {
		return TimeUnit.MINUTES.from(value, this);
	};
	/**
	 *
	 * @param value
	 * @return {number}
	 */
	TimeUnit.prototype.toHours = function(value) {
		return TimeUnit.HOURS.from(value, this);
	};
	/**
	 *
	 * @param value
	 * @return {number}
	 */
	TimeUnit.prototype.toDays = function(value) {
		return TimeUnit.DAYS.from(value, this);
	};
	/**
	 *
	 * @param value
	 * @return {number}
	 */
	TimeUnit.prototype.toWeeks = function(value) {
		return TimeUnit.WEEKS.from(value, this);
	};

	/**
	 *
	 * @param {Date} base
	 * @param {number} value
	 * @return {Date}
	 */
	TimeUnit.prototype.plus = function(base, value) {
		return new Date(base.getTime() + this.toMillis(value));
	};

	/**
	 *
	 * @param {Date} base
	 * @param {number} value
	 * @return {Date}
	 */
	TimeUnit.prototype.minus = function(base, value) {
		return new Date(base.getTime() - this.toMillis(value));
	};

	/**
	 * return timezone offset in this unit.
	 * @param {Date} date
	 * @return {number}
	 */
	TimeUnit.prototype.getTimezoneOffset = function(date) {
		return this.from(date.getTimezoneOffset(), TimeUnit.MINUTES);
	};

	/**
	 *
	 * @param {Date} base
	 * @param {number=} opt_value
	 * @return {Date}
	 */
	TimeUnit.prototype.adjustBack = function(base, opt_value) {
		var v = opt_value || 1;
		var tz = base.getTimezoneOffset() * 60 * 1000;
		var n = base.getTime() - tz;
		return new Date(n - n % this.toMillis(v) + tz);
	};

	/**
	 *
	 * @param {Date} base
	 * @param {number=} opt_value
	 * @return {Date}
	 */
	TimeUnit.prototype.ajdustAdvance = function(base, opt_value) {
		var v = opt_value || 1;
		var tz = base.getTimezoneOffset() * 60 * 1000;
		var n = base.getTime() + this._f - 1 - tz;
		return new Date(n - n % this.toMillis(v) + tz);
	};

	/**
	 *
	 * @param {Date} base
	 * @param {number=} opt_value
	 * @return {Date}
	 */
	TimeUnit.prototype.adjustBackUTC = function(base, opt_value) {
		var v = opt_value || 1;
		var n = base.getTime();
		return new Date(n - n % this.toMillis(v));
	};

	/**
	 *
	 * @param {Date} base
	 * @param {number=} opt_value
	 * @return {Date}
	 */
	TimeUnit.prototype.adjustAdvanceUTC = function(base, opt_value) {
		var v = opt_value || 1;
		var n = base.getTime() + this._f - 1;
		return new Date(n - n % this.toMillis(v));
	};

	/**
	 *
	 * @param {number} value
	 * @param {function|string=} opt_callback
	 * @return {number|Promise}
	 */
	TimeUnit.prototype.setTimeout = function(value, opt_callback) {
		var self = this;
		if (opt_callback) {
			return setTimeout(opt_callback, this.toMillis(value));
		}
		return global.Promise && new Promise(function (r) {
			setTimeout(r, self.toMillis(value));
		});
	};

	/**
	 *
	 * @param {number} value
	 * @param {function|string} callback
	 * @return {number}
	 */
	TimeUnit.prototype.setInterval = function(value, callback) {
		return setInterval(callback, this.toMillis(value));
	};

	/**
	 *
	 * @param {Date} a
	 * @param {Date} b
	 */
	TimeUnit.prototype.betweenAtLeast = function(a, b) {
		return this.from(b.getTime() - a.getTime(), TimeUnit.MILLISECONDS);
	};
	/**
	 *
	 * @param {Date} a
	 * @param {Date} b
	 */
	TimeUnit.prototype.betweenAtMost = function(a, b) {
		return this.from(b.getTime() - a.getTime() + this._f - 1, TimeUnit.MILLISECONDS);
	};

	if (typeof module === 'object') {
		module.exports = TimeUnit;
	}
	global.TimeUnit = TimeUnit;
})((this || 0).self || global);
