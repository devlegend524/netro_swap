import React, { useState } from "react";
import Header from "../../components/Header/Header";

import { Container, Grid, Typography } from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tooltip } from "react-tooltip";

import "./styles.scss";
import qrCode from "../../assets/qrcode.png";
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
            <Typography variant='h3'>Donate</Typography>
            <Typography variant='h6' align='center'>
              Please donate tokens to support platform
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <Grid container direction={"column"}>
              <Grid className='grid-wrapper'>
                <Typography variant='h6' align='center'>
                  <img src={qrCode} alt='qrcode' />
                </Typography>
                <Typography variant='h6' align='center'>
                  {address}
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
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default DonatePage;
