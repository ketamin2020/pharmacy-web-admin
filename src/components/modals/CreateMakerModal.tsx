import * as React from 'react'
import { useRef, useState } from 'react'

import { uploadSingleFile } from 'api/media'

import Cropper from 'react-cropper'
import { createMaker } from 'api/makers'

import notification from 'common/Notification/Notification'

import { Modal, Input } from 'antd'

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

interface IProps {
  handleClose: () => void
  callback: () => void
  open: boolean
}

const initData = {
  full_name: '',
  short_name: '',
  country: '',
  factory: '',
}

export const CreateMakerModal = ({ handleClose, callback, open }: IProps) => {
  const [state, setState] = useState(initData)
  const [openCropModal, setOpenCropModal] = useState(false)
  const [image, setImage] = useState(null)
  const [cropData, setCropData] = useState(null)
  const [cropper, setCropper] = useState<Cropper>()
  const imageRef = useRef<HTMLImageElement>(null)
  const [imageBlob, setImageBlob] = useState(null)

  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState(prev => ({ ...prev, [name]: value }))
  }
  const onChange = (e: any) => {
    e.preventDefault()
    let files
    if (e.dataTransfer) {
      files = e.dataTransfer.files
    } else if (e.target) {
      files = e.target.files
    }
    const reader = new FileReader()
    reader.onload = () => {
      setOpenCropModal(true)
      setImage(reader.result as any)
    }
    reader.readAsDataURL(files[0])
  }

  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      const canvas = cropper.getCroppedCanvas()
      const base64 = canvas.toDataURL()
      canvas.toBlob(async blob => {
        const fd = new FormData()
        const file = new File([blob], 'filename.jpeg')
        fd.append('image', file)
        setImageBlob(fd)
      })

      setCropData(base64)
    }
  }

  const handleCloseCropModal = () => {
    setOpenCropModal(false)
  }

  const handleCreate = async () => {
    try {
      const logo = await uploadSingleFile(imageBlob)
      await createMaker({
        ...state,
        logo: {
          ...logo,
        },
      })
      await callback()
      handleClose()
      notification('success', 'Maker was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  return (
    <>
      {' '}
      <Modal okText='Create' onOk={handleCreate} title='Create new Maker' onCancel={handleClose} open={open}>
        <Input
          onChange={onChangeHandle}
          name='full_name'
          style={{ marginBottom: '20px' }}
          placeholder='Full name'
          required
          value={state.full_name}
        />

        <Input
          onChange={onChangeHandle}
          name='short_name'
          style={{ marginBottom: '20px' }}
          placeholder='Short name'
          required
          value={state.short_name}
        />

        <Input
          onChange={onChangeHandle}
          name='country'
          style={{ marginBottom: '20px' }}
          placeholder='Country'
          required
          value={state.country}
        />

        <Input
          onChange={onChangeHandle}
          name='factory'
          style={{ marginBottom: '20px' }}
          placeholder='Factory'
          value={state.factory}
          required
        />
        <Input onChange={onChange} style={{ marginBottom: '20px' }} type='file' />
        {cropData && <img style={{ width: '30%' }} src={cropData} alt='cropped' />}
      </Modal>
      <Modal
        title='Edit'
        onOk={() => {
          getCropData()
          setOpenCropModal(false)
        }}
        onCancel={handleCloseCropModal}
        open={openCropModal}
      >
        <Cropper
          style={{ height: 400, width: '100%' }}
          initialAspectRatio={1}
          preview='.img-preview'
          src={image}
          ref={imageRef}
          viewMode={1}
          guides={true}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          checkOrientation={false}
          onInitialized={instance => {
            setCropper(instance)
          }}
        />
      </Modal>
    </>
  )
}
