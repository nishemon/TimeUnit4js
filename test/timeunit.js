/*jshint mocha: true */
(function (global) {
	'use strict';
	var TimeUnit = global.TimeUnit || require('../timeunit');
	var assert = global.assert || require('power-assert');
	var moment = global.moment || require('moment');

	var units = [];
	var f;
	for (f in TimeUnit.values) {
		if (TimeUnit.values.hasOwnProperty(f)) {
			units.push(TimeUnit.values[f]);
		}
	}

	describe('TimeUnit Compatible Method', function() {

		it('to(v) === from(v)', function() {
			var i;
			var u;
			for (i = 0; i < units.length; i++) {
				u = units[i];
				assert(u.toMillis(42) === TimeUnit.MILLISECONDS.from(42, u));
				assert(u.toSeconds(42) === TimeUnit.SECONDS.from(42, u));
				assert(u.toMinutes(42) === TimeUnit.MINUTES.from(42, u));
				assert(u.toHours(42) === TimeUnit.HOURS.from(42, u));
				assert(u.toDays(42) === TimeUnit.DAYS.from(42, u));
				assert(u.toWeeks(42) === TimeUnit.WEEKS.from(42, u));
			}
		});

		it('from(to(v)) === v', function() {
			var i;
			var u;
			for (i = 0; i < units.length; i++) {
				u = units[i];
				assert(u.from(u.toMillis(42), TimeUnit.MILLISECONDS) === 42);
			}
		});
	});
	describe('TimeUnit Extend Method', function() {
		it('plus', function() {
			var i;
			var u;
			var now = new Date();
			for (i = 0; i < units.length; i++) {
				u = units[i];
				if (u === TimeUnit.MICROSECONDS) {
					assert(u.plus(now, 42).getTime() === moment(now).add(420, 'milliseconds').toDate().getTime());
				} else {
					assert(u.plus(now, 42).getTime() === moment(now).add(42, u.toString()).toDate().getTime());
				}
			}
		});
		it('minus', function() {
			var i;
			var u;
			var now = new Date();
			for (i = 0; i < units.length; i++) {
				u = units[i];
				if (u === TimeUnit.MICROSECONDS) {
					assert(u.minus(now, 42).getTime() === moment(now).subtract(420, 'milliseconds').toDate().getTime());
				} else {
					assert(u.minus(now, 42).getTime() === moment(now).subtract(42, u.toString()).toDate().getTime());
				}
			}
		});
	});
})((this || 0).self || global);
