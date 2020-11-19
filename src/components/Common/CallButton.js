import * as React from 'react'
import {Actions, withTaskContext} from '@twilio/flex-ui'
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
import {MdCall} from "react-icons/all";

export class CallButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
        this.handleClose = this.handleClose.bind(this)
        this.handleOpen = this.handleOpen.bind(this)
        this.clickToDial = this.clickToDial.bind(this)
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

    clickToDial = () => {
        const {destinationNumber} = this.props
        Actions.invokeAction("StartOutboundCall", {
            destination: destinationNumber
        });
    };

    render() {
        let {destinationNumber, name, confirmation} = this.props
        if (!name || name==='')
            name = destinationNumber
        let { open } = this.state

        return (
            <React.Fragment>
                <IconButton
                    style={styles.button}
                    color="primary"
                    variant={'outlined'}
                    onClick={confirmation ? this.handleOpen : this.clickToDial()}
                >
                    <MdCall/>
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

                            <Card>
                                <CardContent>
                                <Typography variant={'h5'} style={styles.TextField}>
                                    {`Are you sure you want to call ${name}?`}
                                </Typography>
                                </CardContent>
                                <Divider light/>
                                <CardActions style={styles.center}>
                                <Button
                                    color={'primary'}
                                    onClick={this.clickToDial}
                                >
                                    Call
                                </Button>
                                <Button
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

CallButton.defaultProps = {
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



export default withTaskContext(CallButton)
