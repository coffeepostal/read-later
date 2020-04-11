const { GoogleSpreadsheet } = require('google-spreadsheet')

const creds = require('./client_secret.json')
const sheetID = '1iIC8E5jwz22V7h9u1PTLGUpGr_6z61R4UxILjyRl_Hk'

function printJSON(link) {
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
    // console.log(`Link Title: ${link.title}`)
    // console.log(`Link Excerpt: ${link.excerpt}`)
    // console.log(`Link Image: ${link.image}`)
    // console.log(`Link URL: ${link.url}`)
    // console.log(`Link Tags: ${link.tags}`)
    console.log('-----------------------')
    dateProcessing(link.date)
    console.log('-----------------------')
}

function dateProcessing(dateInput) {
    // Create timeOutut object
    let dateTimeOutput = {}
    // Split into date and time as an array
    const arrayDateAndTime = dateInput.split(/( at )/) // (\w{4,10})\s(\d\d)\,\s(\d\d\d\d)(at)(\d\d\:\d\d)(AM|PM)
    // The whole date as a string
    const fullDate = arrayDateAndTime[0]
    // Split the date into 'month and day' and 'year' as an array
    const arrayDateSplit = fullDate.split(/(, )/) // (\w{4,10})\s(\d\d)\,\s(\d\d\d\d)(at)(\d\d\:\d\d)(AM|PM)
    // Set the year in the dateTimeOutput object
    dateTimeOutput.year = parseInt(arrayDateSplit[2])
    // Split the 'Month' and 'day' as an array
    const arrayMonthDay = arrayDateSplit[0].split(/\s/) // (\w{4,10})\s(\d\d)\,\s(\d\d\d\d)(at)(\d\d\:\d\d)(AM|PM)

    // Determin the month number and set the month in the dateTimeOutput object
    switch (arrayMonthDay[0]) {
        case "January":
            dateTimeOutput.month = 01
            break;
        case "February":
            dateTimeOutput.month = 02
            break;
        case "March":
            dateTimeOutput.month = 03
            break;
        case "April":
            dateTimeOutput.month = 04
            break;
        case "May":
            dateTimeOutput.month = 05
            break;
        case "June":
            dateTimeOutput.month = 06
            break;
        case "July":
            dateTimeOutput.month = 07
            break;
        case "August":
            dateTimeOutput.month = 08
            break;
        case "September":
            dateTimeOutput.month = 09
            break;
        case "October":
            dateTimeOutput.month = 10
            break;
        case "November":
            dateTimeOutput.month = 11
            break;
        case "December":
            dateTimeOutput.month = 12
            break;

        // If for some reason this fails, default to January
        default:
            dateTimeOutput.month = 01
            break;
    }

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
    arrayMinuteAndMeridiem.pop()
    // If statement to determin hours in 24-hour time
    if ( arrayMinuteAndMeridiem[1] == 'AM') {
        // If 'AM' set hours to hour
        dateTimeOutput.hour = parseInt(arrayFullTime[0])
    } else {
        // If 'PM' set hours to hour = 12
        const twelveHourTime = parseInt(arrayFullTime[0]) + 12
        dateTimeOutput.hour = parseInt(twelveHourTime)
    }
    // Set minutes
    dateTimeOutput.minute = parseInt(arrayMinuteAndMeridiem[0])

    // console.log(dateTimeOutput)
    return dateTimeOutput
}

async function accessSpreadsheet() {
    const doc = new GoogleSpreadsheet(sheetID)
    await doc.useServiceAccountAuth(creds)
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]

    const rows = await sheet.getRows({
        offset: 0
    })

    // console.log(rows)
    rows.forEach(row => {
        printJSON(row)
    });
}

accessSpreadsheet()