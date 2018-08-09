import React, { Component } from 'react';
import IndexLayout from '../hocs/index-layout'
import {connect} from 'react-redux'
// import indexScreen from '../presenters/index/screen'

const mapStateToProps = (state) => {
  return {
    //implement when state needed
  }
}

const mapDispatchToProps = dispatch => {
  return {
    
  }
}

class Index extends Component {
  
  render() {
    return (
      // <indexScreen />
      <div>
        Index
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  IndexLayout(Index)
)
