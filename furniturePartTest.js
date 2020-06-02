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

const days = timeDiffDays
var weeks //= Math.ceil(timeDiffDays/7)
var monthlySignin = 0
var UTCMinus7Weekday
var furniturePartGoalWeekday

UTCMinus7Weekday = UTCMinus7.getDay()
furniturePartGoalWeekday = furniturePartGoalDate.getDay()
if (UTCMinus7.getHours < 4) {
    UTCMinus7Weekday = UTCMinus7.getDay() - 1
}
// furniturePartGoalDate is always at 4AM so you don't have to check if the hour is earlier than 4AM
if (UTCMinus7Weekday == 0){
    UTCMinus7Weekday = 7
}
if (furniturePartGoalWeekday == 0){
    furniturePartGoalWeekday = 7
}

if (furniturePartGoalWeekday > UTCMinus7Weekday){
    console.log("Case A")
    weeks = Math.floor(days/7)
}

if (furniturePartGoalWeekday <= UTCMinus7Weekday){
    console.log("Case B")
    weeks = Math.ceil(days/7)
}

if (currentTime.getDay() == 1 && currentTime.getUTCHours >= 4) {
    console.log("Today is Monday")
} else {
    console.log("Today is " + UTCMinus7.getDay())
}

console.log("UTC-7: " + UTCMinus7.toLocaleDateString("en-US", timeFormat))
console.log("Your furniture part goal is: " + furniturePartGoal)
console.log("Your furniture part goal date is: " + furniturePartGoalDate.toLocaleDateString("en-US", timeFormat) + " in UTC-7")
console.log("Your furniture part goal date2 is: " + furniturePartGoalDate)
console.log("You have " + timeDiffDays + " days, " + timeDiffHours +" hours and " + timeDiffMinutes + " minutes to reach your goal.")

console.log("Calculation: That's " + days + " days and " + weeks + " weeks.")
//console.log("Calculation: Next Monday is: " + nextMonday)


