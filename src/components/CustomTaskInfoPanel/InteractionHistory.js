import React, {Component} from 'react'
import {CustomerJourney} from "../Common";
import {addTimestampToCollection} from '../../helpers/randomDateTimes'
import faker from 'faker'
import moment from 'moment'
import {
    MdPhone,
    MdSms,
    FaTruck,
    MdWeb,
    FaRobot

}
    from 'react-icons/all'


class InteractionHistory extends Component {
    constructor(props) {
        super(props)

        this.state = {
            journey: events
        }
    }

    componentDidMount() {
        this.setState(
            {journey: updateTimestamp(this.state.journey)}
            )
    }

    render() {
        const journey = this.state.journey;
        return (
            <React.Fragment>
                <CustomerJourney
                    journey={journey}
                    xs={12}
                />
            </React.Fragment>
        )
    }

}

const randomDate = (fromInterval, toInterval) => {
    const startDate = new Date(moment().add(fromInterval,'months').format())
    const endDate = new Date(moment().add(toInterval,'months').format())
    return faker.date.between(startDate,endDate )
}

const events = [
  {
    id: 'e1', 
    title: 'Outbound Call',
    body: '',
    icon: MdPhone,
    timestamp: randomDate(3,6)
  },
  {
    id: 'e2', 
    title: 'Response to Auto Messenger',
    body: 'Scheduled Call Back',
    icon: MdSms,
    timestamp: new Date()
  },
  {
    id: 'e3', 
    title: 'Auto Messenger',
    body: 'Response received',
    icon: FaRobot,
    timestamp: new Date()
  },
  {
    id: 'e4', 
    title: 'Outbound Call',
    body: `No Answer - left voicemail`,
    icon: MdPhone,
    timestamp: new Date()
  },
  {
    id: 'e5', 
    title: 'Auto Messenger',
    body: `No Answer`,
    icon: FaRobot,
    timestamp: new Date()
  }
]
function updateTimestamp(events) {

    addTimestampToCollection(events)
        .then(() => {
            return events
        })
        .catch(e => console.error(e))
}

export default InteractionHistory;
