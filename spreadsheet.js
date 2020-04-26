const { GoogleSpreadsheet } = require('google-spreadsheet')

require("dotenv").config()
const creds = require('./client_secret.json')
const sheetID = process.env.SHEET_ID

function printJSON(link) {

    // Create object from returned data
    const linkObject = {
        date: dateProcessing(link.date),
        title: link.title,
        excerpt: link.excerpt,
        image: link.image,
        url: link.url,
        tags: link.tags,
        seen: link.seen
    }

    console.log(linkObject)

    // Return the object
    return linkObject
}

function dateProcessing(dateInput) {
    // Create timeOutut object
    let dateTimeOutput = {}
    // Split into date and time as an array
    const arrayDateAndTime = dateInput.split(/( at )/) // eg: [ 'April 11, 2020', 'at' '08:19PM' ]
    // The whole date as a string
    const fullDate = arrayDateAndTime[0]
    // Split the date into 'month and day' and 'year' as an array
    const arrayDateSplit = fullDate.split(/(, )/) // eg: [ 'April 11', ', ', '2020' ]
    // Split the 'Month' and 'day' as an array
    const arrayMonthDay = arrayDateSplit[0].split(/\s/); // eg: [ 'April', '11' ]

    // Set the year in the dateTimeOutput object
    dateTimeOutput.year = parseInt(arrayDateSplit[2])
    // Determin the month number and set the month in the dateTimeOutput object
    dateTimeOutput.month = getMonthFromString(arrayMonthDay[0])
    // Set the day in the dateTimeOutput object
    dateTimeOutput.day = parseInt(arrayMonthDay[1])

    // The whole time as a string
    const fullTime = arrayDateAndTime[2]
    // Split the time into 'hours' and 'minutes(AM|PM)' as an array
    const arrayFullTime = fullTime.split(/:/)
    // The mintues and meridiem as a string
    const minuteAndMeridiem = arrayFullTime[1]
    // Split the 'minutes' and 'meridiem' as an array
    const arrayMinuteAndMeridiem = minuteAndMeridiem.split(/(AM|PM)/)
    // Remove the unnecessary extra array field
    arrayMinuteAndMeridiem.pop();

    // If statement to determin hours in 24-hour time
    if (arrayMinuteAndMeridiem[1] == "AM") {
        // If 'AM' set hours to hour
        dateTimeOutput.hour = parseInt(arrayFullTime[0])
    } else {
        // If 'PM' set hours to hour = 12
        const twelveHourTime = parseInt(arrayFullTime[0]) + 12
        dateTimeOutput.hour = parseInt(twelveHourTime)
    }

    // Set minutes
    dateTimeOutput.minute = parseInt(arrayMinuteAndMeridiem[0]);

    // console.log(dateTimeOutput)
    return dateTimeOutput
}

// Get Month from String function
function getMonthFromString(month) {
    return new Date(Date.parse(month + " 1, 2020")).getMonth() + 1;
}

// Function to access the spreadsheet asynchronously
async function accessSpreadsheet() {

    // Create a new GoogleSpreadsheet object using the private ID
    const doc = new GoogleSpreadsheet(sheetID)
    // Await authentication using credentials
    await doc.useServiceAccountAuth(creds)
    // Await returned info
    await doc.loadInfo()
    // Access the 1st spreadsheet in the document
    const sheet = doc.sheetsByIndex[0]

    // Await return rows
    const rows = await sheet.getRows({
        offset: 0
    })

    // Run a forEach loop on the rows
    rows.forEach(row => {
        printJSON(row)
    })

}

// Run the async function to access the spreadsheet
accessSpreadsheet()
