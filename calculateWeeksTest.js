#!/usr/bin/env node

const timeFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }

// Assuming we exclude our own week
const testCurrentDate = new Date("2020 June 7")
const testGoalDate = new Date("2020 June 15")
console.log("testCurrentDate: " + testCurrentDate.toLocaleDateString("en-US", timeFormat))
console.log("testGoalDate: " + testGoalDate.toLocaleDateString("en-US", timeFormat))

const testTimeDiff = testGoalDate - testCurrentDate
const testWeekdays = Math.floor(testTimeDiff/(1000 * 60 * 60 * 24))
var testWeeks 

testWeekday = testCurrentDate.getDay()
if (testWeekday == 0){
    testWeekday = 7
} else if (testWeekday == 1){
    testWeekday = 8
}

testGoalday = testGoalDate.getDay()
if (testGoalday == 0){
    testGoalday = 7
} else if (testGoalday == 1){
    testGoalday = 8
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