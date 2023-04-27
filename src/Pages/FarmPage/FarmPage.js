import React, { useEffect, useState } from 'react'
import { Container, Grid, Typography, Button } from '@mui/material'
import { ethers } from 'ethers'
import { useAccount, useNetwork } from 'wagmi'
import { useSnackbar } from 'notistack'
import LoadingButton from '@mui/lab/LoadingButton'
import Header from '../../components/Header/Header'
import DepositModal from '../../components/DepositModal/DepositModal'
import { stakingContractAddress, NETRO_DECIMALS } from '../../environment/config'
import StakingContractABI from '../../environment/StakingRewards.json'
import './styles.scss'
import WithDrawModal from '../../components/WithDrawModal/WithDrawModal'

const FarmPage = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [provider, setProvider] = useState(null)
  const [totalStaked, setTotalStaked] = useState(0)
  const [APY, setAPY] = useState(0)
  const [userStake, setUserStake] = useState(0)
  const [userEarned, setUserEarned] = useState(0)
  const [loading, setLoading] = useState(false)

  const correctNetwork = chain && chain.id === 280

  // Deposit modal option
  const [dModalOpen, setDModalOpen] = React.useState(false)
  const [wModalOpen, setWModalOpen] = React.useState(false)

  const getProvider = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
  }

  const getStakeStatus = async () => {
    const StakingContract = new ethers.Contract(
      stakingContractAddress,
      StakingContractABI.abi,
      provider
    )
    // get total staked balance
    const totalSupply = await StakingContract.totalSupply()
    setTotalStaked(ethers.utils.formatUnits(totalSupply, NETRO_DECIMALS))

    // get farming APY
    const APY = await StakingContract.rewardRate()
    setAPY(APY.toString())

    // get user stake
    const stake = await StakingContract.balanceOf(address)
    setUserStake(ethers.utils.formatUnits(stake.toString(), NETRO_DECIMALS))

    // get earned
    const earned = await StakingContract.earned(address)
    setUserEarned(ethers.utils.formatUnits(earned.toString(), 6))
  }

  const claim = async () => {
    setLoading(true)
    const StakingContract = new ethers.Contract(
      stakingContractAddress,
      StakingContractABI.abi,
      provider
    )

    const walletSigner = provider.getSigner(address)
    const signer = StakingContract.connect(walletSigner)

    try {
      const tx = await signer.getReward()
      enqueueSnackbar(`Transaction has been submited. Tx hash: ${tx.hash}`, {
        variant: 'info',
        autoHideDuration: 5000,
        style: {
          backgroundColor: '#202946',
        },
      })
      const receipt = await tx.wait()
      setLoading(false)
      enqueueSnackbar(`Transaction has been confirmed. Tx hash: ${receipt.transactionHash}`, {
        variant: 'info',
        autoHideDuration: 5000,
        style: {
          backgroundColor: '#202946',
        },
      })
      getStakeStatus()
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (correctNetwork) {
      getProvider()
    } else {
      setTotalStaked(0)
      setAPY(0)
      setUserStake(0)
      setUserEarned(0)
      setProvider(null)
    }
  }, [correctNetwork, chain])

  useEffect(() => {
    if (provider) getStakeStatus()
  }, [provider, dModalOpen, wModalOpen])

  return (
    <Grid className={dModalOpen ? 'blur-background' : ''}>
      <Header />
      <Container className='farm-container'>
        <Typography variant='h4'>Farming</Typography>

        <Grid container justifyContent={'center'}>
          <Grid item xs={12} sm={8} md={5} lg={4} className='wrapper'>
            <Grid container className='header'>
              <Grid item xs={6}>
                <Typography>Total staked</Typography>
                <Typography>{Number(totalStaked).toFixed(2)} NETRO</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className='text-right'>Farming APY</Typography>
                <Typography className='text-right'>{APY} %</Typography>
              </Grid>

              <div className='icon-group'>
                <img src='/assets/eth.png' alt='eth icon' srcSet='' />
                <img src='/assets/usdc.png' alt='usdc icon' srcSet='' />
              </div>
            </Grid>
            <Typography className='description'>Deposit NETRO and earn USDC</Typography>

            <Grid className='reward-detail'>
              <Grid container justifyContent={'space-between'}>
                <Typography className='sub-title'>Your stake</Typography>
                <Typography className='reward-value'>{userStake} NETRO</Typography>
              </Grid>

              <Grid container justifyContent={'space-between'}>
                <Typography className='sub-title'>Netro reward</Typography>
                <Typography className='reward-value'>{userEarned} USDC</Typography>
              </Grid>
            </Grid>

            <Grid container className='button-wrapper' spacing={2}>
              <Grid item xs={12}>
                <Button
                  variant='contained'
                  onClick={() => setDModalOpen(true)}
                  fullWidth
                  disabled={!correctNetwork}
                >
                  Deposit
                </Button>
              </Grid>

              <Grid item xs={6}>
                <Button
                  variant='contained'
                  onClick={() => setWModalOpen(true)}
                  fullWidth
                  disabled={!correctNetwork}
                >
                  Withdraw
                </Button>
              </Grid>

              <Grid item xs={6}>
                <LoadingButton
                  loading={loading}
                  variant='contained'
                  fullWidth={true}
                  onClick={claim}
                  disabled={!correctNetwork}
                >
                  Claim
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <DepositModal modalOpen={dModalOpen} closeModal={() => setDModalOpen(false)} />
      <WithDrawModal
        modalOpen={wModalOpen}
        closeModal={() => setWModalOpen(false)}
        userStake={userStake}
      />
    </Grid>
  )
}

export default FarmPage
