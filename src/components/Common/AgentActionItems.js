import React from 'react'
import {Checkbox, FormControlLabel, Grid, Typography, Paper} from '@material-ui/core';


export default class AgentActionItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError:false
        };
        this.handleCheck = this.handleCheck.bind(this)
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ hasError: true });
        console.log(error)
    }

    handleCheck(e) {
        const item = e.target.name;
        const isChecked = e.target.checked;
        this.setState({[item]: isChecked });
    }

    render() {

        const { actionItems } = this.props;

        return (
            <React.Fragment>
                <Grid container direction={'column'} xs={12} style={styles.clientNotesContainer} >
                    {actionItems.map(item => {
                        const itemLabel = item.label

                        return (
                            <FormControlLabel xs={12} control={
                                <Checkbox
                                    name={item.name}
                                    checked = {this.state[itemLabel] || false}>
                                    onChange={this.handleCheck}
                                </Checkbox>
                            } label={item.label}>
                            </FormControlLabel>
                        )
                    })}
                </Grid>
            </React.Fragment>
        )
    }
}

const styles = {
    clientNotesContainer: {
        backgroundColor: '#f3f3f3',
    }
};
