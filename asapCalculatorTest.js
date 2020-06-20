#!/usr/bin/env node

// Use formula in day by day calculations
// Situations can change each day due to monthly sign-in rewards and rounding numbers of runs

const data = require('./json/data.json');
// const constants = require('./json/constants.json');
const income = require('./json/currency_income.json');

const dateFormat = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const lmdGoal = data.lmd.goalLMD;
const lmdCurrent = data.lmd.currentLMD;
const lmdBaseIncome = data.lmd.baseOutputLMD;
const lmdDailyIncome = income.daily.lmd;
const lmdWeeklyIncome = income.weekly.lmd;
// const ceLMDReward = constants.map['CE-5'].lmd;
// const ceSanityCost = constants.map['CE-5'].sanity;
const expGoal = data.exp.goalOperatorEXP;
const expCurrent = data.exp.currentInventoryEXP;
const expBaseIncome = data.exp.baseOutputEXP;
const expDailyIncome = income.daily.exp;
const expWeeklyIncome = income.weekly.exp;
// const lsEXPReward = constants.map['LS-5'].battleRecordEXP;
// const sanityDaily = 240;
// const sanityDailyConsumption = data.optional.dailySanityConsumption;
// const { currentSanity } = data.optional;
// const { localBedTime } = data.optional;
const universalGoalDate = data.optional.goalDate;
const { lmdGoalDate } = data.lmd;
const { expGoalDate } = data.exp;

const currentTime = new Date();
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

/* function getBedTime(givenDate) {
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
      // console.log('AM');
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
      // console.log('PM');
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
} */

/* function calculateASAPRuns(cumulativeLMD, cumulativeEXP) {
  // Let y represent CE-5 runs
  let y = 0;
  let z = 0;
  // Formula: ( (LMD Goal - LMD Inv)/(EXP Goal - EXP Inv)*(Base EXP Income + 7500 * Math.floor(daily sanity consumption)/30)-Base LMD Income ) / ( 7500 + ((LMD Goal - LMD Inv)/(EXP Goal - EXP Inv) * 7500) )
  const ratio = (lmdGoal - cumulativeLMD) / (expGoal - cumulativeEXP);
  // console.log('ratio: ' + ratio);
  const dailyRuns = Math.floor(
    (sanityDaily + sanityDailyConsumption) / ceSanityCost,
  );
  y =
    (ratio * (expBaseIncome + lsEXPReward * dailyRuns) - lmdBaseIncome) /
    (ceLMDReward + ratio * lsEXPReward);
  z =
    (lmdBaseIncome + dailyRuns * lsEXPReward - ratio * expBaseIncome) /
    (ceLMDReward + ratio * lsEXPReward);

  // let ceRuns = Math.round(y);
  // let lsRuns = dailyRuns - ceRuns;
  const days = (lmdGoal - cumulativeLMD) / (lmdBaseIncome + ceLMDReward * y);
  // console.log('CE-5 runs: ' + ceRuns + '; LS-5 runs: ' + lsRuns);
  // console.log('Estimated Days: ' + parseFloat(days).toFixed(2));
  if (days < 1) {
    y = (lmdGoal - cumulativeLMD - lmdBaseIncome) / ceLMDReward;
    z = (expGoal - cumulativeEXP - expBaseIncome) / lsEXPReward;
  }
  // console.log('y: ' + y);
  // console.log('z: ' + z);
  return [y, z];
} */

// -------------------------------------------------

// ASAP without runs
// Given:
// - Base income LMD
// - Base income EXP
// - Goal LMD
// - Goal EXP
// - Goal date {optional}

// Output:
// - LMD and EXP days
// 	- if given goal date:
// 	- goal without farming achievable?
//	- CE-5 and LS-5 runs required {consider LS-5's 360 LMD reward, thus count LS-5 runs first!}
//	- days of sanity recharged including today (with and without annihilation Sundays)
//	- additional sanity required from potions
//	- ASAP date with all potions consumed

