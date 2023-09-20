import React from 'react'
import Button from 'common/Button/Button'
import './ErrorBoundary.scss'

const Fallback = () => {
  const handleButtonClick = () => {
    window.location.href = '/'
  }

  return (
    <div className={'fallback-body'}>
      <h2 className={'fallback-title'}>
        Oops, something went wrong, please try to reload or go to{' '}
        <Button className={'fallback-home-button'} onClick={handleButtonClick}>
          <p>Home page</p>
        </Button>
      </h2>
      <div className='gears'>
        <div className='gear one'>
          <div className='bar' />
          <div className='bar' />
          <div className='bar' />
        </div>
        <div className='gear two'>
          <div className='bar' />
          <div className='bar' />
          <div className='bar' />
        </div>
        <div className='gear three'>
          <div className='bar' />
          <div className='bar' />
          <div className='bar' />
        </div>
      </div>
    </div>
  )
}

export default Fallback
