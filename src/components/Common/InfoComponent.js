import React from 'react'
import { Grid } from '@material-ui/core'

class InfoComponent extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Grid container>
          <Grid item xs={2} style={styles.logo}>
            {this.props.icon}
          </Grid>
          <Grid item xs={10}>
            <div style={styles.label}>{this.props.title}</div>
            <div style={styles.value}>{this.props.value}</div>
          </Grid>
        </Grid>
        {this.props.hr && <hr />}
      </React.Fragment>
    )
  }
}

const styles = {
  logo: {
    marginTop: 15,
  },
  label: {
    fontSize: '10px',
    lineHeight: 1.6,
    textAlign: 'left',
    marginTop: '10px',
  },
  value: {
    paddingBottom: '6px',
    fontSize: '14px',
    lineHeight: 1.43,
    textAlign: 'left',
  },
}

export default InfoComponent
