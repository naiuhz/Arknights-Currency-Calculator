#!/usr/bin/env node

const data = require('./json/data.json');

const { sanityCap } = data.optional;
const income = require('./json/currency_income.json');
const constants = require('./json/constants.json');

const skData = constants.map[`SK-${data.optional.highestAutoSK}`];
const timeFormat = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
};
const dateFormat = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
const furniturePartGoalDate = new Date(
  new Date(data.furniture.goalDate).setHours(4),
); // data.furniture.goalDate
const currentTime = new Date();
const UTCMinus7 = new Date(
  currentTime.getUTCFullYear(),
  currentTime.getUTCMonth(),
  currentTime.getUTCDate(),
  currentTime.getUTCHours() - 7,
  currentTime.getUTCMinutes(),
  currentTime.getUTCSeconds(),
  currentTime.getUTCMilliseconds(),
);
const UTCMinus7ResetHour = 4;
let localUTC;
if (data.optional.timezoneCity) {
  localUTC = new Date(
    currentTime.toLocaleString('en-US', {
      timeZone: data.optional.timezoneCity,
    }),
  ); // Default
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
const localOffset = Math.floor((UTCMinus7 - localUTC) / (1000 * 60 * 60));
let localNextDayReset = localUTC;
if (UTCMinus7.getHours() < UTCMinus7ResetHour - localOffset) {
  localNextDayReset = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate(),
    UTCMinus7ResetHour - localOffset,
    0,
    0,
    0,
  );
} else {
  localNextDayReset = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate() + 1,
    UTCMinus7ResetHour - localOffset,
    0,
    0,
    0,
  );
}
const localFurniturePartGoalDate = new Date(
  furniturePartGoalDate.setHours(UTCMinus7ResetHour - localOffset),
);
const timeDiff = furniturePartGoalDate - localUTC;
const timeDiffDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
const timeDiffHours = Math.floor(timeDiff / (1000 * 60 * 60)) % 24;
const timeDiffMinutes = Math.floor(timeDiff / (1000 * 60)) % 60;
let weeks = 0;

// printLocalTime
// Prints local time
function printLocalTime() {
  console.log(`UTC-7: ${UTCMinus7.toLocaleDateString('en-US', timeFormat)}`);
  if (data.optional.timezoneCity) {
    // "America/Vancouver"
    console.log(
      `${data.optional.timezoneCity} local time: ${new Date(
        localUTC,
      ).toLocaleDateString('en-US', timeFormat)}`,
    );
  } else if (data.optional.timezoneUTC !== -7) {
    let UTCMessage = 'UTC';
    if (data.optional.timezoneUTC >= 0) {
      UTCMessage += '+';
    }
    UTCMessage += `${data.optional.timezoneUTC}: ${localUTC.toLocaleDateString(
      'en-US',
      timeFormat,
    )}`;
    console.log(UTCMessage);
  }
}

// calculateDaysAndWeeks
// Calculates number of days and weeks between today and date of goal
function calculateDaysAndWeeks() {
  let UTCMinus7Weekday;
  let furniturePartGoalWeekday;
  UTCMinus7Weekday = UTCMinus7.getDay();
  furniturePartGoalWeekday = furniturePartGoalDate.getDay();

  if (UTCMinus7.getHours < 4) {
    UTCMinus7Weekday = UTCMinus7.getDay() - 1;
  }
  // furniturePartGoalDate is always at 4AM so you don't have to check if the hour is earlier than 4AM
  if (UTCMinus7Weekday === 0) {
    UTCMinus7Weekday = 7;
  }
  if (furniturePartGoalWeekday === 0) {
    furniturePartGoalWeekday = 7;
  }
  if (furniturePartGoalWeekday > UTCMinus7Weekday) {
    weeks = Math.floor(timeDiffDays / 7);
  }
  if (furniturePartGoalWeekday <= UTCMinus7Weekday) {
    weeks = Math.ceil(timeDiffDays / 7);
  }
  printLocalTime();

  // console.log("You have " + timeDiffDays + " days, " + timeDiffHours +" hours and " + timeDiffMinutes + " minutes to reach your goal. That's a total of " + timeDiffDays + " days and " + weeks + " weeks.")
}

