const TruncatedAddress = ({ account }) => {
  return (
    <span>
      {account.toString().slice(0, 8) +
        '...' +
        account.toString().slice(account.toString().length - 4, account.toString().length)}
    </span>
  )
}

export default TruncatedAddress
