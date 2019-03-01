$(document).ready(function() {

let minutes     = 25,
    seconds     = 0,
    shortBreak  = 5,
    longBreak   = 15,
    periodBreak = 4,
    interval    = undefined;

$('.minutes').html = 

$('.start').on('click', timerStart);

function timerStart() {
    $('.minutes').html(minutes);
    $('.seconds').html(seconds);
    if (seconds <= 10) {
        $('.seconds').html(`0${seconds}`);
    }
    interval = setInterval(() => {
        if (minutes === 0 && seconds === 0) {
            interval = clearInterval();
        }

        if (seconds === 0) {
            minutes--;
            $('.minutes').html(minutes);
            $('.seconds').html('00');
            seconds = 60;
        }

        if (seconds <= 10) {
            seconds--;
            $('.seconds').html(`0${seconds}`);
        }

        if (seconds !== 0 && seconds > 10) {
            seconds--;
            $('.seconds').html(seconds);
        }
    }, 1000);
}
})