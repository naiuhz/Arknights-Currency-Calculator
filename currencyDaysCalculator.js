#!/usr/bin/env node

const income = require('./json/currency_income.json');

const dateFormat = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

function function1() {
  console.log('Hello! This is function1!');
}

function calculateCurrencyDays(input) {
  console.log('ASAP calculator without farming runs:');
  let lmdCumulative = input.lmdCurrent;
  let expCumulative = input.expCurrent;
  for (
    let iDay = 1, iDate = input.localUTC, iDateNumber = iDate.getDate();
    lmdCumulative <= input.lmdGoal || expCumulative <= input.expGoal;
    iDay += 1,
      iDate = new Date(iDate.setDate(iDate.getDate() + 1)),
      iDateNumber = iDate.getDate()
  ) {
    if (
      (input.universalGoalDate && iDate < input.universalGoalDate) ||
      (input.lmdGoalDate &&
        iDate < input.lmdGoalDate &&
        input.expGoalDate &&
        iDate < input.expGoalDate)
    ) {
      console.log('Deadline reached.');
      break;
    }
    // Daily incomes
    lmdCumulative += input.lmdBaseIncome + input.lmdDailyIncome;
    expCumulative += input.expBaseIncome + input.expDailyIncome;

    // Weekly incomes
    if (iDate.getDay() === 1) {
      lmdCumulative += input.lmdWeeklyIncome;
      expCumulative += input.expWeeklyIncome;
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
    console.log(`End of Day LMD: ${lmdCumulative}/${input.lmdGoal}`);
    console.log(`End of Day EXP: ${expCumulative}/${input.expGoal}`);
    console.log('----------------------------------');
  }
  // TODO: Calculate number of CE-5 and LS-5 runs
}

module.exports = {
  function1,
  calculateCurrencyDays,
};
