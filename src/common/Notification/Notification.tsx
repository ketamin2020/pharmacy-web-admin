import { toast, TypeOptions } from 'react-toastify'

const notification = (type: TypeOptions, message: string, ...rest) => {
  return toast?.[type](message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
    ...rest,
  })
}

export default notification
