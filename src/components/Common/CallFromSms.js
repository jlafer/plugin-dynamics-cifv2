import * as React from 'react'
import {Actions, withTaskContext} from '@twilio/flex-ui'
import {IconButton} from '@material-ui/core'
import {MdCall} from "react-icons/all";

export class CallFromSms extends React.Component {

    clickToDial = (attrs) => {
        const destinationNumber = attrs.direction === 'outbound' ?
            attrs.to :
            attrs.from || attrs.name
        Actions.invokeAction("StartOutboundCall", {
            destination: destinationNumber
        });
    };

    render() {

        const task = this.props.task || {}
        console.log('current task', task)
        const attrs = task.attributes || null
        console.log('CallFromSms', attrs)
        return (
            // !this.props.task || !attrs ||
            task.channelType === 'voice' ? null :
                // attrs.direction === 'outbound' && !attrs.to ? null :
                //     !attrs.from ? null :

                        (<IconButton
                            style={styles.avatar}
                            onClick={() => this.clickToDial(attrs)}
                        >

                            <MdCall/>
                        </IconButton>)
        )
    }
}

const styles = {
    avatar: {
        color: '#fff',
        backgroundColor: '#233659',
        'align-self':'center',
        display: 'flex',
        'margin-left': '10px'

    }
}

export default withTaskContext(CallFromSms)
