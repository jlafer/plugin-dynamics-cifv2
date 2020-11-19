import React, {Component} from 'react'
import {CustomerJourney} from "../Common";
import {addTimestampToCollection} from '../../helpers/randomDateTimes'
import {Paper, Typography, Grid} from '@material-ui/core';
import faker from 'faker'
import moment from 'moment'
import {
    FaFire,
    FaMask,
    FaPowerOff,
    MdWarning
}
    from 'react-icons/all'


class ClaimHistory extends Component {
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
                <Grid xs={12} container item direction={'column'} alignItems={'stretch'}>
                    <Paper severity="error" style={styles.materialAlert}>
                        <Grid direction={'column'} container style={styles.padded}>
                            <Typography variant={'overline'}><MdWarning style={styles.alertIcon}/>Flagged for Fraud</Typography>
                            <Typography>3+ Claims in the past 18 months</Typography>
                        </Grid>
                    </Paper>
                    <CustomerJourney
                        journey={journey}
                    />
                </Grid>
            </React.Fragment>
        )
    }

}

function randomDate(fromInterval, toInterval) {
    const startDate = new Date(moment().subtract(fromInterval,'months').format())
    const endDate = new Date(moment().subtract(toInterval,'months').format())
    return faker.date.between(startDate,endDate )
}

const events = [
    {
      id: "e1",
      title: `HOI${Math.floor(100000000 + Math.random() * 900000000)}`,
      body: 'Burglary or Theft',
      icon: FaMask,
      timestamp: randomDate(3, 6)
    },
    {
      id: "e2",
      title: `HOI${Math.floor(100000000 + Math.random() * 900000000)}`,
      body: 'Fire',
      icon: FaFire,
      timestamp: randomDate(6, 12)
    },
    {
      id: "e3",
      title: `HOI${Math.floor(100000000 + Math.random() * 900000000)}`,
      body: 'Power Failure or Surge',
      icon: FaPowerOff,
      timestamp: randomDate(12, 18)
    }
]

function updateTimestamp(events) {

    addTimestampToCollection(events)
        .then(() => {
            return events
        })
        .catch(e => console.log(e))
}

const styles = {
    alert: {
        background: '#ff0000',
        // 'background-opacity':'.3',
        border: '2px solid red',
        'border-radius': '5px',
        'color': 'red'
    },
    alertHeader: {
        color: 'red',

    },
    materialAlert: {
        position: 'relative',
        'minWidth': '150px',
        // 'padding': '15px',
        'marginBottom': '20px',
        'marginTop': '15px',
        'border': '1px solid transparent',
        'borderRadius': '4px',
        'transition': 'all 0.1s linear',
        // 'webkit-box-shadow': '0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)',
        'boxShadow': '0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)',
        // 'display': '-webkit-box',
        // 'display': '-webkit-flex',
        // 'display': '-ms-flexbox',
        'display': 'flex',
        // '-webkit-box-align': 'center',
        // '-webkit-align-items': 'center',
        // '-ms-flex-align': 'center',
        'alignItems': 'center',
        'backgroundColor': 'rgba(255, 0, 0, .2)',
        'color': '#fff',
        'width':'100%',
        // 'opacity':'.2'
    },
    alertIcon: {
        'marginRight': '10px'
    },
    padded: {
        padding:'15px'
    }

}


export default ClaimHistory
