import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useAccount, useNetwork } from 'wagmi'
import { Typography, Box, Modal, InputBase, Grid, Button } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import CloseIcon from '@mui/icons-material/Close'
import { useSnackbar } from 'notistack'
import { stakingContractAddress, NETRO_DECIMALS } from '../../environment/config'
import StakingContractABI from '../../environment/StakingRewards.json'
import './styles.scss'

const WithDrawModal = (props) => {
  const { modalOpen, closeModal, userStake } = props
  const { enqueueSnackbar } = useSnackbar()
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(false)
  const [balanceError, setBalanceError] = useState(false)

  const correctNetwork = chain && chain.id === 280

  const handleChange = (e) => {
    const amount = e.target.value
    if (amount === '') setWithdrawAmount('')
    else if (amount < 0) setWithdrawAmount('')
    else setWithdrawAmount(Number(amount))
    if (Number(userStake) < Number(amount)) setBalanceError(true)
    else setBalanceError(false)
  }

  const getProvider = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
  }

  const withdraw = async () => {
    setLoading(true)
    const StakingContract = new ethers.Contract(
      stakingContractAddress,
      StakingContractABI.abi,
      provider
    )

    const walletSigner = provider.getSigner(address)
    const signer = StakingContract.connect(walletSigner)
    const amount = ethers.utils.parseUnits(withdrawAmount.toString(), NETRO_DECIMALS)

    try {
      const tx = await signer.withdraw(amount)
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
      closeModal()
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    setWithdrawAmount('')
    setBalanceError(false)
  }, [modalOpen])

  useEffect(() => {
    if (correctNetwork) getProvider()
    else setProvider(null)
  }, [correctNetwork, chain])

  return (
    <Modal
      open={modalOpen}
      onClose={closeModal}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box className='modalBox'>
        <Grid justifyContent={'space-between'} container alignItems={'center'}>
          <Typography variant='h6' component='h2' color={'white'}>
            Withdraw
          </Typography>
          <CloseIcon onClick={closeModal} className='close-button' />
        </Grid>
        <Grid className='withdraw-form'>
          <InputBase
            placeholder='0.0000'
            type='number'
            fullWidth={true}
            value={withdrawAmount}
            onChange={(e) => handleChange(e)}
          />
          <Typography className='balance'>Your Stake: {userStake} NETRO</Typography>
        </Grid>
        {isConnected ? (
          <>
            {balanceError ? (
              <Button variant='contained' fullWidth={true} disabled>
                Insfficient balance
              </Button>
            ) : (
              <LoadingButton
                loading={loading}
                variant='contained'
                fullWidth={true}
                onClick={withdraw}
                disabled={withdrawAmount === '' || !withdrawAmount}
              >
                Withdraw
              </LoadingButton>
            )}
          </>
        ) : (
          <Button variant='contained' fullWidth={true} disabled>
            Connet wallet
          </Button>
        )}
      </Box>
    </Modal>
  )
}

export default WithDrawModal
