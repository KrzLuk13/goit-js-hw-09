import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix';

const startBtn = document.querySelector('button[data-start]');
const days = document.querySelector('span[data-days]');
const hours = document.querySelector('span[data-hours]');
const minutes = document.querySelector('span[data-minutes]');
const seconds = document.querySelector('span[data-seconds]');

let date = new Date();
let selectedDate;

const button = document.querySelector('button');
button.disabled = true;

const flatpickrInput = document.getElementById('datetime-picker');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < date) {
      button.disabled = true;
      Notify.warning(`Please choose a date in the future`);
      return;
    } else if (selectedDates[0] > date) {
      button.disabled = false;
      console.log(selectedDates[0]);
      selectedDate = selectedDates[0].getTime();
      console.log(convertMs(selectedDate));
    }
  },
};

const calendar = flatpickr(flatpickrInput, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZero(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );
  return { days, hours, minutes, seconds };
}

function startTimer() {
  startBtn.disabled = true;
  Notify.success('The countdown has started!');
  const timer = setInterval(() => {
    let endTimer = selectedDate - Date.now();
    const countdown = convertMs(endTimer);
    if (endTimer <= 0) {
      Notify.success('The countdown is over!');
      clearInterval(timer);
    } else {
      updateTimer(countdown);
    }
  }, 1000);
}

function updateTimer(countdown) {
  days.textContent = countdown.days + ':';
  hours.textContent = countdown.hours + ':';
  minutes.textContent = countdown.minutes + ':';
  seconds.textContent = countdown.seconds;
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

startBtn.addEventListener('click', startTimer);
