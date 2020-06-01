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
    UTCMinus7Weekday = UTCMinus7.getDay()
    if (UTCMinus7Weekday == 0){
        UTCMinus7Weekday = 7
    }
    //console.log("Today is " + UTCMinus7Weekday)
} else {
    UTCMinus7Weekday = UTCMinus7.getDay() - 1
    //console.log("Today is " + UTCMinus7Weekday)
}

var nextMonday //todo



/*
if (currentTime.getDay() == 1 && currentTime.getUTCHours >= 4) {
    console.log("Today is Monday")
} else {
    console.log("Today is " + UTCMinus7.getDay())
}*/
/*
console.log("UTC-7: " + UTCMinus7.toLocaleDateString("en-US", timeFormat))
console.log("Your furniture part goal is: " + furniturePartGoal)
console.log("Your furniture part goal date is: " + furniturePartGoalDate.toLocaleDateString("en-US", timeFormat) + " in UTC-7")
console.log("Your furniture part goal date2 is: " + furniturePartGoalDate)
console.log("You have " + timeDiffDays + " days, " + timeDiffHours +" hours and " + timeDiffMinutes + " minutes to reach your goal.")

console.log("Calculation: That's " + weekdays + " weekdays and " + weeks + " weeks.")
//console.log("Calculation: Next Monday is: " + nextMonday)
*/

// assuming we exclude our own week
const testCurrentDate = new Date("2020 June 8")
const testGoalDate = new Date("2020 June 14")
console.log("testCurrentDate: " + testCurrentDate.toLocaleDateString("en-US", timeFormat))
console.log("testCurrentDate: " + testGoalDate.toLocaleDateString("en-US", timeFormat))

const testTimeDiff = testGoalDate - testCurrentDate
const testWeekdays = Math.floor(testTimeDiff/(1000 * 60 * 60 * 24))
var testWeeks 

testWeekday = testCurrentDate.getDay()
if (testWeekday == 0){
    testWeekday = 7
}

testGoalday = testGoalDate.getDay()
if (testGoalday == 0){
    testGoalday = 7
}

if (testGoalday > testWeekday){
    console.log("Case A")
    testWeeks = Math.floor(testWeekdays/7)
}

//if Math.ceil(timeDiffDays/7) < 1 and furniturePartGoalDate.getDay() < UTCMinus7.getDay()
//then 1 week
//current is Sun, goal is next Mon (8 days), weeks is then 2 (math.ceil?)

/*else if (Math.ceil(testWeekdays/7) < 1 && (testGoalDate.getDay() < testWeekday)){
    console.log("Case 2a")
    testWeeks = 1
}*/

if (testGoalday <= testWeekday){
    console.log("Case B")
    testWeeks = Math.ceil(testWeekdays/7)
}


//if Math.ceil(timeDiffDays/7) > 1 and furniturePartGoalDate.getDay() > UTCMinus7.getDay()
//then Math.ceil(timeDiffDays/7) weeks

console.log("Calculation: That's " + testWeekdays + " weekday(s) and " + testWeeks + " week(s).")