const moment = require('moment')

export async function addTimestampToCollection(collection, duration = 3, interval = 'hours') {
    let baseDate = new moment().subtract(duration, interval)
    collection.forEach((obj, i) => {
        const timestamp = randomDate(baseDate, i)
        obj.timestamp = timestamp.format("dddd, MMMM Do YYYY, h:mm")
        baseDate = timestamp
    })
}


export function randomDate(startDate, remainingDates = 0) {

    const start = moment(startDate)
    const end = new moment()
    const baseDuration = start.diff(end, 'minutes') / (remainingDates + 1)

    const addDuration = baseDuration * Math.random()

    return new moment(start).add(addDuration, 'minutes')

}

/***  USAGE

 const collection = [
 {name: 'one'},
 {name: 'two'},
 {name: 'three'},
 {name: 'four'}
 ]

addTimestampToCollection(collection)
    .then(() => {
        console.log(collection)
    })
    .catch(e => console.log(e))

 **/
