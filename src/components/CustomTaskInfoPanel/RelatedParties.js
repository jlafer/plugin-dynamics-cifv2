import React, {Component} from 'react'
import SimpleTable from "../Common/SimpleTable";
import faker from 'faker'
import CallButton from "../Common/CallButton";
import SmsButton from "../Common/SmsButton";

class RelatedParties extends Component {
    constructor(props) {
        super(props)
        this.state = {
            relatedParties: relatedPartiesBase
        }

    }

    componentDidMount() {
        getRelatedParties().then(relatedParties => {
            this.setState({relatedParties: relatedParties})
        })
    }

    render() {

        return (

            <React.Fragment>
                <SimpleTable
                    data={this.state.relatedParties}
                />
            </React.Fragment>
        )
    }
}

const lastName = faker.name.lastName()


const getRelatedParties = async () => {
    return relatedPartiesBase.map(party => {
        party.call = (<CallButton destinationNumber={'+16464139588'} name={party.name} confirmation={true}/>)
        party.sms = (<SmsButton destinationNumber={'+18133402239'} name={party.name} confirmation={true}/>)
        return party
    })
}

const relatedPartiesBase = [
    {
        name: faker.name.firstName(0) + ' ' + lastName,
        relation: 'Wife',
        phone: faker.phone.phoneNumber(),

    },
    {
        name: faker.name.firstName(1) + ' ' + lastName,
        relation: 'Son',
        phone: faker.phone.phoneNumber(),

    },
    {
        name: faker.name.firstName(0) + ' ' + lastName,
        relation: 'Daughter',
        phone: faker.phone.phoneNumber(),

    }
]

export default RelatedParties

