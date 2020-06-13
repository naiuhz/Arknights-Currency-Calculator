#!/usr/bin/env node

// Use formula in day by day calculations
// Situations can change each day due to monthly sign-in rewards and rounding numbers of runs

const data = require('./json/data.json');
const constants = require('./json/constants.json');
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
const ceLMDReward = constants.map['CE-5'].lmd;
const ceSanityCost = constants.map['CE-5'].sanity;
const expGoal = data.exp.goalOperatorEXP;
const expCurrent = data.exp.currentInventoryEXP;
const expBaseIncome = data.exp.baseOutputEXP;
const expDailyIncome = income.daily.exp;
const expWeeklyIncome = income.weekly.exp;
const lsEXPReward = constants.map['LS-5'].battleRecordEXP;
const sanityDaily = 240;
const sanityDailyConsumption = data.optional.dailySanityConsumption;

function calculateASAPRuns(cumulativeLMD, cumulativeEXP) {
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
}

// Main
if (!lmdGoal || !expGoal) {
  if (!lmdGoal) {
    console.log('Error! Missing goalLMD value in data.json');
  } else if (!expGoal) {
    console.log('Error! Missing goalOperatorEXP value in data.json');
  }
} else {
  let day = 0;
  let iDate = new Date();
  let iDateNumber = iDate.getDate();
  let lmdBaseIncomeHours = 0;
  let lmdBaseIncomeMinutes = 0;
  let expBaseIncomeHours = 0;
  let expBaseIncomeMinutes = 0;

  // TODO: Calculate now until local bedtime for day 0
  // Count number of available runs for day 0 with current sanity and recoverable sanity

  for (
    let cumulativeLMD = lmdCurrent, cumulativeEXP = expCurrent;
    cumulativeLMD < lmdGoal && cumulativeEXP < expGoal;
    day += 1
  ) {
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
    } else {
      lmdBaseIncomeHours = ((lmdGoal - cumulativeLMD) / lmdBaseIncome) * 24;
      lmdBaseIncomeMinutes = (lmdBaseIncomeHours % 1) * 60;
      console.log(
        `LMD Wait: ${Math.floor(lmdBaseIncomeHours)} hour(s) and ${Math.ceil(
          lmdBaseIncomeMinutes,
        )} minute(s).`,
      );
    }
    if (lsRuns > 0) {
      cumulativeEXP += lsRuns * lsEXPReward;
    } else {
      expBaseIncomeHours = (lmdGoal - cumulativeEXP) / expBaseIncome;
      expBaseIncomeMinutes = (expBaseIncomeHours % 1) * 60;
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
    console.log('----------------------------------');
  }
}
