#!/usr/bin/env node

const data = require('./data.json')
const timeFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }
//const fs = require('fs')
const currentTime = new Date()
//const UTC = new Date(currentTime.getTime() + currentTime.getTimezoneOffset() * 60000)
const UTCMinus7 = new Date (currentTime.getUTCFullYear(), currentTime.getUTCMonth(), currentTime.getUTCDate(), currentTime.getUTCHours() - 7, currentTime.getUTCMinutes(), currentTime.getUTCSeconds(), currentTime.getUTCMilliseconds())
const UTCMinus7ResetHour = 4
var UTCMinus7NextDay
if (UTCMinus7.getHours() < UTCMinus7ResetHour){
    //console.log("It's current between 12AM and 4AM in UTC-7: " + UTCMinus7.getHours())
    UTCMinus7NextDay = new Date (UTCMinus7.getFullYear(), UTCMinus7.getMonth(), UTCMinus7.getDate(), UTCMinus7ResetHour, 0, 0, 0)
} else {
    UTCMinus7NextDay = new Date (UTCMinus7.getFullYear(), UTCMinus7.getMonth(), UTCMinus7.getDate() + 1, UTCMinus7ResetHour, 0, 0, 0)

}
var localUTC
if (data.optional.timezoneCity) {
    localUTC = new Date (currentTime.toLocaleString("en-US", {timeZone: data.optional.timezoneCity})); // Default
} else {
    localUTC = new Date (currentTime.getUTCFullYear(), currentTime.getUTCMonth(), currentTime.getUTCDate(), currentTime.getUTCHours() + data.optional.timezoneUTC, currentTime.getUTCMinutes(), currentTime.getUTCSeconds(), currentTime.getUTCMilliseconds())
}
const timeDiff = UTCMinus7NextDay - UTCMinus7
const timeDiffHours = Math.floor(timeDiff/(1000 * 60 * 60))
const timeDiffMinutes = Math.floor((timeDiff/(1000 * 60 * 60) - timeDiffHours)*60)
const timeDiffSeconds = Math.floor(((timeDiff/(1000 * 60 * 60) - timeDiffHours)*60 - timeDiffMinutes)*60)
const localOffset = Math.floor((UTCMinus7 - localUTC)/(1000 * 60 * 60))

var localNextDayReset = localUTC
if (UTCMinus7.getHours() < (UTCMinus7ResetHour - localOffset)){
    localNextDayReset = new Date (currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), (UTCMinus7ResetHour - localOffset), 0, 0, 0)
} else {
    localNextDayReset = new Date (currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 1, (UTCMinus7ResetHour - localOffset), 0, 0, 0)
}

console.log("Welcome to the Arknights Currency Calculator! \n")
//console.log("System Time: " + currentTime)
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
console.log("UTC-7: " + UTCMinus7.toLocaleDateString("en-US", timeFormat))
console.log("Local hour(s) offset: " + localOffset)
console.log("Time until next day: " + Math.floor(timeDiffHours) + " hours, " + timeDiffMinutes + " minutes and " + timeDiffSeconds + " seconds.");


var localResetMessage = "The day will reset on " + localNextDayReset.toLocaleDateString("en-US", timeFormat)
if (data.optional.timezoneCity) {
    localResetMessage += " in " + data.optional.timezoneCity + "."
} else {
    localResetMessage += " at UTC" + data.optional.timezoneUTC + "."
}
console.log(localResetMessage)

if (data.optional.sanityCap) {
    const sanityRechargeHours = Math.floor(data.optional.sanityCap/10)
    const sanityRechargeMinutes = data.optional.sanityCap - (sanityRechargeHours*10)
    sanityRechargeTimeMilliseconds = (sanityRechargeHours * 1000 * 60 * 60) + (sanityRechargeMinutes * 1000 * 60 * 6)
    const startSanityRecharge = new Date (localNextDayReset.getTime() - sanityRechargeTimeMilliseconds)
    if (localUTC < startSanityRecharge) {
        console.log("If you wish to carry over today's sanity to tomorrow, have 0 sanity by local time: " + startSanityRecharge.toLocaleDateString("en-US", timeFormat))
    }
    if (data.optional.currentSanity) {
        var excessSanity
        if (localUTC < startSanityRecharge){
            const excessSanityRechargeHours = (Math.floor((startSanityRecharge - localUTC)/(1000 * 60 * 60))) 
            const excessSanityRechargeMinutes = Math.floor((((startSanityRecharge - localUTC)/(1000 * 60 * 60) - excessSanityRechargeHours)*60)/6)
            excessSanity = excessSanityRechargeHours * 10 + excessSanityRechargeMinutes 
            console.log("You have excess sanity, use up all your current sanity (" + data.optional.currentSanity + ") and at least " + excessSanity + " sanity that you'll save up up until local time: " + startSanityRecharge.toLocaleDateString("en-US", timeFormat) + ".")
        } else {
            //localUTC = new Date(new Date(localUTC.setHours(24)).setMinutes(0))
            //console.log ("Test local time: " + localUTC.toLocaleDateString("en-US", timeFormat))
            const rechargedSanityHours = (Math.floor((localUTC - startSanityRecharge)/(1000 * 60 * 60))) 
            const rechargedSanityMinutes = Math.floor((((localUTC - startSanityRecharge)/(1000 * 60 * 60) - rechargedSanityHours)*60)/6)
            rechargedSanity = rechargedSanityHours*10 + rechargedSanityMinutes
            //console.log("rechargedSanity: " + rechargedSanity)
            if (data.optional.currentSanity > rechargedSanity) {
                console.log("You have excess sanity, use up at least " + (data.optional.currentSanity - rechargedSanity) + " sanity to prevent sanity overflow on " + localNextDayReset.toLocaleDateString("en-US", timeFormat))
            } else {
                const sanityOverflowLeft = (data.optional.sanityCap - data.optional.currentSanity)
                const sanityOverflowLeftHours = Math.floor(sanityOverflowLeft/10)
                const sanityOverflowLeftMinutes = sanityOverflowLeft - sanityOverflowLeftHours*10
                const sanityOverflowTime = new Date(localUTC.getTime() + (sanityOverflowLeftHours * (1000 * 60 * 60)) + (sanityOverflowLeftMinutes * (1000 * 60)))
                console.log("You do NOT have excess sanity to carry over to the next day. However you will overflow sanity on " + sanityOverflowTime.toLocaleDateString("en-US", timeFormat) + ".")
            }
        }  

    } 

}