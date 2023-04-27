import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Container, Grid, Typography } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
import moment from 'moment'
import './styles.scss'

const StatsPage = () => {
  const [TVLhistory, setTVLhistory] = useState([])
  const [dexTVLData, setDexTVLData] = useState([])

  const dexList = [
    {
      protocal: 'syncswap',
      logo: 'https://icons.llama.fi/syncswap.png',
      url: 'https://syncswap.xyz',
    },
    {
      protocal: 'velocore',
      logo: 'https://icons.llama.fi/velocore.png',
      url: 'https://velocore.xyz',
    },
    {
      protocal: 'gemswap',
      logo: 'https://icons.llama.fi/gemswap.png',
      url: 'https://zks.gemswap.online/swap',
    },
    {
      protocal: 'mute.io',
      logo: 'https://icons.llama.fi/mute.io.jpg',
      url: 'https://app.mute.io',
    },
    {
      protocal: 'SpaceFi',
      logo: 'https://icons.llama.fi/spacefi.png',
      url: 'https://spacefi.io',
    },
  ]

  const getTVL = async () => {
    const response = await fetch('https://api.llama.fi/v2/historicalChainTvl/zkSync%20Era')
    const result = await response.json()
    setTVLhistory(result)
  }

  const getDexTVL = async () => {
    const dexData = await Promise.all(
      dexList.map(async (dex) => {
        const response = await fetch(`https://api.llama.fi/tvl/${dex.protocal}`)
        const result = await response.json()
        return {
          ...dex,
          tvl: result,
        }
      })
    )
    setDexTVLData(dexData)
  }

  const convertCurrency = (labelValue) => {
    return Math.abs(Number(labelValue)) >= 1.0e9
      ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + 'B'
      : Math.abs(Number(labelValue)) >= 1.0e6
      ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + 'M'
      : Math.abs(Number(labelValue)) >= 1.0e3
      ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + 'K'
      : Math.abs(Number(labelValue))
  }

  const dateFormatter = (time) => {
    var d = new Date(0)
    d.setUTCSeconds(time)
    return moment(d).format('DD/MM')
  }

  const calcChange = () => {
    return (
      1 -
      Number(TVLhistory[TVLhistory.length - 2].tvl) / Number(TVLhistory[TVLhistory.length - 1].tvl)
    ).toFixed(3)
  }

  useEffect(() => {
    getTVL()
    getDexTVL()
  }, [])

  return (
    <>
      <Header />
      <Container className='content-wrapper'>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h3'>zkSync era stats</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Grid container direction={'column'}>
              <Grid className='grid-wrapper'>
                <Typography variant='h6'>TVL (USD)</Typography>
                <Typography variant='h4'>
                  {TVLhistory.length ? (
                    <>${convertCurrency(TVLhistory[TVLhistory.length - 1].tvl)}</>
                  ) : (
                    <Skeleton variant='rounded' sx={{ bgcolor: '#2a3454' }} />
                  )}
                </Typography>
              </Grid>

              <Grid className='grid-wrapper'>
                <Typography variant='h6'>Change (24h)</Typography>
                {TVLhistory.length ? (
                  <Typography variant='h4' className={calcChange() < 0 ? 'down' : 'up'}>
                    {calcChange()}%
                  </Typography>
                ) : (
                  <Typography variant='h4'>
                    <Skeleton variant='rounded' sx={{ bgcolor: '#2a3454' }} />
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid className='grid-wrapper'>
              {TVLhistory.length ? (
                <ResponsiveContainer width='100%' height={200}>
                  <AreaChart
                    width={500}
                    height={200}
                    data={TVLhistory}
                    syncId='anyId'
                    margin={{
                      top: 0,
                      right: 5,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <XAxis
                      dataKey='date'
                      tickFormatter={dateFormatter}
                      tick={{ fill: 'white' }}
                      tickLine={{ stroke: 'white' }}
                    />
                    <YAxis
                      tickFormatter={convertCurrency}
                      orientation='right'
                      tick={{ fill: 'white' }}
                      tickLine={{ stroke: 'white' }}
                    />
                    <Tooltip formatter={convertCurrency} labelFormatter={dateFormatter} />
                    <Area type='monotone' dataKey='tvl' stroke='#279778' fill='#234b56' />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton variant='rounded' sx={{ bgcolor: '#2a3454' }} height={200} />
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant='h6'>TVL Rankings</Typography>
            <Grid className='grid-wrapper dex-ranking'>
              <table className='dex-table' border='0' cellSpacing='0' cellPadding='0'>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Url</th>
                    <th>TVL</th>
                  </tr>
                </thead>

                {dexTVLData.length > 0 ? (
                  <tbody>
                    {dexTVLData.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className='dex-name'>
                            <img src={data.logo} alt='dex icon' className='dex-icon' />
                            {data.protocal}
                          </td>
                          <td>
                            <a
                              href={data.url}
                              target='_blank'
                              rel='noreferrer'
                              className='dex-link'
                            >
                              {data.url}
                            </a>
                          </td>
                          <td>${convertCurrency(data.tvl)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                ) : (
                  <tbody className='skeleton-table'>
                    <tr>
                      <td colSpan={4}>
                        <Skeleton variant='rounded' sx={{ bgcolor: '#2a3454' }} height={40} />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <Skeleton variant='rounded' sx={{ bgcolor: '#2a3454' }} height={40} />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <Skeleton variant='rounded' sx={{ bgcolor: '#2a3454' }} height={40} />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <Skeleton variant='rounded' sx={{ bgcolor: '#2a3454' }} height={40} />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <Skeleton variant='rounded' sx={{ bgcolor: '#2a3454' }} height={40} />
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default StatsPage
