import React, {Component} from 'react'
import {
    Backdrop,
    Divider,
    Fade,
    IconButton,
    Modal,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions
} from '@material-ui/core'
import {Actions, withTaskContext} from "@twilio/flex-ui";
import {MdSms} from "react-icons/all";


class SmsButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
        this.handleClose = this.handleClose.bind(this)
        this.handleOpen = this.handleOpen.bind(this)
        this.clickToSms = this.clickToSms.bind(this)
    }

    handleOpen = () => {
        this.setState({
            open:true
        })
    }
    handleClose = () => {
        this.setState({
            open:false
        })
    }

    clickToSms = () => {
        console.log(this.state.toNumber)
        const {destinationNumber, name} = this.props
        Actions.invokeAction('RunFunction', {
            path: '/FlexSmsToTask',
            eventData: {
                "toNumber": destinationNumber,
                "toName": name
            }})
            .then(res => {
                console.log(res.body)
                this.handleClose()
            })
            .catch(e => console.log(e))
    };

    render() {
        let {destinationNumber, name, confirmation} = this.props
        if (!name || name==='') name = destinationNumber
        let { open } = this.state

        return (
            <React.Fragment>
                <IconButton
                    style={styles.button}
                    color="primary"
                    variant={'outlined'}
                    onClick={confirmation ? this.handleOpen : this.clickToSms}
                >
                    <MdSms/>
                </IconButton>
                <Modal //height={'25%'}
                    style={styles.modal}
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"

                    open={ open }
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={open}>
                            <Card
                            >
                                <CardContent>
                                <Typography variant={'h5'} style={styles.TextField}>
                                    {`Are you sure you want to send ${name} a message?`}
                                </Typography>
                                </CardContent>
                                <Divider light/>
                                <CardActions style={styles.center}>
                                    <Button
                                        xs={6}
                                        color={'primary'}
                                        onClick={this.clickToSms}
                                    >
                                        Open Messenger
                                    </Button>
                                    <Button
                                        xs={6}
                                        color={'secondary'}
                                        onClick={this.handleClose}
                                    >
                                        Cancel
                                    </Button>
                                    </CardActions>
                            </Card>
                    </Fade>
                </Modal>

            </React.Fragment>

        )
    }
}

SmsButton.defaultProps = {
    destinationNumber:'',
    name:'',
    confirmation:false

}

const styles = {
    button: {
        color: '#233659',
        // backgroundColor: '#233659',
        // 'align-self': 'center',
        // display: 'flex',
        // 'margin': '10px'
    },
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
    },
    center: {
        justifyContent: 'center'
        // justifyContent: 'center',
    }
}

export default withTaskContext(SmsButton)
