**How to input values into the Calculator.**

In `data.json`, you can change the values to enter the information extracted from your Arknights account.

`optional`

Like its name suggests, you do not have to modify these values to get your answer, but it would give you a more accurate answer if you enter in your values.

`goalDate` (WIP)

The date you wish to achieve your goal by. The value is a date in ISO format: `"YYYY-MM-DD"`. If you don't have a date to achieve your goal, leave the value as `false`.

`timezoneCity`

The city you wish to change the local time to. The value is a city in locale format: `"Continent/City"`, eg. `"America/Toronto"`. If you don't have a city to enter, leave the value as `false`.
Note: This overrides timezoneUTC if the value isn't `false`.

`timezoneUTC`

The UTC timezone you wish to change the local time to. The value is the UTC timezone as an integer, eg. `-7`. Leave the value as `-7` if your timezone is UTC-7 or if you don't want to add a local UTC timezone.
Note: Positive integers should not include plus (+) signs in the value.

`doctorCurrentEXP` (WIP)

The Doctor's current EXP. Useful to calculate when the player will level up. The value is the EXP as an integer. Leave the value as `0` if you don't wish to calculate the leveling up sanity reward.

`doctorLevelUpEXP` (WIP)

The Doctor's next level exp cap. Useful to calculate when the player will level up. The value is the EXP as an integer. Leave the value as `0` if you don't wish to calculate the leveling up sanity reward.

`dailySanityConsumption` (WIP)

How much extra sanity you consume per day. Eg. If you consume emergency sanity potions (60 sanity) and/or Originite Prime to recover sanity. The value is the sanity consumption as an integer. Leave the value as `0` if you do not plan on consuming anything daily to recover sanity.

`currentSanity`

How much sanity you currently have. Used to calculate how much sanity you have excess if you wish to carry over sanity to tomorrow and to calculate when you will overflow in sanity. The value is the sanity as an integer. Leave the value as `0` if you don't wish to calculate carrying over sanity to the next day and when you will overflow in sanity.

`sanityCap`

The sanity cap at your current level. Used to calculate when you should start recharging sanity to carry over to tomorrow and to calculate when you will overflow in sanity. The value is the sanity as an integer. Leave the value as `0` if you don't wish to calculate carrying over sanity to the next day and when you will overflow in sanity.

`dailyMissionsCompleted` (WIP)

Whether or not you've completed the daily missions. The value is a `true` or `false`.

`weeklyMissionsCompleted` (WIP)

Whether or not you've completed the weekly missions. The value is a `true` or `false`.

`signinRewardDay` (WIP)

Which day you are on from the sign-in rewards calender. The value is the day as an integer. Leave the value as `0` if you are on the same day as the date of the month (if you have signed in every day of the month so far).

`fullWeekAccessStart` (WIP)

The date when the supplies and chips full week access starts. The value is a date in ISO format: `"YYYY-MM-DD"`. If you don't have a start date to add, leave the value as `false`.

`fullWeekAccessEnd` (WIP)

The date when the supplies and chips full week access ends. The value is a date in ISO format: `"YYYY-MM-DD"`. If you don't have a end date to add, leave the value as `false`.

`highestAutoLS` (WIP)

The highest Tactical Drill (EXP Battle Records) LS map you can auto. The value is an integer from `1` through `5`. If you can auto the highest map, LS-5 then leave the value as `5`.

`highestAutoCE` (WIP)

The highest Cargo Escort (LMD) CE map you can auto. The value is an integer from `1` through `5`. If you can auto the highest map, CE-5 then leave the value as `5`.

`highestAutoAP` (WIP)

The highest Tough Siege (Shop Voucher, SV) AP map you can auto. The value is an integer from `1` through `5`. If you can auto the highest map, AP-5 then leave the value as `5`.

`highestAutoSK` (WIP)

The highest Resource Search (Carbon Packs/Bricks/Sticks and Furniture Parts) SK map you can auto. The value is an integer from `1` through `5`. If you can auto the highest map, SK-5 then leave the value as `5`.

``


