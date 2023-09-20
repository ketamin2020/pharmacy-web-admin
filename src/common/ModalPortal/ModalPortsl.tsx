import { PropsWithChildren, useEffect } from 'react'
import ReactDOM from 'react-dom'

const ModalPortal = ({ children }: PropsWithChildren) => {
  const modalRoot: HTMLElement = document.getElementById('modal-root')
  const element: HTMLElement = document.createElement('div')

  useEffect(() => {
    modalRoot.appendChild(element)
    return () => modalRoot.removeChild(element)
  }, [element, modalRoot])

  return ReactDOM.createPortal(children, element)
}

export default ModalPortal
