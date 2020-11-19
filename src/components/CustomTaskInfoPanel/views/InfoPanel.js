import React from 'react'
import {Grid} from '@material-ui/core'

import StackedPanels from '../StackedPanels'

class InfoPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
        }
    }

    componentDidCatch(error, errorInfo) {
        console.log(error)
    }

    render() {

        return (
            <React.Fragment>
                <Grid container style={styles.column} spacing={0}>
                    <Grid item xs={12}>
                        <StackedPanels/>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}

const styles = {
    panel2Container: {
        borderLeft: '1px solid #d0d0d0',
        position: 'relative',
        backgroundSize: 'cover',
        backgroundImage:
            'url(https://media.twiliocdn.com/flex/chat-demo/webchat-background.png)',
        backgroundColor: '#6d7697',
        height: '100%',
    },
    noTaskLogo: {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '175px',
        height: '180px',
        marginLeft: '-87px',
        marginTop: '-91px',
        opacity: '.6',
        background:
            'url(https://media.twiliocdn.com/flex/chat-demo/webchat-logo.svg)',
    },
    page: {
        border: '1px solid #ddd',
    },
    column: {
        height: '100%',
        textAlign: 'center',
        verticalAlign: 'center',
        borderLeft: '1px solid #BEC3CD',
        padding: 20,
    },
    padded: {
        marginRight: '20px',
    },
};

export default InfoPanel
