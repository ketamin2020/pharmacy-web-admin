import React from 'react'
import Fallback from './Fallback'
import './ErrorBoundary.scss'

class ErrorBoundary extends React.Component {
  state = {
    error: false,
    errorInfo: false,
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.errorInfo) {
      return <Fallback />
    }
    return this.props.children
  }
}

export default ErrorBoundary
