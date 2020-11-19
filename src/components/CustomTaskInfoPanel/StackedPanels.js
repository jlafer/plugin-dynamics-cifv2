import React from 'react'


import {ExpPanelList} from '../Common'
import InteractionHistory from './InteractionHistory'
import ClaimHistory from './ClaimHistory'
import IncidentInformation from './IncidentInformation';
import RelatedParties from "./RelatedParties";

class StackedPanels extends React.Component {
    constructor(props) {
        super(props);
        this.expand = this.expand.bind(this);

        this.state = {expanded: 'false'}
    }

    expand = panel => (event, isExpanded) => {
        // console.log('event.target', event.target);
        this.setState({expanded: isExpanded ? panel : false})

    };

    componentDidCatch(error, errorInfo) {
        console.log(error)
    }

    render() {
        return (
            <React.Fragment>
                <ExpPanelList panels={panels()} title={'Additional Info'} />
            </React.Fragment>
        )
    }
}


const panels = () => {
    return [
    {
      id: 'p1',
      title: 'Case Information',
      component: IncidentInformation,
    },
    {
      id: 'p2',
      title: 'Policy Holders',
      component: RelatedParties
    },
    {
      id: 'p3',
      title: 'Interaction History',
      component: InteractionHistory
    },
    {
      id: 'p4',
      title: 'Claim History',
      component: ClaimHistory
    }
]};


export default StackedPanels



