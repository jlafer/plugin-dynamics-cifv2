
/** Cannot Use at this time, Material-UI is not on the correct version **/

import React, {Component} from 'react'
import {SpeedDial, SpeedDialIcon, SpeedDialAction} from '@material-ui/core'
import {MdSms, MdPhone} from "react-icons/all";

class SpeedDIal extends Component {
    constructor(props) {
        super(props)

    }

    handleClose = () => {
        this.setState({dialOpen:false})
    };

    handleOpen = () => {
        this.setState({dialOpen:true})
    };

    render() {
        return (
            <React.Fragment>
                <SpeedDial
                    ariaLabel="SpeedDial"
                    className={styles.speedDial}
                    hidden={false}
                    icon={<SpeedDialIcon />}
                    onClose={this.handleClose}
                    onOpen={this.handleOpen}
                    open={this.state.dialOpen}
                    direction={'left'}
                >
                    {actions.map(action => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={this.handleClose}
                        />
                    ))}
                </SpeedDial>
            </React.Fragment>
        )
    }

}

const actions = [
    { icon: <MdSms />, name: 'Send SMS' },
    { icon: <MdPhone />, name: 'Make Call' },

];

const styles = {

    speedDial: {
        position: 'absolute',

        bottom: '20px',
        right: '20px',
        // top: '20px',
        // left: '20px',

    },
};


// export default SpeedDIal
