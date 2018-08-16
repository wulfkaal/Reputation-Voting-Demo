import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import baseComponentStyle from '../../jss/base-component'
import Typography from '@material-ui/core/Typography'
import {Pie} from 'react-chartjs-2';

class VoteChart extends Component {
  
  render() {
    this.options = {
      responsive: true,
      animation: {
        duration: 0
      }
    }
    
    this.data = {
      datasets: [{
        data: [
          this.props.yes,
          this.props.no
        ],
        backgroundColor: [  
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',              
        ],
        borderColor: [  
          'rgba(75, 192, 192, 1)',
          'rgba(255,99,132,1)',
        ],
        label: 'Dataset 1'
      }],
      labels: [
        `YES (${this.props.yes})`,
        `NO (${this.props.no})`,
      ]
    }


    return (
      <div>
        
        <Typography variant='caption'>
          Voting Results{this.props.update}
        </Typography>
        <div 
          class="chart-container" 
          className={this.props.classes.chartContainer}>
          <Pie
            data={this.data}
            options={this.options}
            height={100}
            width={100}
            >
          </Pie>
        </div>
      </div>
    )
  }

}

export default withStyles(baseComponentStyle)(VoteChart)