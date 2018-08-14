export default theme => (
  {
    paper: {
      overflow: 'hidden',
      padding: '5px'
    },
    button: {
      margin: theme.spacing.unit,
    },
    contentLeft: {
      textAlign: 'left'
    },
    contentRight: {
      textAlign: 'right'
    },
    contentCenter: {
      textAlign: 'center'
    },
    cardWithHeader: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'visible'
    },
    cardHeader: {
      backgroundColor: theme.palette.subPrimary.main,
      marginTop: '-15px',
      marginLeft: '10px',
      marginRight: '10px',
      borderRadius: '5px',
    },
    cardHeaderContent: {
      color: theme.palette.primary.contrastText,
    },
    cardContent: {
      paddingTop: '30px',
      paddingLeft: '30px',
      paddingRight: '30px',
    },
    inputFullWidth: {
      width: '100%'
    }
  }
)