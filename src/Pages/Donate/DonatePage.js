import React, { useState } from "react";
import Header from "../../components/Header/Header";

import { Container, Grid, Typography } from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tooltip } from "react-tooltip";

import "./styles.scss";
import qrCode from "../../assets/qrcode.png";
import copyImg from "../../assets/copy.svg";

const DonatePage = () => {
  const [message, setMessage] = useState("Copy Address");

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
                  0x39E539678AA0AF3738F498d936737ce51052C6aa{" "}
                  <CopyToClipboard
                    onCopy={() => setMessage("Copied!")}
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
