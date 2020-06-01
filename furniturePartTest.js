#!/usr/bin/env node

const data = require('./data.json')
const timeFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }
const furniturePartGoal = data.furniture.goalFurnitureParts
const furniturePartGoalDate = new Date((new Date(data.furniture.goalDate)).setHours(4)) //data.furniture.goalDate
//const furniturePartGoalDate = new Date(data.furniture.goalDate)
const currentTime = new Date()
const UTCMinus7 = new Date (currentTime.getUTCFullYear(), currentTime.getUTCMonth(), currentTime.getUTCDate(), currentTime.getUTCHours() - 7, currentTime.getUTCMinutes(), currentTime.getUTCSeconds(), currentTime.getUTCMilliseconds())

const timeDiff = furniturePartGoalDate - UTCMinus7
const timeDiffDays = Math.floor(timeDiff/(1000 * 60 * 60 * 24))
const timeDiffHours = Math.floor(timeDiff/(1000 * 60 * 60))%24
const timeDiffMinutes = Math.floor(timeDiff/(1000 * 60))%60

const weekdays = timeDiffDays
const weeks = Math.ceil(timeDiffDays/7)
var monthlySignin = 0
var UTCMinus7Weekday

//var nextMonday = (d.getDate() + ((7-d.getDay())%7+1) % 7);
if (UTCMinus7 >= 4) {
    console.log("Today is " + UTCMinus7.getDay())
    UTCMinus7Weekday = UTCMinus7.getDay()
} else {
    console.log("Today is " + UTCMinus7.getDay() - 1)
    UTCMinus7Weekday = UTCMinus7.getDay() - 1
}

var nextMonday //todo

/*
if (currentTime.getDay() == 1 && currentTime.getUTCHours >= 4) {
    console.log("Today is Monday")
} else {
    console.log("Today is " + UTCMinus7.getDay())
}*/

console.log("UTC-7: " + UTCMinus7.toLocaleDateString("en-US", timeFormat))
console.log("Your furniture part goal is: " + furniturePartGoal)
console.log("Your furniture part goal date is: " + furniturePartGoalDate.toLocaleDateString("en-US", timeFormat) + " in UTC-7")
console.log("Your furniture part goal date2 is: " + furniturePartGoalDate)
console.log("You have " + timeDiffDays + " days, " + timeDiffHours +" hours and " + timeDiffMinutes + " minutes to reach your goal.")

console.log("Calculation: That's " + weekdays + " weekdays and " + weeks + " weeks.")
console.log("Calculation: Next Monday is: " + nextMonday)