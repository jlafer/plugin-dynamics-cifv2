import React, {Component} from 'react'
import RecordForm from "../Common/RecordForm";
import {connect} from "react-redux"
import faker from "faker";

class IncidentInformation extends Component {
    constructor(props) {
        super(props)
    }

    componentDidCatch(error, errorInfo) {
        this.setState({hasError: true})
        console.error('!!!PolicyInformation', error)
        console.error('!!!PolicyInformation errorInfo', errorInfo)
    }

    render() {
        return (
            <React.Fragment>
                <RecordForm
                    imageURL={data.imageURL ? data.imageURL : ''}
                    //     name
                    primaryData={data.primaryData ? data.primaryData : {}}
                    details={data.details ? data.details : {}}
                    // related={data.related ? data.related: {}}
                />
            </React.Fragment>
        )
    }
}

const data = {
    imageURL: 'https://www.gstatic.com/tv/thumb/persons/57282/57282_v9_bb.jpg',
    name: 'Max Danger',
    primaryData: {
        claimNumber: 'GCCI1840723984239487',
        caseNumber: 'EV3049348137826',
    },
    details: {
        claimStatus: 'Open',
        claimType: 'Homeowner',
        caseType: 'Property Damage',
        costCenter: '1033100089798347',
        currentAdjuster: faker.name.findName(),
        caseTimestamp: faker.date.past(1).toDateString(),
        lastCheckIn: faker.date.past(1).toDateString(),
        nextCheckIn: faker.date.future(1).toDateString(),
        caseReportedTimestamp: faker.date.past(1).toDateString(),
        claimReportedTimestamp: faker.date.past(1).toDateString(),
        initialPolicyDate: faker.date.past(3).toDateString(),
        dateClosed: '',
        waterDamage: 'No',
        policyNumber: 'PN304931445826',
        caseStatus: 'Open',
        eventDescription: '',
        customerEventDescription: ''
    }
}


const incidentData = () => {

    return {
        imageURL: '',
        name: '',
        primaryData: data.primaryData,
        details: data.details,
        // related: data.related
    }
}


export default IncidentInformation