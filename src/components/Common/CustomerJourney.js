import React, {Component} from "react";
import {Timeline, TimelineEvent} from 'react-event-timeline'

class CustomerJourney extends Component {
    constructor(props) {
        super(props)

        this.state = {journey:[]}
    }

    componentDidMount() {
        this.setState({
            journey: this.props.journey
        })
    }

    render() {
        let { journey } = this.state
        return (
            <Timeline>
                {journey.map(event => {
                    let Icon = event.icon
                    return (<TimelineEvent
                        title={event.title}
                        createdAt={event.timestamp}
                        icon={<Icon/>}
                        iconColor={event.iconColor || '#0d122b'}
                        key={event.id}
                    >
                        {event.body}
                    </TimelineEvent>)
                })}
            </Timeline>
        )
    }
}

export default CustomerJourney
