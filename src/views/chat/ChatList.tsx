// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const ChatList = () => {
  return (
    <Grid
      container
      sx={{
        borderRight: 1,
        borderColor: 'grey.300',
        p: 4,
        height: '100%',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        overflowY: 'auto'
      }}
      gap={2}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(item => (
        <Grid
          item
          key={item}
          sx={{
            cursor: 'pointer',
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'grey.100'
            },
            bgcolor: item === 1 ? 'grey.100' : 'white',
            transition: 0.5,
            px: 4,
            py: 2
          }}
        >
          <Typography variant='body1'>Hien Nguyen Trong</Typography>
          <Typography
            variant='body2'
            sx={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflowX: 'hidden'
            }}
          >
            At netus mattis luctus purus litora pede fames arcu viverra iaculis id parturient elit ultricies quam
            sociosqu justo nunc porta ex eros auctor tristique pretium imperdiet sodales vitae metus nam et donec
            lacinia sed venenatis bibendum morbi quis pulvinar consequat sagittis mi lacus hendrerit per vivamus potenti
            erat fusce inceptos
          </Typography>
          <Typography variant='overline'>09/15/2023</Typography>
        </Grid>
      ))}
    </Grid>
  )
}

export default ChatList
