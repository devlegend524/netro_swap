import React, { useState } from "react";
import Header from "../../components/Header/Header";

import { Container, Grid, Typography, Link } from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tooltip } from "react-tooltip";
import { QRCodeSVG } from "qrcode.react";

import "./styles.scss";
import copyImg from "../../assets/copy.svg";

const DonatePage = () => {
  const [address, setAddress] = useState(
    "0xCf2BeeDeE13Be9A35cda503d21266840b7ED36AA"
  );
  const [message, setMessage] = useState("Copy Address");
  const setCopy = () => {
    navigator.clipboard.writeText(address);
    setMessage("Copied!");
  };
  return (
    <>
      <Header />
      <Container className='content-wrapper'>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h3' className='mb-3' align='left'>
              Donate
            </Typography>
            <br />
            <Typography variant='h6' align='left'>
              Thank you for choosing to donate to Netro. Your contribution
              supports our continuous efforts to bring education and
              transparency to the Netro space. Netro is an Dex aggregator for
              providing best swapping options . We provide a comparison of the
              various DEXs available today. Because of our commitment to
              education we present various non-trivial metrics aside from Total
              Value Locked (TVL). We have carefully examined each L2 project to
              determine the inner workings of their technology as well as the
              associated risks. In the future we plan to introduce more metrics
              as well as build special purpose tools for various L2s that
              empower users to execute operations like forced transactions or
              view L2 state from the perspective of L1. We are a small and
              independent team. Your support means a lot to us. <br /> Thank
              you! <br />— Netro Team
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <Grid container direction={"column"}>
              <Grid className='grid-wrapper'>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}></Grid>
                  <Grid item xs={12} md={3} align='center'>
                    <QRCodeSVG
                      value={address}
                      bgColor='#010514'
                      size='250'
                      fgColor='white'
                    />
                    ,
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant='h6'>
                      {address.slice(0, address.length / 2)} <br />
                      {address.slice(address.length / 2)}
                      <CopyToClipboard
                        onCopy={() => setCopy()}
                        data-tooltip-id='copyAddress'
                        data-tooltip-content={message}
                      >
                        <span>
                          <img
                            src={copyImg}
                            alt='copy'
                            style={{ width: "20px", color: "white" }}
                          />
                        </span>
                      </CopyToClipboard>
                      <Tooltip id='copyAddress' />
                    </Typography>
                    <br />
                    <Link
                      href={`https://etherscan.io/address/${address}`}
                      color='rgb(255, 255, 255)'
                      rel='noopener'
                      target='_blank'
                    >
                      Ethereum mainnet
                    </Link>
                    <br />
                    <Link
                      href={`https://arbiscan.io/address/${address}`}
                      color='rgb(255, 255, 255)'
                      rel='noopener'
                      target='_blank'
                    >
                      Arbitrum
                    </Link>
                    <br />
                    <Link
                      href={`https://optimistic.etherscan.io/address/${address}`}
                      color='rgb(255, 255, 255)'
                      rel='noopener'
                      target='_blank'
                    >
                      Optimism
                    </Link>
                    <br />
                    <Link
                      href={`https://zkscan.io/explorer/accounts/${address}`}
                      color='rgb(255, 255, 255)'
                      rel='noopener'
                      target='_blank'
                    >
                      zkSync 1.0
                    </Link>
                    <br />
                    <Link
                      href={`https://bscscan.com/address/${address}`}
                      color='rgb(255, 255, 255)'
                      rel='noopener'
                      target='_blank'
                    >
                      BSC
                    </Link>
                    <br />
                  </Grid>
                  <Grid item xs={12} md={3}></Grid>{" "}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default DonatePage;
