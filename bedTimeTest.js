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
    let hour = 0;
    if (colonIndex !== -1) {
      hour = parseInt(time.substring(0, colonIndex), 0);
    }
    if (bedTime.toUpperCase().indexOf('AM') !== -1) {
      console.log('AM');
      bedTimeDate += 1;
      if (hour === 12) {
        hour = 0;
      }
    } else if (bedTime.toUpperCase().indexOf('PM') !== -1) {
      console.log('PM');
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
