import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTradeFrom, setTradeTo } from "../../redux/actions";
import { Typography, Box, Modal, InputBase, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Scrollbars } from "rc-scrollbars";
// import { tokenList } from '../../environment/tokenList.js'
import "./styles.scss";
import defaultImg from "../../assets/erc20.png";

const TokenListModal = (props) => {
  const tokenList = Object.entries(props.tokenList);

  const dispatch = useDispatch();
  const tradeInfo = useSelector((RootState) => RootState.trade);

  const { modalOpen, closeModal, modalKey, changeBalance } = props;
  const [tokens, setTokens] = useState([]);
  const searchToken = (e) => {
    const keyword = e.target.value;
    const filtered = tokenList.filter((token, index) => {
      return token[1].name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
    });

    setTokens(filtered);
  };

  const changeTrade = (token) => {
    if (modalKey === "from") {
      if (token.symbol === tradeInfo.to.symbol) {
        changeBalance();
        dispatch(setTradeTo(tradeInfo.from));
        dispatch(setTradeFrom(token));
      } else dispatch(setTradeFrom(token));
    } else {
      if (token.symbol === tradeInfo.from.symbol) {
        changeBalance();
        dispatch(setTradeFrom(tradeInfo.to));
        dispatch(setTradeTo(token));
      } else dispatch(setTradeTo(token));
    }
    closeModal();
  };
  const addDefaultImg = (e) => {
    e.target.src = defaultImg;
  };
  useEffect(() => {
    setTokens(tokenList);
  }, [props.tokenList]);

  return (
    <Modal
      open={modalOpen}
      onClose={closeModal}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box className='tokenSelectModalBox'>
        <Grid justifyContent={"space-between"} container alignItems={"center"}>
          <Typography variant='h6' component='h2' color={"white"}>
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
            {tokens &&
              tokens.map((token, index) => {
                return (
                  <React.Fragment key={index}>
                    {(tradeInfo.from.symbol === token[1].symbol &&
                      modalKey === "from") ||
                    (tradeInfo.to.symbol === token[1].symbol &&
                      modalKey === "to") ? (
                      <Grid
                        item
                        container
                        key={index}
                        className='token-item disabled'
                        alignItems={"center"}
                      >
                        <img
                          src={token[1].logoURI}
                          alt='icon'
                          className='token-icon'
                          onError={(element) => {
                            addDefaultImg(element);
                          }}
                        />
                        {token[1].symbol}
                      </Grid>
                    ) : (
                      <Grid
                        item
                        container
                        key={index}
                        className='token-item'
                        onClick={() => changeTrade(token[1])}
                        alignItems={"center"}
                      >
                        <img
                          src={token[1].logoURI}
                          alt='icon'
                          className={" token-icon"}
                          onError={(element) => {
                            addDefaultImg(element);
                          }}
                        />
                        {token[1].symbol}
                      </Grid>
                    )}
                  </React.Fragment>
                );
              })}
          </Scrollbars>
        </Grid>
      </Box>
    </Modal>
  );
};

export default TokenListModal;
