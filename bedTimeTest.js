#!/usr/bin/env node

const data = require('./json/data.json');

const currentTime = new Date();
let localUTC;
if (data.optional.timezoneCity) {
  localUTC = new Date(
    currentTime.toLocaleString('en-US', {
      timeZone: data.optional.timezoneCity,
    }),
  );
} else {
  localUTC = new Date(
    currentTime.getUTCFullYear(),
    currentTime.getUTCMonth(),
    currentTime.getUTCDate(),
    currentTime.getUTCHours() + data.optional.timezoneUTC,
    currentTime.getUTCMinutes(),
    currentTime.getUTCSeconds(),
    currentTime.getUTCMilliseconds(),
  );
}

function getBedTime(givenDate) {
  const bedTime = data.optional.localBedTime;
  let bedTimeHour = 0;
  let bedTimeMinute = 0;
  let bedTimeDate = givenDate.getDate();
  let colonIndex = -1;
  colonIndex = bedTime.indexOf(':');

  function getHour(time) {
    let hour = -1;
    if (colonIndex !== -1) {
      hour = parseInt(time.substring(0, colonIndex), 0);
    }
    if (
      bedTime.toUpperCase().indexOf('AM') !== -1 ||
      (hour < 12 && hour >= 0)
    ) {
      console.log('AM');
      bedTimeDate += 1;
      if (colonIndex === -1) {
        const amIndex = bedTime.toUpperCase().indexOf('AM');
        hour = parseInt(time.substring(0, amIndex), 0);
        if (hour > 12) {
          console.log('Incorrect bedtime format. Defaulting bedtime to 12AM.');
          hour = 0;
        }
      }
      if (hour === 12) {
        hour = 0;
      }
    } else if (bedTime.toUpperCase().indexOf('PM') !== -1 || hour >= 12) {
      console.log('PM');
      if (colonIndex === -1) {
        const pmIndex = bedTime.toUpperCase().indexOf('PM');
        hour = parseInt(time.substring(0, pmIndex), 0);
        hour -= 12;
      }
      if (hour !== 12) {
        hour += 12;
      }
    } else {
      console.log('Incorrect bedtime format. Defaulting bedtime to 12AM.');
      bedTimeDate += 1;
      hour = 0;
    }
    return hour;
  }
  function getMinute(time) {
    let minute = 0;
    if (colonIndex !== -1) {
      minute = parseInt(time.substring(colonIndex + 1, 5), 0);
    }
    return minute;
  }
  bedTimeHour = getHour(bedTime);
  bedTimeMinute = getMinute(bedTime);
  return new Date(
    givenDate.getFullYear(),
    givenDate.getMonth(),
    bedTimeDate,
    bedTimeHour,
    bedTimeMinute,
    0,
  );
}

const bedTimeDate = getBedTime(localUTC);
console.log(`bedTimeDate: ${bedTimeDate}`);

const timeDiff = bedTimeDate - localUTC;
if (timeDiff > 0) {
  const timeDiffHours = Math.floor(timeDiff / (1000 * 60 * 60)) % 24;
  const timeDiffMinutes = Math.floor(timeDiff / (1000 * 60)) % 60;
  console.log(
    `Day 0: ${timeDiffHours} hours and ${timeDiffMinutes} minutes left.`,
  );
} else {
  console.log("It's past your bedtime, nothing left to do today.");
}
