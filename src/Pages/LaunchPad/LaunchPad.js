import { useState, useEffect } from 'react'
import { Button, Grid, Typography, InputBase, Container } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import Countdown from 'react-countdown'
import Header from '../../components/Header/Header'
import LogoImage from '../../assets/logo.png'
import NetroPresaleABI from '../../environment/NetroPresale.json'
import AlertModal from '../../components/AlertModal/AlertModal'
import {
  netroPresaleContractAddress,
  NETRO_DECIMALS,
} from '../../environment/config'
import './styles.scss'
import { ethers } from 'ethers'
import { useAccount, useNetwork } from 'wagmi'
import { useSnackbar } from 'notistack'

const Started = () => <span>Started!</span>
const Ended = () => <span>Ended</span>

const LaunchPad = () => {
  const startDatePeriod = 1683557244176 + 1036800000
  const endDatePeriod = startDatePeriod + 5000000000

  const { chain } = useNetwork()
  const [provider, setProvider] = useState(null)
  const { enqueueSnackbar } = useSnackbar()
  const { address, isConnected } = useAccount()

  const correctNetwork = chain && chain.id === 324

  const [amount, setAmount] = useState(0)
  const [buyPossible, setBuyPossible] = useState(false)
  const [buyError, setBuyError] = useState('')
  const [loadingBuy, setLoadingBuy] = useState(false)
  const [loadingClaim, setLoadingClaim] = useState(false)
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')

  const [started, setStarted] = useState(false)
  const [tokenPerEth, setTokenPerEth] = useState('')
  const [finished, setFinished] = useState(true)
  const [maxCommit, setMaxCommit] = useState(0)
  const [minCommit, setMinCommit] = useState(0)
  const [commitment, setCommitment] = useState(0)
  const [userClaimed, setUserClaimed] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const startDateRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      setStarted(true)
      return <Started />
    } else {
      return (
        <span>
          {days} Day : {hours} Hour : {minutes} Min : {seconds} Sec
        </span>
      )
    }
  }

  const endDateRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <Ended />
    } else {
      return (
        <span>
          {days} Day : {hours} Hour : {minutes} Min : {seconds} Sec
        </span>
      )
    }
  }

  const getProvider = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
  }

  const getNetroPresaleStatus = async () => {
    const NetroPresale = new ethers.Contract(
      netroPresaleContractAddress,
      NetroPresaleABI.abi,
      provider
    )

    const _tokenPerEth = await NetroPresale.tokenPerETH()
    setTokenPerEth(_tokenPerEth.toString())

    const _finished = await NetroPresale.finished()
    setFinished(_finished)

    const _minCommit = await NetroPresale.minCommit()
    setMinCommit(
      ethers.utils.formatUnits(_minCommit.toString(), NETRO_DECIMALS)
    )

    const _maxCommit = await NetroPresale.maxCommit()
    setMaxCommit(
      ethers.utils.formatUnits(_maxCommit.toString(), NETRO_DECIMALS)
    )

    const _commitment = await NetroPresale.commitments(address)
    setCommitment(
      ethers.utils.formatUnits(_commitment.toString(), NETRO_DECIMALS)
    )

    const _userClaimed = await NetroPresale.userClaimed(address)
    setUserClaimed(_userClaimed)
  }

  const handleBuy = async () => {
    setLoadingBuy(true)
    const NetroPresale = new ethers.Contract(
      netroPresaleContractAddress,
      NetroPresaleABI.abi,
      provider
    )

    const walletSigner = provider.getSigner(address)
    const signer = NetroPresale.connect(walletSigner)

    try {
      const tx = await signer.commit({ value: ethers.utils.parseEther(amount) })
      enqueueSnackbar(`Transaction has been submited. Tx hash: ${tx.hash}`, {
        variant: 'info',
        autoHideDuration: 5000,
        style: {
          backgroundColor: '#202946',
        },
      })

      tx.wait().then(() => {
        setLoadingBuy(false)
        handleOpen()
        setText(`You have bought ${amount * tokenPerEth} + Netro successfully.`)
        setLoadingBuy(false)
        getNetroPresaleStatus()
      })
    } catch (error) {
      console.log(error)
      setLoadingBuy(false)
    }
  }

  const handleClaim = async () => {
    setLoadingClaim(true)
    const NetroPresale = new ethers.Contract(
      netroPresaleContractAddress,
      NetroPresaleABI.abi,
      provider
    )

    const walletSigner = provider.getSigner(address)
    const signer = NetroPresale.connect(walletSigner)

    try {
      const tx = await signer.claim()
      enqueueSnackbar(`Transaction has been submited. Tx hash: ${tx.hash}`, {
        variant: 'info',
        autoHideDuration: 5000,
        style: {
          backgroundColor: '#202946',
        },
      })
      tx.wait().then(() => {
        setLoadingClaim(false)
        handleOpen()
        setText(
          `You've claimed ${commitment * tokenPerEth} + Netro successfully.`
        )
        setLoadingClaim(false)
        getNetroPresaleStatus()
      })
    } catch (error) {
      console.log(error)
      setLoadingClaim(false)
    }
  }

  useEffect(() => {
    if (correctNetwork) {
      getProvider()
    }
  }, [correctNetwork])

  useEffect(() => {
    if (provider) getNetroPresaleStatus()
  }, [provider])

  useEffect(() => {
    if (amount) {
      if (amount > Number(minCommit) && amount < Number(maxCommit)) {
        if (finished) {
          setBuyPossible(false)
          setBuyError('Presale is finished.')
        } else {
          setBuyPossible(true)
          setBuyError('')
        }
      } else {
        setBuyPossible(false)
        setBuyError('You can only buy from 0.01ETH to 10ETH.')
      }
    }
  }, [amount])

  return (
    <Grid
      className={
        open ? 'blur-background airdrop launchpad' : 'airdrop launchpad'
      }
    >
      <Header />
      <Typography
        variant='h3'
        textAlign={'center'}
        color={'white'}
        marginTop={10}
      >
        LaunchPad
      </Typography>

      <Grid container>
        <Container>
          <Grid item xs={12} sm={8} md={6} lg={4} marginX={'auto'} mt={3}>
            <Grid className='wrapper' padding={2}>
              <Grid className='header' padding={2}>
                <img
                  src={LogoImage}
                  alt='Netro logo'
                  className='project-logo'
                />
                <Typography>Netro project</Typography>
              </Grid>

              <Grid mt={3}>
                <Typography textAlign={'center'}>Softcap/Hardcap</Typography>
                <div className='progress-bar'>
                  <div className='progress'></div>
                </div>
                <Grid container justifyContent={'space-between'}>
                  <Typography fontSize={14}>10 ETH</Typography>
                  <Typography fontSize={14}>50 ETH</Typography>
                </Grid>
              </Grid>

              <Grid mt={2}>
                <Grid container justifyContent={'space-between'}>
                  <Typography>Price</Typography>
                  <Typography>1 ETH = {tokenPerEth} NETRO</Typography>
                </Grid>

                <Grid container justifyContent={'space-between'}>
                  <Typography>Starts In</Typography>
                  <Countdown
                    date={startDatePeriod}
                    renderer={startDateRenderer}
                  />
                </Grid>

                <Grid container justifyContent={'space-between'}>
                  {started ? (
                    <>
                      <Typography>Ends In</Typography>
                      <Countdown
                        date={endDatePeriod}
                        renderer={endDateRenderer}
                      />
                    </>
                  ) : (
                    <>
                      <Typography>Presale Period</Typography>
                      <Typography>7 days</Typography>
                    </>
                  )}
                </Grid>

                <Grid mt={2}>
                  <InputBase
                    placeholder='Amount'
                    fullWidth={true}
                    onChange={(e) => setAmount(e.target.value)}
                    type='number'
                    disabled={!correctNetwork || !started}
                  />
                  {buyError && amount ? (
                    <span className='amoutn_error'>{buyError}</span>
                  ) : (
                    <></>
                  )}
                  {isConnected ? (
                    <LoadingButton
                      loading={loadingBuy}
                      fullWidth={true}
                      variant='contained'
                      disabled={!buyPossible || !started}
                      onClick={handleBuy}
                    >
                      BUY
                    </LoadingButton>
                  ) : (
                    <Button variant='contained' disabled fullWidth>
                      Connect Wallet
                    </Button>
                  )}
                </Grid>

                <Grid mt={2}>
                  <LoadingButton
                    loading={loadingClaim}
                    fullWidth
                    variant='contained'
                    disabled={
                      !(finished && !userClaimed && Number(commitment) > 0)
                    }
                    onClick={handleClaim}
                  >
                    CLAIM
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>

            <Grid mt={10}>
              <Button
                fullWidth
                variant='outlined'
                href='https://docs.google.com/forms/d/e/1FAIpQLSfNeHG9rcjBPoTDU-eHfcg8_o7F45TvF0zPrRwT2KB15DV3bg/viewform'
                color='secondary'
              >
                SUBMIT YOUR PROJECT
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <AlertModal
        modalOpen={open}
        closeModal={handleClose}
        text={text}
      ></AlertModal>
    </Grid>
  )
}

export default LaunchPad
