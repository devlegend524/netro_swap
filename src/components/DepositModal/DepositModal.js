import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useAccount, useNetwork } from 'wagmi'
import { Typography, Box, Modal, InputBase, Grid, Button } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import CloseIcon from '@mui/icons-material/Close'
import { useSnackbar } from 'notistack'
import { stakingContractAddress, NETRO_address, NETRO_DECIMALS } from '../../environment/config'
import StakingContractABI from '../../environment/StakingRewards.json'
import NetroTokenABI from '../../environment/Netro.json'
import './styles.scss'

const DepositModal = (props) => {
  const { modalOpen, closeModal } = props
  const { enqueueSnackbar } = useSnackbar()
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const [depositAmount, setDepositAmount] = useState('')
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState(0)
  const [balanceError, setBalanceError] = useState(false)
  const [allowance, setAllowance] = useState(0)

  const correctNetwork = chain && chain.id === 280

  const handleChange = (e) => {
    const amount = e.target.value
    if (amount === '') setDepositAmount('')
    else if (amount < 0) setDepositAmount('')
    else setDepositAmount(Number(amount))
    if (Number(balance) < Number(amount)) setBalanceError(true)
    else setBalanceError(false)
  }

  const getProvider = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
  }

  const getBalance = async () => {
    setLoading(true)
    const NETRO_contract = new ethers.Contract(NETRO_address, NetroTokenABI.abi, provider)
    const decimals = await NETRO_contract.decimals()
    const balance = await NETRO_contract.balanceOf(address)
    setBalance(ethers.utils.formatUnits(balance, decimals))
    setLoading(false)
  }

  const getAllowance = async () => {
    setLoading(true)
    const NETRO_contract = new ethers.Contract(NETRO_address, NetroTokenABI.abi, provider)
    const decimals = await NETRO_contract.decimals()
    const allowance = await NETRO_contract.allowance(address, stakingContractAddress)
    setAllowance(ethers.utils.formatUnits(allowance, decimals))
    setLoading(false)
  }

  const approve = async () => {
    setLoading(true)
    const NETRO_contract = new ethers.Contract(NETRO_address, NetroTokenABI.abi, provider)
    const walletSigner = provider.getSigner(address)
    const signer = NETRO_contract.connect(walletSigner)
    try {
      const tx = await signer.approve(
        stakingContractAddress,
        ethers.utils.parseUnits(depositAmount.toString(), NETRO_DECIMALS)
      )
      enqueueSnackbar(`Transaction has been submited. Tx hash: ${tx.hash}`, {
        variant: 'info',
        autoHideDuration: 5000,
        style: {
          backgroundColor: '#202946',
        },
      })
      const receipt = await tx.wait()
      setLoading(false)
      getAllowance()
      enqueueSnackbar(`Transaction has been confirmed. Tx hash: ${receipt.transactionHash}`, {
        variant: 'info',
        autoHideDuration: 5000,
        style: {
          backgroundColor: '#202946',
        },
      })
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const deposit = async () => {
    setLoading(true)
    const StakingContract = new ethers.Contract(
      stakingContractAddress,
      StakingContractABI.abi,
      provider
    )
    const walletSigner = provider.getSigner(address)
    const signer = StakingContract.connect(walletSigner)
    const amount = ethers.utils.parseUnits(depositAmount.toString(), NETRO_DECIMALS)

    try {
      const tx = await signer.stake(amount, { gasLimit: 3000000 })
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
    setDepositAmount('')
    setBalanceError(false)
  }, [modalOpen])

  useEffect(() => {
    if (correctNetwork) getProvider()
    else {
      setProvider(null)
      setBalance(0)
      setAllowance(0)
    }
  }, [correctNetwork, chain])

  useEffect(() => {
    if (provider) {
      getBalance()
      getAllowance()
    }
  }, [provider])

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
            Deposit NETRO
          </Typography>
          <CloseIcon onClick={closeModal} className='close-button' />
        </Grid>
        <Grid className='deposit-form'>
          <InputBase
            placeholder='0.0000'
            type='number'
            fullWidth={true}
            value={depositAmount}
            onChange={(e) => handleChange(e)}
          />
          <Typography className='balance'>Balance: {balance} NETRO</Typography>
        </Grid>
        {isConnected ? (
          <>
            {balanceError ? (
              <Button variant='contained' fullWidth={true} disabled>
                Insfficient balance
              </Button>
            ) : (
              <>
                {allowance < depositAmount ? (
                  <LoadingButton
                    loading={loading}
                    variant='contained'
                    fullWidth={true}
                    onClick={approve}
                  >
                    Approve
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    loading={loading}
                    variant='contained'
                    fullWidth={true}
                    onClick={deposit}
                    disabled={depositAmount === '' || !depositAmount}
                  >
                    Deposit
                  </LoadingButton>
                )}
              </>
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

export default DepositModal
