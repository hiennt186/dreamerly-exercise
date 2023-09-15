// ** MUI Imports
import { Box, IconButton, TextField } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Send } from 'mdi-material-ui'

const ChatContent = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Grid
        container
        sx={{ flex: 1, p: 4, flexDirection: 'column-reverse', flexWrap: 'nowrap', overflowY: 'auto' }}
        gap={2}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(item => (
          <Grid
            item
            sx={{
              bgcolor: item % 2 === 0 ? 'primary.main' : 'grey.A100',
              color: item % 2 === 0 ? 'white' : 'black',
              p: 2,
              borderRadius: 1,
              alignSelf: item % 2 === 0 ? 'flex-end' : 'flex-start',
              ml: item % 2 === 0 ? 16 : 0,
              mr: item % 2 === 0 ? 0 : 16
            }}
            key={item}
          >
            At netus mattis luctus purus litora pede fames arcu viverra iaculis id parturient elit ultricies quam
            sociosqu justo nunc porta ex eros auctor tristique pretium imperdiet sodales vitae metus nam et donec
            lacinia sed venenatis bibendum morbi quis pulvinar consequat sagittis mi lacus hendrerit per vivamus potenti
            erat fusce inceptos
          </Grid>
        ))}
      </Grid>
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'grey.300' }}>
        <form onSubmit={e => e.preventDefault()}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField fullWidth />
            <IconButton size='large' sx={{ ml: 4 }} type='submit'>
              <Send fontSize='large' color='primary' />
            </IconButton>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default ChatContent
