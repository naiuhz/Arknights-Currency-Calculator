#!/usr/bin/env node

const data = require('./data.json')
const income = require('./currency_income.json')
const constants = require('./constants.json')
const skData = constants.map["SK-" + data.optional.highestAutoSK]
const timeFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }
const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
const furniturePartGoalDate = new Date((new Date(data.furniture.goalDate)).setHours(4)) //data.furniture.goalDate
const currentTime = new Date()
const UTCMinus7 = new Date (currentTime.getUTCFullYear(), currentTime.getUTCMonth(), currentTime.getUTCDate(), currentTime.getUTCHours() - 7, currentTime.getUTCMinutes(), currentTime.getUTCSeconds(), currentTime.getUTCMilliseconds())
const UTCMinus7ResetHour = 4
var localUTC
if (data.optional.timezoneCity) {
    localUTC = new Date (currentTime.toLocaleString("en-US", {timeZone: data.optional.timezoneCity})); // Default
} else {
    localUTC = new Date (currentTime.getUTCFullYear(), currentTime.getUTCMonth(), currentTime.getUTCDate(), currentTime.getUTCHours() + data.optional.timezoneUTC, currentTime.getUTCMinutes(), currentTime.getUTCSeconds(), currentTime.getUTCMilliseconds())
}
const localOffset = Math.floor((UTCMinus7 - localUTC)/(1000 * 60 * 60))
const localfurniturePartGoalDate = new Date(furniturePartGoalDate.setHours((UTCMinus7ResetHour - localOffset)))
const timeDiff = furniturePartGoalDate - localUTC
const timeDiffDays = Math.floor(timeDiff/(1000 * 60 * 60 * 24))
const timeDiffHours = Math.floor(timeDiff/(1000 * 60 * 60))%24
const timeDiffMinutes = Math.floor(timeDiff/(1000 * 60))%60


// Main
// Calculates optimal number of runs on farming maps including calculations of
// daily, weekly and monthly income
var weeks = 0
calculateDaysAndWeeks()
const furniturePartFarm = data.furniture.goalFurnitureParts - calculateIncome()
if (furniturePartFarm >= 0) {
    const skRuns = calculateNumOfRuns()
    scheduler(skRuns)
}


// calculateDaysAndWeeks
// Calculates number of days and weeks between today and date of goal
function calculateDaysAndWeeks(){

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
        weeks = Math.floor(timeDiffDays/7)
    }
    if (furniturePartGoalWeekday <= UTCMinus7Weekday){
        weeks = Math.ceil(timeDiffDays/7)
    }
    printLocalTime()

    //console.log("You have " + timeDiffDays + " days, " + timeDiffHours +" hours and " + timeDiffMinutes + " minutes to reach your goal. That's a total of " + timeDiffDays + " days and " + weeks + " weeks.")
}

// printLocalTime
// Prints local time
function printLocalTime() {

    console.log("UTC-7: " + UTCMinus7.toLocaleDateString("en-US", timeFormat))
    if (data.optional.timezoneCity) { //"America/Vancouver"
        console.log(data.optional.timezoneCity + ' local time: '+ (new Date(localUTC).toLocaleDateString("en-US", timeFormat)))
    } else {
        if (data.optional.timezoneUTC != -7) {
            var UTCMessage = "UTC"
            if (data.optional.timezoneUTC >= 0) {
                UTCMessage += "+"
            }
            UTCMessage += data.optional.timezoneUTC + ": " + localUTC.toLocaleDateString("en-US", timeFormat)
            console.log(UTCMessage);
        }
    }
}

