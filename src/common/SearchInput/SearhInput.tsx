import React, { ChangeEvent, FC } from 'react'
import { TextField } from '@mui/material'
import { InputAdornment, IconButton, makeStyles, createStyles } from '@material-ui/core'
import { Search } from '@mui/icons-material'
const useStylesInput = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '400px',
      outline: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      background: 'white',
    },
  }),
)
const useStylesIconButton = makeStyles(() =>
  createStyles({
    root: {
      color: 'grey !important',
    },
  }),
)

interface IProps {
  placeholder?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}
export const SearhInput: FC<IProps> = ({ placeholder = 'Пошук', onChange = () => null }): JSX.Element => {
  const styleInput = useStylesInput()
  const styleIconButton = useStylesIconButton()
  return (
    <TextField
      onChange={onChange}
      placeholder={placeholder}
      size='small'
      variant='outlined'
      classes={{
        root: styleInput.root,
      }}
      InputProps={{
        autoComplete: 'on',
        type: 'search',
        startAdornment: (
          <InputAdornment position='start'>
            <IconButton edge='start'>
              <Search
                classes={{
                  root: styleIconButton.root,
                }}
              />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}
