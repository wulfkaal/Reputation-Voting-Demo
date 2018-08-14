import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import baseComponentStyle from '../../jss/base-component'
import Typography from '@material-ui/core/Typography'
import Chart from 'chart.js'

class VoteChart extends Component {
  
  componentDidMount() {
    const ctx = this.refs.canvas.getContext('2d');
        
    let config = {
			type: 'pie',
			data: {
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
			},
			options: {
				responsive: true
			}
		}
    
    new Chart(ctx, config)
  }
  
  render() {
    
    return (
      <div>
        <Typography variant='caption'>
          Voting Results
        </Typography>
        <div 
          class="chart-container" 
          className={this.props.classes.chartContainer}>
          <canvas 
            id="voteChart"
            ref="canvas" 
            width="100" 
            height="100"></canvas>
        </div>
      </div>
    )
  }

}

export default withStyles(baseComponentStyle)(VoteChart)