// calculateIncome
// Calculates relevant daily, weekly and monthly sign-in rewards
function calculateIncome() {
  let monthlySignInFurniturePartIncome = 0;
  let monthlySignInFurniturePartCalculation = '';
  let iDay;
  if (data.optional.signInRewardDay) {
    iDay = data.optional.signInRewardDay;
  } else {
    iDay = localNextDayReset.getDate();
  }

  for (; iDay < furniturePartGoalDate.getDate(); iDay += 1) {
    if (iDay in income.monthly) {
      const signInReward = income.monthly[iDay].split(' ');
      const rewardQuantity = signInReward[0];
      const rewardType = signInReward[1];
      if (rewardType === 'FURNITURE_PARTS') {
        monthlySignInFurniturePartCalculation += `${rewardQuantity}+`;
        monthlySignInFurniturePartIncome += parseInt(rewardQuantity, 10);
      }
    }
  }
  monthlySignInFurniturePartCalculation = monthlySignInFurniturePartCalculation.substring(
    0,
    monthlySignInFurniturePartCalculation.length - 1,
  );
  console.log(
    `Income calculation: ${income.daily.furnitureParts}*${timeDiffDays} (daily income) + ${income.weekly.furnitureParts}*${weeks} (weekly income) + ${monthlySignInFurniturePartCalculation} (monthly sign-in income)`,
  );
  const totalFurniturePartIncome =
    income.daily.furnitureParts * timeDiffDays +
    income.weekly.furnitureParts * weeks +
    monthlySignInFurniturePartIncome;
  console.log(
    `Total furniture part income: ${totalFurniturePartIncome} furniture parts.`,
  );

  return totalFurniturePartIncome - data.furniture.currentFurnitureParts;
}

// calculateNumOfRuns
// Calculates maximum number of runs needed to farm a currency and achieve the goal by goal date
function calculateNumOfRuns(furniturePartFarm) {
  console.log('--------------Calculate_Number_of_Runs-------------');
  const skRunFP = parseInt(skData.furnitureParts, 10);
  const skRuns = Math.ceil(furniturePartFarm / skRunFP);
  const skSanity = skRuns * parseInt(skData.sanity, 10);
  let furniturePartFarmMessage = `You need to farm SK-${data.optional.highestAutoSK} at least ${skRuns} times (${skSanity} sanity) within the next `;

  if (timeDiffDays) {
    furniturePartFarmMessage += `${timeDiffDays} day(s)`;
    if (timeDiffMinutes) {
      furniturePartFarmMessage += ', ';
    } else {
      furniturePartFarmMessage += ' and ';
    }
  }
  if (timeDiffHours) {
    furniturePartFarmMessage += `${timeDiffHours} hour(s)`;
  }
  if (timeDiffMinutes) {
    furniturePartFarmMessage += ' and ';
    furniturePartFarmMessage += `${timeDiffMinutes} minute(s)`;
  }
  furniturePartFarmMessage += ` before ${localFurniturePartGoalDate.toLocaleDateString(
    'en-US',
    timeFormat,
  )}.`;
  console.log(furniturePartFarmMessage);

  return skRuns;
}

function calculateCarryOverSanity() {
  const sanityRechargeHours = Math.floor(sanityCap / 10);
  const sanityRechargeMinutes = sanityCap - sanityRechargeHours * 10;
  const sanityRechargeTimeMilliseconds =
    sanityRechargeHours * 1000 * 60 * 60 +
    sanityRechargeMinutes * 1000 * 60 * 6;

  return new Date(localNextDayReset.getTime() - sanityRechargeTimeMilliseconds);
}