if (
  lmdGoal === 0 ||
  lmdBaseIncome === 0 ||
  expGoal === 0 ||
  expBaseIncome === 0
) {
  if (lmdGoal === 0) {
    console.log('Error: Missing goalLMD value');
  } else if (lmdBaseIncome === 0) {
    console.log('Error: Missing baseOutputLMD value');
  } else if (expGoal === 0) {
    console.log('Error: Missing goalOperatorEXP value');
  } else if (expBaseIncome === 0) {
    console.log('Error: Missing baseOutputEXP value');
  }
} else {
  console.log('ASAP calculator without farming runs:');
  let lmdCumulative = lmdCurrent;
  let expCumulative = expCurrent;
  for (
    let iDay = 1, iDate = localUTC, iDateNumber = iDate.getDate();
    lmdCumulative <= lmdGoal || expCumulative <= expGoal;
    iDay += 1,
      iDate = new Date(iDate.setDate(iDate.getDate() + 1)),
      iDateNumber = iDate.getDate()
  ) {
    // Daily incomes
    lmdCumulative += lmdBaseIncome + lmdDailyIncome;
    expCumulative += expBaseIncome + expDailyIncome;

    // Weekly incomes
    if (iDate.getDay() === 1) {
      lmdCumulative += lmdWeeklyIncome;
      expCumulative += expWeeklyIncome;
    }

    // Monthly sign-in incomes
    if (iDateNumber in income.monthly) {
      const signInReward = income.monthly[iDateNumber].split(' ');
      const rewardQuantity = signInReward[0];
      const rewardType = signInReward[1];
      if (rewardType === 'LMD') {
        const amount = parseInt(rewardQuantity, 10);
        console.log(`Monthly Sign-in reward: ${amount} LMD`);
        lmdCumulative += amount;
      } else if (rewardType === 'EXP') {
        const amount = parseInt(rewardQuantity, 10);
        console.log(`Monthly Sign-in reward: ${amount} EXP`);
        expCumulative += amount;
      }
    }
    console.log(
      `Day ${iDay}: ${iDate.toLocaleDateString('en-US', dateFormat)}`,
    );
    console.log(`End of Day LMD: ${lmdCumulative}/${lmdGoal}`);
    console.log(`End of Day EXP: ${expCumulative}/${expGoal}`);
    console.log('----------------------------------');
    if (
      (universalGoalDate && iDate < universalGoalDate) ||
      (lmdGoalDate && iDate < lmdGoalDate && expGoalDate && iDate < expGoalDate)
    ) {
      console.log('Deadline reached.');
      break;
    }
  }
  // TODO: Calculate number of CE-5 and LS-5 runs
}

