import React, {Component} from 'react'
import {Actions} from '@twilio/flex-ui';
import {
    Paper,
    Modal,
    Backdrop,
    Fade,
    Grid,
    TextField,
    Typography,
    Button,
    InputAdornment,
    Divider
} from '@material-ui/core'

export default class SendMessageModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toNumber: ''
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleClick() {
        console.log(this.state.toNumber)

        Actions.invokeAction('RunFunction', {
            baseURL: 'https://lrobinson.ngrok.io',
            path: '/FlexOutboundSMS',
            eventData: {
            "toNumber": '+1' + this.state.toNumber
        }})
            .then(res => {
                console.log(res.body)
                this.props.handleClose()
                })
            .catch(e => console.log(e))
    }

    handleChange(event) {
        this.setState({[event.target.name]:event.target.value})

    };

    render() {
        return (

            <Modal height={'25%'}
                   style={styles.modal}
                   aria-labelledby="transition-modal-title"
                   aria-describedby="transition-modal-description"
                // className={classes.modal}
                   open={this.props.modalOpen}
                   onClose={this.props.handleClose}
                   closeAfterTransition
                   BackdropComponent={Backdrop}
                   BackdropProps={{
                       timeout: 500,
                   }}
            >
                <Fade in={this.props.modalOpen}>
                    <Paper
                        style={styles.container}
                    >
                        <Grid
                            container
                            direction={'column'}
                            justify="space-around"
                            alignItems="stretch"
                        >
                            <Typography variant={'h5'} style={styles.TextField}>
                                Send SMS
                            </Typography>
                            <Divider light/>
                            <TextField
                                name={'toNumber'}
                                component={Grid} item
                                style={styles.TextField}
                                required id="phone"
                                label="Number"
                                variant="outlined"
                                onChange={this.handleChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+1</InputAdornment>,
                                }}
                            />
                            <Button


                                color={'primary'}
                                onClick={this.handleClick}
                            >
                                Send
                            </Button>
                        </Grid>
                    </Paper>
                </Fade>
            </Modal>
        )
    }
}

const styles = {
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

    },
    container: {
        display: 'flex',
        padding: '20px'
    },
    TextField: {
        padding: '10px'
    },
    Grid: {
        padding: '10px'
    }

}

// export default { SendMessageModal }
