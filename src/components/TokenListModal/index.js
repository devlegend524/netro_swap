import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTradeFrom, setTradeTo } from '../../redux/actions'
import { Typography, Box, Modal, InputBase, Grid } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Scrollbars } from 'rc-scrollbars'
import { tokenList } from '../../environment/tokenList.js'
import './styles.scss'

const TokenListModal = (props) => {
  const dispatch = useDispatch()
  const tradeInfo = useSelector((RootState) => RootState.trade)

  const { modalOpen, closeModal, modalKey, changeBalance } = props
  const [tokens, setTokens] = useState(tokenList)

  const searchToken = (e) => {
    const keyword = e.target.value
    const filtered = tokenList.filter((token, index) => {
      return token.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1
    })
    setTokens(filtered)
  }

  const changeTrade = (token) => {
    if (modalKey === 'from') {
      if (token.name === tradeInfo.to.name) {
        changeBalance()
        dispatch(setTradeTo(tradeInfo.from))
        dispatch(setTradeFrom(token))
      } else dispatch(setTradeFrom(token))
    } else {
      if (token.name === tradeInfo.from.name) {
        changeBalance()
        dispatch(setTradeFrom(tradeInfo.to))
        dispatch(setTradeTo(token))
      } else dispatch(setTradeTo(token))
    }
    closeModal()
  }

  return (
    <Modal
      open={modalOpen}
      onClose={closeModal}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box className='tokenSelectModalBox'>
        <Grid justifyContent={'space-between'} container alignItems={'center'}>
          <Typography variant='h6' component='h2' color={'white'}>
            Select a Token
          </Typography>
          <CloseIcon onClick={closeModal} className='close-button' />
        </Grid>
        <Grid className='search-box'>
          <InputBase
            placeholder='Search token name or address'
            onKeyUp={(e) => searchToken(e)}
            fullWidth={true}
          />
          <SearchOutlinedIcon className='search-icon' />
        </Grid>
        <hr />
        <Grid container direction='column'>
          <Scrollbars
            style={{ height: 300 }}
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
          >
            {tokens.map((token, index) => {
              return (
                <React.Fragment key={index}>
                  {(tradeInfo.from.name === token.name && modalKey === 'from') ||
                  (tradeInfo.to.name === token.name && modalKey === 'to') ? (
                    <Grid
                      item
                      container
                      key={index}
                      className='token-item disabled'
                      alignItems={'center'}
                    >
                      <img src={token.icon} alt='icon' className='token-icon' />
                      {token.name}
                    </Grid>
                  ) : (
                    <Grid
                      item
                      container
                      key={index}
                      className='token-item'
                      onClick={() => changeTrade(token)}
                      alignItems={'center'}
                    >
                      <img src={token.icon} alt='icon' className='token-icon' />
                      {token.name}
                    </Grid>
                  )}
                </React.Fragment>
              )
            })}
          </Scrollbars>
        </Grid>
      </Box>
    </Modal>
  )
}

export default TokenListModal
