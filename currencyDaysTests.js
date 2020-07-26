#!/usr/bin/env node

const data = require('./json/data.json');

const currentTime = new Date();
let localUTCTime;
if (data.optional.timezoneCity) {
  localUTCTime = new Date(
    currentTime.toLocaleString('en-US', {
      timeZone: data.optional.timezoneCity,
    }),
  ); // Default
} else {
  localUTCTime = new Date(
    currentTime.getUTCFullYear(),
    currentTime.getUTCMonth(),
    currentTime.getUTCDate(),
    currentTime.getUTCHours() + data.optional.timezoneUTC,
    currentTime.getUTCMinutes(),
    currentTime.getUTCSeconds(),
    currentTime.getUTCMilliseconds(),
  );
}

const testOne = {
  lmdCurrent: 127917,
  expCurrent: 229000,
  localUTC: localUTCTime,
  lmdGoal: 356530,
  expGoal: 185472,
  goalDate: '2020 June 30',
  lmdBaseIncome: 41000,
  expBaseIncome: 28000,
  currentSanity: 0,
  monthlyCardDaysLeft: 0,
  sanityConsumable: {
    topEmergencySanityPotion: 0,
    emergencySanityPotion: 0,
  },
};
// const testTwo = {};
// const testThree = {};
// const testFour = {};
// const testFive = {};

const currencyDaysCalculator = require('./currencyDaysCalculator');

// Scenario 1 (Good Day/Happy Path)
// A goalDate is given and no map farming is necessary
function scenarioOne(input) {
  currencyDaysCalculator.function1();
  const results = currencyDaysCalculator.calculateCurrencyDays(input);

  if (results.ceRuns === 0 && results.lsRuns === 0) {
    console.log(`Scenario 1: Success.`);
  } else {
    console.log(`Scenario 1: Failed! Output result number: ${results}`);
  }
}

// Scenario 2
// A goalDate is given and some map farming is necessary
// No sanity potions consumed
/* function scenarioTwo(input) {
  currencyDaysCalculator.function1();
  const results = currencyDaysCalculator.calculateCurrencyDays(input);
  if (results === 2) {
    console.log(`Scenario 2: Success. Output result number: ${results}`);
  } else {
    console.log(`Scenario 2: Failed! Output result number: ${results}`);
  }
} */

// Scenario 3
// A goalDate is given and some map farming is necessary
// Some sanity potions consumed

// Scenario 4

// Scenario 5

// Main
scenarioOne(testOne);
// scenarioTwo(testTwo);
