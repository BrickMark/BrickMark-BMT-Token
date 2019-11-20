
ONE_DAY_IN_SECONDS = 86400;
unixTimeNow = function () {
    return Math.trunc(new Date().getTime() / 1000);
}
unixTimeInDays = function(days) {
    return unixTimeNow() + (days * ONE_DAY_IN_SECONDS);
}

unixTimeTomorrow = function() {
    return unixTimeInDays(1);
}

module.exports = {
    ONE_DAY_IN_SECONDS,
    unixTimeNow,
    unixTimeInDays,
    unixTimeTomorrow
  }