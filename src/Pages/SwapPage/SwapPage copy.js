import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  InputBase
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SwapCallsOutlinedIcon from "@mui/icons-material/SwapCallsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useAccount, useNetwork } from "wagmi";
import { ethers } from "ethers";
import { setTradeFrom, setTradeTo } from "../../redux/actions";
import TokenListModal from "../../components/TokenListModal";
import ABI from "../../environment/ERC20_ABI.json";
import Header from "../../components/Header/Header";
import SlippageModal from "../../components/Slippage/SlippageModal";
import { PROTOCOL_LIST } from "../../environment/config";
import "./styles.scss";

const SwapPage = () => {
  const dispatch = useDispatch();
  const tradeInfo = useSelector((RootState) => RootState.trade);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const correctNetwork = chain && chain.id === 324;

  const [pairResult, setpairResult] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [slippageModalOpen, setSlippageModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState("from");
  const [balance, setBalance] = useState(0);
  const [balanceFrom, setBalanceFrom] = useState(0);
  const [balanceTo, setBalanceTo] = useState(0);
  const [sellBalance, setSellBalance] = useState("");
  const [buyBalance, setBuyBalance] = useState("");
  const [balanceError, setBalanceError] = useState(false);
  const [unknownPrice, setUnknownPrice] = useState(false);
  const [liquidityError, setLiquidityError] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState(0);
  const [bestProtocal, setBestProtocal] = useState(null);
  const [pathResults, setPathResults] = useState([]);

  const showModal = (key) => {
    setModalKey(key);
    setModalOpen(true);
  };

  const calculatePrice = (value) => {
    if (Number(value) > Number(balanceFrom)) {
      setBalanceError(true);
    } else {
      setBalanceError(false);
    }

    if (value < 0) {
      setSellBalance("");
      setBuyBalance("");
    } else {
      setSellBalance(value);
      if (pairResult.length === 0) setBuyBalance("");
      else if (pairResult[0].baseToken.symbol === tradeInfo.from.name) {
        setBuyBalance(value * pairResult[0].priceNative);
      } else {
        setBuyBalance(value / pairResult[0].priceNative);
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const changeBalance = () => {
    setSellBalance(buyBalance);
    calculatePrice(buyBalance);
  };
  const changeOrder = () => {
    setSellBalance(buyBalance);
    calculatePrice(buyBalance);
    setBalanceError(false);
    setEstimatedGas(0);
    const oldOrder = {
      ...tradeInfo
    };
    dispatch(setTradeFrom(oldOrder.to));
    dispatch(setTradeTo(oldOrder.from));
  };

  const getQuote = async () => {
    if (sellBalance <= 0) return false;
    const fromTokenAddress = tradeInfo.from.contractAddress;
    const toTokenAddress = tradeInfo.to.contractAddress;
    const amount = ethers.utils.parseUnits(
      sellBalance,
      tradeInfo.from.decimals
    );

    const quoteAPI = `https://api.1inch.io/v5.0/324/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}`;

    const response = await fetch(quoteAPI);
    const quoteData = await response.json();
    if (quoteData.statusCode === 400) {
      setLiquidityError(true);
      setUnknownPrice(true);
      setBuyBalance(0);
      setEstimatedGas(0);
      setBestProtocal(null);
    } else {
      setLiquidityError(false);
      setUnknownPrice(false);
      const toTokenAmount = ethers.utils.formatUnits(
        quoteData.toTokenAmount,
        quoteData.toToken.decimals
      );
      setBuyBalance(toTokenAmount);
      setEstimatedGas(quoteData.estimatedGas);
      setBestProtocal(quoteData.protocols[0][0][0]["name"]);
    }

    const pathAPI = `https://pathfinder.1inch.io/v1.4/chain/324/router/v5/quotes?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&gasPrice=250000000&protocolWhiteList=ZKSYNC_MUTE,ZKSYNC_ONE_INCH_LIMIT_ORDER_V3,ZKSYNC_PMMX,ZKSYNC_SPACEFI,ZKSYNC_SYNCSWAP,ZKSYNC_GEM,ZKSYNC_MAVERICK_V1&preset=maxReturnResult&alternativeProtocols=ZKSYNC_MUTE,ZKSYNC_ONE_INCH_LIMIT_ORDER_V3,ZKSYNC_SPACEFI,ZKSYNC_SYNCSWAP,ZKSYNC_GEM,ZKSYNC_MAVERICK_V1`;

    const pathResponse = await fetch(pathAPI);
    const pathResults = await pathResponse.json();
    if (pathResults.err) {
      setPathResults([]);
    } else {
      const bestResult = {
        protocol: pathResults.bestResult.routes[0].subRoutes[0][0].market.name,
        toTokenAmount: pathResults.bestResult.toTokenAmount
      };
      const tempResults = pathResults.results.filter(
        (result) => result.protocol !== bestResult.protocol
      );

      setPathResults([
        bestResult,
        ...tempResults.sort((a, b) => {
          return b.toTokenAmount - a.toTokenAmount;
        })
      ]);
    }
  };

  const getBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    setBalance(ethers.utils.formatEther(balance));
    if (tradeInfo.from.name === "ETH")
      setBalanceFrom(ethers.utils.formatEther(balance));
  };

  const getTokenBalance = async () => {
    if (tradeInfo.from.name !== "ETH") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractFrom = new ethers.Contract(
        tradeInfo.from.contractAddress,
        ABI,
        provider
      );
      const decimals1 = await contractFrom.decimals();
      const balance1 = await contractFrom.balanceOf(address);
      setBalanceFrom(ethers.utils.formatUnits(balance1, decimals1));

      const contractTo = new ethers.Contract(
        tradeInfo.from.contractAddress,
        ABI,
        provider
      );
      const decimals2 = await contractTo.decimals();
      const balance2 = await contractTo.balanceOf(address);
      setBalanceTo(ethers.utils.formatUnits(balance2, decimals2));
    }
  };

  useEffect(() => {
    if (correctNetwork) {
      getBalance();
      getTokenBalance();
    } else {
      setpairResult([]);
      setBalanceFrom(0);
      setBalanceTo(0);
      setBalance(0);
      setSellBalance("");
      setBuyBalance("");
    }
  }, [tradeInfo, correctNetwork, chain]);

  useEffect(() => {
    if (sellBalance > 0 && correctNetwork) getQuote();
  }, [sellBalance, tradeInfo]);

  return (
    <>
      <Grid className={modalOpen || slippageModalOpen ? "blur-background" : ""}>
        <Header />
        <Container maxWidth='md'>
          <Grid className='main-wrapper' container justifyContent='center'>
            <Grid className='swap-wrapper'>
              <Grid container justifyContent={"space-between"}>
                <Typography variant='h1' className='title'>
                  Swap tokens
                </Typography>
                <SettingsOutlinedIcon
                  className='setting-icon'
                  onClick={() => setSlippageModalOpen(true)}
                />
              </Grid>

              <Grid
                container
                direction='column'
                className='swap-form'
                rowSpacing={2}
              >
                <Grid item>
                  <Box className='token-box'>
                    <Grid container alignItems={"center"}>
                      <Button
                        className='token-select'
                        onClick={(e) => showModal("from")}
                      >
                        <img
                          src={tradeInfo.from.icon}
                          alt='icon'
                          className='token-icon'
                        />
                        {tradeInfo.from.name}
                        <ArrowDropDownIcon />
                      </Button>

                      <InputBase
                        type='number'
                        value={sellBalance}
                        placeholder='0.0000000'
                        className='input-box'
                        onChange={(e) => calculatePrice(e.target.value)}
                        disabled={!correctNetwork}
                      />
                    </Grid>
                    <Grid container justifyContent={"space-between"}>
                      <Grid className='balance-text'>
                        Balance:{" "}
                        {tradeInfo.from.name === "ETH"
                          ? Number(balance).toFixed(5)
                          : Number(balanceFrom).toFixed(5)}{" "}
                        {tradeInfo.from.name}
                      </Grid>

                      <Grid>
                        {balanceError && (
                          <Typography
                            textAlign={"right"}
                            className='balance-error'
                          >
                            Insufficient balance
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid container justifyContent={"center"}>
                  <div className='change-order'>
                    <SwapCallsOutlinedIcon onClick={changeOrder} />
                  </div>
                </Grid>
                <Grid item>
                  <Box className='token-box'>
                    <Grid container alignItems={"center"}>
                      <Button
                        className='token-select'
                        onClick={(e) => showModal("to")}
                      >
                        <img
                          src={tradeInfo.to.icon}
                          alt='icon'
                          className='token-icon'
                        />
                        {tradeInfo.to.name}
                        <ArrowDropDownIcon />
                      </Button>
                      <InputBase
                        type='number'
                        value={buyBalance}
                        placeholder='0.0000000'
                        className='input-box'
                        disabled={!correctNetwork}
                      />
                    </Grid>
                    <Grid className='balance-text'>
                      Balance:{" "}
                      {tradeInfo.to.name === "ETH"
                        ? Number(balance).toFixed(5)
                        : Number(balanceTo).toFixed(5)}{" "}
                      {tradeInfo.to.name}
                    </Grid>
                  </Box>
                </Grid>
                <Grid>
                  {estimatedGas ? (
                    <Typography color={"#a9b6bf"} textAlign={"right"}>
                      Estimated Gas: {estimatedGas}
                    </Typography>
                  ) : (
                    <></>
                  )}
                  {unknownPrice && (
                    <Typography className='unknown-price' textAlign={"right"}>
                      Unknown price <WarningAmberIcon></WarningAmberIcon>
                    </Typography>
                  )}

                  <Typography className='exchange-rate' textAlign={"right"}>
                    {pairResult.length > 0 ? (
                      <>
                        1 {pairResult[0].baseToken.symbol} ={" "}
                        {pairResult[0].priceNative}{" "}
                        {pairResult[0].quoteToken.symbol}
                      </>
                    ) : (
                      <></>
                    )}
                  </Typography>
                </Grid>
                <Grid item container justifyContent={"center"}>
                  {liquidityError ? (
                    <Button variant='contained' disabled fullWidth>
                      No liquidity for swap
                    </Button>
                  ) : (
                    <>
                      {isConnected ? (
                        <>
                          {!bestProtocal ||
                          balanceError ||
                          !Number(sellBalance) ? (
                            <Button
                              variant='contained'
                              disabled
                              className='swap-button'
                              fullWidth
                            >
                              {!balanceError ? "SWAP" : "Insufficient balance"}
                            </Button>
                          ) : (
                            <Button
                              component={"button"}
                              variant='contained'
                              href={PROTOCOL_LIST[bestProtocal].url(
                                tradeInfo.from.name,
                                tradeInfo.to.contractAddress
                              )}
                              className='swap-button'
                              fullWidth
                              target={"_blank"}
                            >
                              SWAP
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button variant='contained' disabled fullWidth>
                          Connect Wallet
                        </Button>
                      )}
                    </>
                  )}
                </Grid>
                {pathResults && pathResults.length > 0 ? (
                  <Grid className='exchanges'>
                    <Typography variant='h6'>Exchanges:</Typography>

                    <table border='0' cellSpacing='0' cellPadding='0'>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>
                            {tradeInfo.from.name} / {tradeInfo.to.name}
                          </th>
                          <th>Diff</th>
                        </tr>
                      </thead>

                      <tbody>
                        {pathResults.map((element, index) => (
                          <tr className='dex-item' key={index}>
                            <td className='dex-name'>
                              <img
                                src={PROTOCOL_LIST[element.protocol].icon}
                                alt='icon'
                                className='dex-icon'
                              />
                              {PROTOCOL_LIST[element.protocol].name}
                            </td>
                            <td>
                              {(
                                Number(
                                  ethers.utils
                                    .formatUnits(
                                      element.toTokenAmount,
                                      tradeInfo.to.decimals
                                    )
                                    .toString()
                                ) / Number(sellBalance)
                              ).toFixed(4)}
                            </td>
                            <td>
                              {index === 0 ? (
                                <Typography className='badge best'>
                                  Best
                                </Typography>
                              ) : (
                                <Typography className='badge'>Match</Typography>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Grid>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <TokenListModal
        modalOpen={modalOpen}
        closeModal={closeModal}
        modalKey={modalKey}
        changeBalance={changeBalance}
      />
      <SlippageModal
        modalOpen={slippageModalOpen}
        closeModal={() => setSlippageModalOpen(false)}
      />
    </>
  );
};

export default SwapPage;