// scheduler
// Calculates farmable dates and average runs per farmable day
function scheduler(skRuns) {
  console.log('--------------Scheduler-------------');
  const skWeekdays = constants.suppliesRotationWeekdays.SK;
  const farmingDates = [];
  const farmingDatesCumulativeFurnitureParts = [];
  let cumulativeFurnitureParts = data.furniture.currentFurnitureParts;
  // const remainingSKRuns = skRuns;
  const saveSanityDates = [];
  let farmingDays = 0;

  let iDate = localNextDayReset;

  for (
    let i = 0, iDay = iDate.getDay();
    iDate.getDate() < localFurniturePartGoalDate.getDate();

  ) {
    // if new week, add weekly income
    if (iDay === 1) {
      cumulativeFurnitureParts += 250;
    }
    cumulativeFurnitureParts += 72;
    if (iDate.getDate() in income.monthly) {
      const signInReward = income.monthly[iDate.getDate()].split(' ');
      const rewardQuantity = signInReward[0];
      const rewardType = signInReward[1];
      if (rewardType === 'FURNITURE_PARTS') {
        cumulativeFurnitureParts += parseInt(rewardQuantity, 10);
      }
    }
    if (skWeekdays.includes(iDay)) {
      farmingDates.push(new Date(iDate.valueOf()));
      farmingDays += 1;
      i = skWeekdays.indexOf(iDay);
      if (i < skWeekdays.length - 1) {
        i += 1;
      } else {
        i = 0;
      }
      farmingDatesCumulativeFurnitureParts.push(cumulativeFurnitureParts);
    } else if (iDate.getDate() + 1 < localFurniturePartGoalDate.getDate()) {
      let tomorrowDay = iDay + 1;
      if (tomorrowDay === 7) {
        tomorrowDay = 0;
      }
      if (skWeekdays.includes(tomorrowDay)) {
        saveSanityDates.push(new Date(iDate.valueOf()));
      }
    }
    // Check if tomorrow is a farmable day and not the goal date

    iDate = new Date(iDate.setDate(iDate.getDate() + 1));
    iDay = iDate.getDay();
  }

  // const upperAvgSKRun = Math.ceil(remainingSKRuns / farmingDays);

  const avgSKRun = parseFloat(skRuns / farmingDays).toFixed(2);
  const avgSKSanity = avgSKRun * parseInt(skData.sanity, 10);
  console.log(
    `That's ${farmingDays} farmable days with an average of ${avgSKRun} SK-${data.optional.highestAutoSK} runs (${avgSKSanity} sanity) per farmable day.`,
  );
  console.log('Farmable Dates: ');
  for (let iFarm = 0; iFarm < farmingDates.length; iFarm += 1) {
    console.log(
      `   - ${farmingDates[iFarm].toLocaleDateString(
        'en-US',
        dateFormat,
      )}; Cumulative Furniture Parts: ${
        farmingDatesCumulativeFurnitureParts[iFarm]
      }`,
    );
  }

  if (sanityCap) {
    if (avgSKSanity >= 170) {
      const sanityRechargeStartTime = calculateCarryOverSanity();
      console.log(
        `If short on sanity, carry over ${sanityCap} sanity on the following non-farmable days to the next farmable day.`,
      );
      // start recharging sanity on which off days and what time:
      console.log('Start recharging from 0 sanity at these times: ');
      for (
        let iSaveSanity = 0;
        iSaveSanity < saveSanityDates.length;
        iSaveSanity += 1
      ) {
        // Credit for displaying hour and minutes: CJLopez & nrofis from https://stackoverflow.com/a/20430558
        console.log(
          `   - ${saveSanityDates[iSaveSanity].toLocaleDateString(
            'en-US',
            dateFormat,
          )} at ${sanityRechargeStartTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}`,
        );
      }
    }
  } else {
    console.log(
      'You might be low on sanity. Please fill in the value for sanityCap in data.json if you wish to know when to start recharging on non-farmable days.',
    );
  }
}

// Main
// Calculates optimal number of runs on farming maps including calculations of
// daily, weekly and monthly income

calculateDaysAndWeeks();
const furniturePartFarm = data.furniture.goalFurnitureParts - calculateIncome();
if (furniturePartFarm >= 0) {
  const skRuns = calculateNumOfRuns(furniturePartFarm);
  scheduler(skRuns);
}
