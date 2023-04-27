import React from 'react'
import { SnackbarProvider } from 'notistack'
import useStyles from './style.scss'

export const Snackbar = ({ children, maxSnack }) => {
  const classes = useStyles()

  return (
    <SnackbarProvider
      maxSnack={maxSnack}
      classes={{
        variantSuccess: classes.success,
        variantError: classes.error,
        variantWarning: classes.warning,
        variantInfo: classes.info,
      }}
    >
      {children}
    </SnackbarProvider>
  )
}
export default Snackbar