/*
// Main
if (!lmdGoal || !expGoal) {
  if (!lmdGoal) {
    console.log('Error! Missing goalLMD value in data.json');
  } else if (!expGoal) {
    console.log('Error! Missing goalOperatorEXP value in data.json');
  }
} else {
  // Day 0 Calculations
  let day = 0;
  let iDate = localUTC;
  let iDateNumber = iDate.getDate();

  let cumulativeLMD = lmdCurrent;
  let cumulativeEXP = expCurrent;

  const bedTimeDate = getBedTime(localUTC);
  const timeDiff = bedTimeDate - localUTC;
  if (timeDiff > 0) {
    const timeDiffHours = Math.floor(timeDiff / (1000 * 60 * 60)) % 24;
    const timeDiffMinutes = Math.floor(timeDiff / (1000 * 60)) % 60;

    const sanityRechargedUntilBedTime =
      timeDiffHours * 10 + Math.floor(timeDiffMinutes / 6);
    console.log(
      `Day 0: ${timeDiffHours} hours and ${timeDiffMinutes} minutes until your bedtime at ${localBedTime}, and ${sanityRechargedUntilBedTime} sanity left to recharge.`,
    );
    const lmdToEXPRatio =
      (lmdGoal - cumulativeLMD) /
      lmdBaseIncome /
      ((expGoal - cumulativeEXP) / expBaseIncome);
    const dayZeroRuns =
      (currentSanity + sanityRechargedUntilBedTime) / ceSanityCost;
    const dayZeroCERuns = Math.round(
      (lmdToEXPRatio / (lmdToEXPRatio + 1)) * dayZeroRuns,
    );
    const dayZeroLSRuns = Math.round(
      (1 - lmdToEXPRatio / (lmdToEXPRatio + 1)) * dayZeroRuns,
    );
    console.log(`CE-5 runs: ${dayZeroCERuns}`);
    console.log(`LS-5 runs: ${dayZeroLSRuns}`);
    if (dayZeroCERuns > 0) {
      cumulativeLMD += dayZeroCERuns * ceLMDReward;
    } else {
      // if (cumulativeLMD < lmdGoal)
      let lmdBaseIncomeHours = 0;
      let lmdBaseIncomeMinutes = 0;
      lmdBaseIncomeHours = ((lmdGoal - cumulativeLMD) / lmdBaseIncome) * 24;
      lmdBaseIncomeMinutes = (lmdBaseIncomeHours % 1) * 60;
      // cumulativeLMD = lmdGoal;
      console.log(
        `LMD Wait: ${Math.floor(lmdBaseIncomeHours)} hour(s) and ${Math.ceil(
          lmdBaseIncomeMinutes,
        )} minute(s).`,
      );
    }
    if (dayZeroLSRuns > 0) {
      cumulativeEXP += dayZeroLSRuns * lsEXPReward;
    } else {
      // if (cumulativeEXP < expGoal)
      let expBaseIncomeHours = 0;
      let expBaseIncomeMinutes = 0;
      expBaseIncomeHours = (lmdGoal - cumulativeEXP) / expBaseIncome;
      expBaseIncomeMinutes = (expBaseIncomeHours % 1) * 60;
      // cumulativeEXP = expGoal;
      console.log(
        `EXP Wait: ${Math.floor(expBaseIncomeHours)} hour(s) and ${Math.ceil(
          expBaseIncomeMinutes,
        )} minute(s).`,
      );
    }
  } else {
    console.log("It's past your bedtime, nothing left to do today.");
  }
  console.log(`Date: ${iDate.toLocaleDateString('en-US', dateFormat)}`);
  console.log(`End of Day LMD: ${cumulativeLMD}/${lmdGoal}`);
  console.log(`End of Day EXP: ${cumulativeEXP}/${expGoal}`);
  // TODO: Show calculations here.
  console.log('----------------------------------');

  // Day 1+ Calculations
  day += 1;
  for (; cumulativeLMD < lmdGoal || cumulativeEXP < expGoal; day += 1) {
    iDate = new Date(iDate.setDate(iDate.getDate() + 1));
    iDateNumber = iDate.getDate();
    console.log(`Day: ${day}`);
    const runs = calculateASAPRuns(cumulativeLMD, cumulativeEXP);
    let ceRuns = Math.round(runs[0]);
    let lsRuns = Math.round(runs[1]);
    if (ceRuns < 0) {
      ceRuns = 0;
    }
    if (lsRuns < 0) {
      lsRuns = 0;
    }
    console.log(`CE-5 runs: ${ceRuns}`);
    console.log(`LS-5 runs: ${lsRuns}`);
    if (ceRuns > 0) {
      cumulativeLMD += ceRuns * ceLMDReward;
    } else if (cumulativeLMD < lmdGoal) {
      let lmdBaseIncomeHours = 0;
      let lmdBaseIncomeMinutes = 0;
      lmdBaseIncomeHours = ((lmdGoal - cumulativeLMD) / lmdBaseIncome) * 24;
      lmdBaseIncomeMinutes = (lmdBaseIncomeHours % 1) * 60;
      cumulativeLMD = lmdGoal;
      console.log(
        `LMD Wait: ${Math.floor(lmdBaseIncomeHours)} hour(s) and ${Math.ceil(
          lmdBaseIncomeMinutes,
        )} minute(s).`,
      );
    }
    if (lsRuns > 0) {
      cumulativeEXP += lsRuns * lsEXPReward;
    } else if (cumulativeEXP < expGoal) {
      let expBaseIncomeHours = 0;
      let expBaseIncomeMinutes = 0;
      expBaseIncomeHours = (lmdGoal - cumulativeEXP) / expBaseIncome;
      expBaseIncomeMinutes = (expBaseIncomeHours % 1) * 60;
      cumulativeEXP = expGoal;
      console.log(
        `EXP Wait: ${Math.floor(expBaseIncomeHours)} hour(s) and ${Math.ceil(
          expBaseIncomeMinutes,
        )} minute(s).`,
      );
    }
    cumulativeLMD += lmdBaseIncome + lmdDailyIncome;
    cumulativeEXP += expBaseIncome + expDailyIncome;
    if (iDate.getDay() === 1) {
      cumulativeLMD += lmdWeeklyIncome;
      cumulativeEXP += expWeeklyIncome;
    }
    console.log(`Date: ${iDate.toLocaleDateString('en-US', dateFormat)}`);
    if (iDateNumber in income.monthly) {
      const signInReward = income.monthly[iDateNumber].split(' ');
      const rewardQuantity = signInReward[0];
      const rewardType = signInReward[1];
      if (rewardType === 'LMD') {
        const amount = parseInt(rewardQuantity, 10);
        console.log(`Monthly Sign-in reward: ${amount} LMD`);
        cumulativeLMD += amount;
      } else if (rewardType === 'EXP') {
        const amount = parseInt(rewardQuantity, 10);
        console.log(`Monthly Sign-in reward: ${amount} EXP`);
        cumulativeEXP += amount;
      }
    }

    console.log(`End of Day LMD: ${cumulativeLMD}/${lmdGoal}`);
    console.log(`End of Day EXP: ${cumulativeEXP}/${expGoal}`);
    // TODO: Show calculations here.
    console.log('----------------------------------');
  }
  console.log('----------------END---------------');
}
*/
