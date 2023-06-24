import { useEffect, useState } from 'react'
import { Button, Container, Grid, InputBase, Typography } from '@mui/material'
import { ethers } from 'ethers'
import validator from 'validator'
import Header from '../../components/Header/Header'
import AlertModal from '../../components/AlertModal/AlertModal'
import './styles.scss'

const Airdrop = () => {
  const [open, setOpen] = useState(false)
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [validAddress, setValidAddress] = useState(false)
  const [validEmail, setValidEmail] = useState(false)

  useEffect(() => {
    setValidEmail(validator.isEmail(email))
  }, [email])

  useEffect(() => {
    setValidAddress(ethers.utils.isAddress(address))
  }, [address])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Container
      maxWidth={'fixed'}
      className={open ? 'blur-background airdrop' : 'airdrop'}
    >
      <Header />
      <Typography
        variant='h3'
        textAlign={'center'}
        color={'white'}
        marginTop={10}
      >
        Airdrop
      </Typography>

      <Grid container>
        <Grid item xs={12} sm={8} md={6} lg={4} marginX={'auto'} mt={3}>
          <Grid className='wrapper' padding={2}>
            <Grid className='header' padding={2}>
              <Typography variant='h5'>Netro Airdrop</Typography>
              <Typography>$100 worth of NETRO to 100 lucky winners</Typography>
            </Grid>

            <Grid container justifyContent={'space-between'} mt={2}>
              <Typography>Airdrop registration starts:</Typography>
              <Typography>May 10, 3:00 PM</Typography>
            </Grid>

            <Grid container justifyContent={'space-between'}>
              <Typography>Registration ends:</Typography>
              <Typography>Ends in 7 days</Typography>
            </Grid>

            <Grid mt={2}>
              <Typography>To join this airdrop you'll need:</Typography>
              <Typography className='label' mt={1}>
                Wallet address:
              </Typography>
              <InputBase
                placeholder='0x00000....0000'
                fullWidth={true}
                onChange={(e) => setAddress(e.target.value)}
                error={address.length && !validAddress ? true : false}
              />

              <Typography className='label' mt={1}>
                Email Address:
              </Typography>
              <InputBase
                placeholder='Email address'
                fullWidth={true}
                onChange={(e) => setEmail(e.target.value)}
                error={email.length && !validEmail ? true : false}
              />
            </Grid>

            <Grid mt={2}>
              <Button
                fullWidth
                variant='contained'
                onClick={handleOpen}
                disabled={!validEmail || !validAddress}
              >
                JOIN
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <AlertModal
        modalOpen={open}
        closeModal={handleClose}
        text='Congratulations! You are whitelisted for the upcoming events!'
      ></AlertModal>
    </Container>
  )
}

export default Airdrop
