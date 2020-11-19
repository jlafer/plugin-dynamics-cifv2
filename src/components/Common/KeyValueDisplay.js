import React from "react";
import { Grid } from "@material-ui/core";

class KeyValueDisplay extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Grid container style={styles.container}>
          <Grid item xs={12} md={6}>
            {this.props.bold && <div style={styles.labelBold}>{this.props.left}</div>}
            {!this.props.bold && <div style={styles.label}>{this.props.left}</div>}
          </Grid>
          <Grid item xs={12} md={6}>
            {this.props.bold && <div style={styles.valueBold}>{this.props.right}</div>}
            {!this.props.bold && <div style={styles.value}>{this.props.right}</div>}
          </Grid>
        </Grid>
        {this.props.hr && <hr />}
      </React.Fragment>
    );
  }
}

const styles = {
  container: {
    fontFamily: "Open Sans",
    fontSize: "12px",
    lineHeight: 1.67,
    marginBottom: "5px"
  },
  label: {
    textAlign: "left"
  },
  value: {
    textAlign: "right"
  },
  labelBold: {
    fontSize: "13px",
    fontWeight: "bold",
    lineHeight: 1.23,
    textAlign: "left"
  },
  valueBold: {
    fontSize: "13px",
    fontWeight: "bold",
    lineHeight: 1.23,
    textAlign: "right"
  }
};

export default KeyValueDisplay;
