import React from 'react'
import { List } from '@mui/material'
import { makeStyles } from '@material-ui/core'
import { TelegramIcon, FacebookIcon, InstagramIcon } from 'images/icons/icons'

const items = [
  {
    title: 'Facebook',
    url: '',
    icon: <FacebookIcon />,
  },
  {
    title: 'Telegram',
    url: '',
    icon: <TelegramIcon />,
  },
  {
    title: 'Instagram',
    url: '',
    icon: <InstagramIcon />,
  },
]
const useStyles = makeStyles(theme => ({
  linksWrapper: {
    display: 'flex',
    gap: '10px',
    padding: '1rem !important',
  },
  links: {
    cursor: 'pointer',
    display: 'inline-flex',
    padding: '0',
  },
}))

const SocialList = () => {
  const classes = useStyles()
  return (
    <List className={classes.linksWrapper}>
      {items.map(item => (
        <span className={classes.links} key={item.title}>
          {item.icon}
        </span>
      ))}
    </List>
  )
}

export default SocialList
