import React, { useEffect, useState } from 'react'
import { Container, Grid, Typography } from '@mui/material'
import { ethers } from 'ethers'
import { useNetwork } from 'wagmi'
import Header from '../../components/Header/Header'
import './styles.scss'
import FarmBox from '../../components/FarmBox/FarmBox'

const FarmPage = () => {
  const { chain } = useNetwork()
  const [provider, setProvider] = useState(null)

  const correctNetwork = chain && chain.id === 280

  const [modalOpen, setModalOpen] = React.useState(false)

  const getProvider = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
  }

  useEffect(() => {
    if (correctNetwork) {
      getProvider()
    }
  }, [correctNetwork, chain])

  return (
    <Grid className={modalOpen ? 'blur-background' : ''}>
      <Header />
      <Container className='farm-container'>
        <Typography variant='h4'>Farming</Typography>

        <Grid container spacing={2}>
          <FarmBox provider={provider} setModalOpen={(value) => setModalOpen(value)} />
          <FarmBox provider={provider} setModalOpen={(value) => setModalOpen(value)} />
          <FarmBox provider={provider} setModalOpen={(value) => setModalOpen(value)} />
          <FarmBox provider={provider} setModalOpen={(value) => setModalOpen(value)} />
          <FarmBox provider={provider} setModalOpen={(value) => setModalOpen(value)} />
          <FarmBox provider={provider} setModalOpen={(value) => setModalOpen(value)} />
        </Grid>
      </Container>
    </Grid>
  )
}

export default FarmPage
