import { Box, Button, Container, Grid, Link, TextField, Typography, Divider } from '@mui/material';

const Profile = () => {

  return (
    <>
      <Grid
        sx={{
          marginTop: '5vh',
        }}
        container
        justifyContent='center'
      >
        <Grid
          item
          xs={2}
          md={4}
          textAlign='left'
        >
          1
        </Grid>
        <Grid
          item
          xs={2}
          md={4}
          textAlign='center'
        >
          2
        </Grid>
        <Grid
          item
          xs={2}
          md={4}
          textAlign='center'
        >
          3
        </Grid>
      </Grid>
    </>
  )
}

export default Profile