// calculateIncome
// Calculates relevant daily, weekly and monthly signin rewards
function calculateIncome() {

    var monthlySigninFurniturePartIncome = 0
    var monthlySigninFurniturePartCalculation = ""
    var i = 0

    if (data.optional.signinRewardDay) {
        i = data.optional.signinRewardDay
    }
    for (i += 1 ; i < furniturePartGoalDate.getDate(); i++){
        if (i in income.monthly){
            const signinReward = income.monthly[i].split(" ")
            const rewardQuantity = signinReward[0]
            const rewardType = signinReward[1]
            if (rewardType == "FURNITURE_PARTS") {
                monthlySigninFurniturePartCalculation += rewardQuantity + "+"
                monthlySigninFurniturePartIncome += parseInt(rewardQuantity)
            }
        }
    }
    monthlySigninFurniturePartCalculation = monthlySigninFurniturePartCalculation.substring(0, monthlySigninFurniturePartCalculation.length - 1)
    console.log("Income calculation: " + income.daily.furnitureParts + "*" + timeDiffDays + " (daily income) + " + income.weekly.furnitureParts + "*" + weeks + " (weekly income) + " + monthlySigninFurniturePartCalculation + " (monthly signin income)")
    const totalFurniturePartIncome = (income.daily.furnitureParts * timeDiffDays) + (income.weekly.furnitureParts * weeks) + monthlySigninFurniturePartIncome
    console.log("Total furniture part income: " + totalFurniturePartIncome + " furniture parts.")

    return (totalFurniturePartIncome - data.furniture.currentFurnitureParts)
}


// calculateNumOfRuns
// Calculates maximum number of runs needed to farm a currency and achieve the goal by goal date
function calculateNumOfRuns() {
    console.log("--------------Calculate_Number_of_Runs-------------")
    const skRunFP = parseInt(skData.furnitureParts)
    const skRuns = Math.ceil(furniturePartFarm/skRunFP) 
    const skSanity = skRuns*parseInt(skData.sanity)
    var furniturePartFarmMessage = "You need to farm SK-" + data.optional.highestAutoSK + " at least " + skRuns + " times ("  + skSanity + " sanity) within the next "

    if (timeDiffDays) {
        furniturePartFarmMessage += timeDiffDays + " day(s)"
        if (timeDiffMinutes) {
            furniturePartFarmMessage += ", "
        } else {
            furniturePartFarmMessage += " and "
        }
    }
    if (timeDiffHours) {
        furniturePartFarmMessage += timeDiffHours + " hour(s)"
    }
    if (timeDiffMinutes) {
        furniturePartFarmMessage += " and "
        furniturePartFarmMessage += timeDiffMinutes + " minute(s)"
    }
    furniturePartFarmMessage += " before " + localfurniturePartGoalDate.toLocaleDateString("en-US", timeFormat) + "."
    console.log (furniturePartFarmMessage)

    return skRuns
}

// nextDay
// Finds date of next weekday
// Credit: NoelHunter from this post https://stackoverflow.com/a/27336600
function nextDay(d, dow){

    d.setDate(d.getDate() + (dow+(7-d.getDay())) % 7);
    return d;
}


// scheduler
// Calculates farmable dates and average runs per farmable day
function scheduler(skRuns) {

    console.log("--------------Scheduler-------------")
    const skWeekdays = constants.suppliesRotationWeekdays.SK
    var farmingDates = []
    var farmingDays = 0
    var i = 0
    var iDate = localUTC

    for (var iDay = iDate.getDay(); iDate.getDate() < localfurniturePartGoalDate.getDate();){
        if (skWeekdays.includes(iDay)){
            farmingDates.push(new Date(iDate.valueOf()))
            farmingDays++
            i = skWeekdays.indexOf(iDay)
            if (i < (skWeekdays.length - 1) ){
                i++
            } else {
                i = 0
            }
            iDate = nextDay(iDate, skWeekdays[i])
        } else {
            iDate = new Date(iDate.setDate(iDate.getDate()+1))
        }
        iDay = iDate.getDay()
    }
    const avgSKRun = parseFloat(skRuns/farmingDays).toFixed(2)
    const avgSKSanity = avgSKRun*parseInt(skData.sanity)
    console.log("That's " + farmingDays + " farmable days with an average of " + avgSKRun + " SK-" + data.optional.highestAutoSK + " runs (" + avgSKSanity + " sanity) per farmable day.")
    console.log("Farmable Dates: ")
    for (var iFarm = 0; iFarm < farmingDates.length; iFarm++){
        console.log("   - " + farmingDates[iFarm].toLocaleDateString("en-US", dateFormat))
    }
}