# TimeUnit4js

TimeUnit4js is "another" porting of Java TimeUnit that is based on [JSR-166](http://gee.cs.oswego.edu/dl/concurrency-interest/index.html).

If you want Java TimeUnit in JavaScript, you should use [TimeUnit js](https://github.com/jwalton/timeunitjs/).
It has more compatibility with Java TimeUnit and is stable.

TimeUnit4js is under development.

# Basic
    var msec = TimeUnit.HOURS.toMillis(3);
    // msec === 3 * 60 * 60 * 1000
    var msec2 = TimeUnit.MILLISECONDS.from(3, TimeUnit.HOURS);
    // msec2 === 3 * 60 * 60 * 1000

There are MILLISECONDS(toMillis), SECONDS(toSeconds), MINUTES(toMinutes), HOURS(toHours), 
DAYS(toDays) and WEEKS(toWeeks).

Unlike original, TimeUnit.NANOSECONDS, TimeUnit.MICROSECONDS, "toMicros" and "toNanos" are not implemented.
I have never used and seen, yet.

# Extend
setTimeout and setInterval with TimeUnit

    TimeUnit.MINUTE.setTimeout(10, function() {
        console.log('after 10 minutes');
    }

Manipulate Date

    var dayAfterTommorow = TimeUnit.HOUR.plus(new Date, 48);
