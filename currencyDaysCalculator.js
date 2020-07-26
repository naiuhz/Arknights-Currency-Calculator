#!/usr/bin/env node

const income = require('./json/currency_income.json');

const dateFormat = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const lmdDailyIncome = income.daily.lmd;
const lmdWeeklyIncome = income.weekly.lmd;
const expDailyIncome = income.daily.exp;
const expWeeklyIncome = income.weekly.exp;

function function1() {
  console.log('Hello! This is function1!');
}

function calculateCurrencyDays(input) {
  console.log('ASAP calculator without farming runs:');
  const output = {
    lmdCumulative: input.lmdCurrent,
    expCumulative: input.expCurrent,
    ceRuns: 0,
    lsRuns: 0,
    currentSanity: input.currentSanity,
    monthlyCardDaysLeft: input.monthlyCardDaysLeft,
    sanityConsumable: input.sanityConsumable,
  };
  const { goalDate } = input.goalDate;
  console.log(`input.lmdCurrent: ${input.lmdCurrent}`);
  console.log(`output.lmdCurrent: ${output.lmdCumulative}`);
  /* if (input.goalDate != null) {
    lmdGoal = input.goalDate;
    expGoal = input.goalDate;
  } */

  // No additional sanity used
  for (
    let iDay = 1, iDate = input.localUTC, iDateNumber = iDate.getDate();
    output.lmdCumulative <= input.lmdGoal ||
    output.expCumulative <= input.expGoal;
    iDay += 1,
      iDate = new Date(iDate.setDate(iDate.getDate() + 1)),
      iDateNumber = iDate.getDate()
  ) {
    if (
      (goalDate && iDate < input.universalGoalDate) ||
      (input.lmdGoalDate &&
        iDate < input.lmdGoalDate &&
        input.expGoalDate &&
        iDate < input.expGoalDate)
    ) {
      console.log('Deadline reached.');
      break;
    }
    // Daily incomes

    output.lmdCumulative += input.lmdBaseIncome + lmdDailyIncome;
    output.expCumulative += input.expBaseIncome + expDailyIncome;

    // Weekly incomes
    if (iDate.getDay() === 1) {
      output.lmdCumulative += lmdWeeklyIncome;
      output.expCumulative += expWeeklyIncome;
    }

    // Monthly sign-in incomes
    if (iDateNumber in income.monthly) {
      const signInReward = income.monthly[iDateNumber].split(' ');
      const rewardQuantity = signInReward[0];
      const rewardType = signInReward[1];
      if (rewardType === 'LMD') {
        const amount = parseInt(rewardQuantity, 10);
        console.log(`Monthly Sign-in reward: ${amount} LMD`);
        output.lmdCumulative += amount;
      } else if (rewardType === 'EXP') {
        const amount = parseInt(rewardQuantity, 10);
        console.log(`Monthly Sign-in reward: ${amount} EXP`);
        output.expCumulative += amount;
      }
    }
    console.log(
      `Day ${iDay}: ${iDate.toLocaleDateString('en-US', dateFormat)}`,
    );
    console.log(`End of Day LMD: ${output.lmdCumulative}/${input.lmdGoal}`);
    console.log(`End of Day EXP: ${output.expCumulative}/${input.expGoal}`);
    console.log('----------------------------------');
  }

  // No farming necessary
  if (
    output.lmdCumulative >= input.lmdGoal &&
    output.expCumulative >= input.expCumulative
  ) {
    return output;
  }
  // TODO: Calculate number of CE-5 and LS-5 runs
  return output;
}

module.exports = {
  function1,
  calculateCurrencyDays,
};
