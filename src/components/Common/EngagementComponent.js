import React from 'react'
import { Grid } from '@material-ui/core'
import Moment from 'react-moment'

// icons

import {
  FaFacebookMessenger,
  FaLine,
  FaWhatsapp,
  FaFontAwesome,
  FaComment,
  FaCompass,
  FaCommentDots,
  FaPhone,
  FaArrowRight,
  FaArrowLeft,
  FaTicketAlt,
} from 'react-icons/fa'




class EngagementComponent extends React.Component {
  render() {
    var directionIcon =
      this.props.direction == 'inbound' ? FaArrowRight : FaArrowLeft

    var typeIcon = null

    switch (this.props.channelType) {
      case 'sms':
        typeIcon = FaComment
        break
      case 'voice':
        typeIcon = FaPhone
        break
      case 'messenger':
        typeIcon = FaFacebookMessenger
        break
      case 'line':
        typeIcon = FaLine
        break
      case 'web':
        typeIcon = FaCommentDots
        break
      case 'website':
        typeIcon = FaCompass
        break
      case 'whatsapp':
        typeIcon = FaWhatsapp
        break
      case 'ticket':
        typeIcon = FaTicketAlt
        break
    }

    return (
      <React.Fragment>
        <Grid container>
          <Grid item xs={2} style={styles.logo}>
            {/* {this.props.icon} */}
            <span className='fa-layers fa-fw'>
              <FaFontAwesome icon={typeIcon} size='lg' />
              <FaFontAwesome
                icon={directionIcon}
                transform='left-18 shrink-6'
                pull='left'
              />
            </span>
          </Grid>
          <Grid item xs={10}>
            <div style={styles.label}>
              <Moment local format='MM/DD/YYYY  hh:mma z'>
                {this.props.timestamp}
              </Moment>
            </div>
            <div style={styles.value}>{this.props.description}</div>
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

export default EngagementComponent
