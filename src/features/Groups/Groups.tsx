import React, { useState, useEffect, useRef } from 'react'

import { getGroups, deleteGroup, updateGroup, createGroup } from 'api/groups'

import { uploadSingleFile } from 'api/media'
import Cropper from 'react-cropper'
import { EditOutlined, DeleteOutlined, FileImageOutlined } from '@ant-design/icons'
import { Collapse, Modal, Input, Button, Popover } from 'antd'

const { Panel } = Collapse
export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

const initState = {
  group_name: '',
  level: 0,
  group_image: '',
}
const defaultSrc = 'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg'
export const Groups = () => {
  const [open, setOpen] = useState(false)

  const [state, setState] = useState(initState)
  const [groups, setGroups] = useState([])

  const [openCropModal, setOpenCropModal] = useState(false)
  const [image, setImage] = useState(defaultSrc)
  const [imageBlob, setImageBlob] = useState(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [cropData, setCropData] = useState(null)
  const [cropper, setCropper] = useState<Cropper>()

  const onChangeFile = (e: any) => {
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

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setState(initState)
  }

  const handleCloseCropModal = () => {
    setOpenCropModal(false)
  }

  const onChange = e => {
    const { name, value } = e.target
    setState(prev => ({ ...prev, [name]: value }))
  }

  const fetchGroupList = async () => {
    try {
      const res = await getGroups()
      setGroups(res)
    } catch (error) {
      console.log(error)
    }
  }
  const onCreateGroup = async () => {
    let image = state.group_image
    try {
      if (imageBlob) {
        image = await uploadSingleFile(imageBlob)
      }
      await createGroup({ ...state, group_image: image?.url || image })
      await fetchGroupList()
      setImageBlob(null)
      setCropData(null)
    } catch (error) {
      console.log(error)
    }
  }

  const onUpdateGroup = async () => {
    let image = state.group_image

    try {
      if (imageBlob) {
        image = await uploadSingleFile(imageBlob)
      }
      await updateGroup({ ...state, group_image: image?.url || image })
      await fetchGroupList()
      setImageBlob(null)
      setCropData(null)
    } catch (error) {
      console.log(error)
    }
  }

  const onDeleteGroup = async (id, level, parent_id) => {
    try {
      await deleteGroup(id, level, parent_id)
      await fetchGroupList()
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchGroupList()
  }, [])

  return (
    <div>
      <Button
        style={{ marginBottom: '10px' }}
        onClick={() => {
          setState(prev => ({ ...prev, level: 0 }))
          handleClickOpen()
        }}
      >
        Add group
      </Button>

      <Collapse accordion>
        {groups?.map((group, i) => (
          <Panel
            header={
              <>
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                  <p style={{ margin: '0' }}>{group.group_name}</p>

                  <div>
                    {group?.group_image && (
                      <Button type='default' style={{ marginRight: '10px' }}>
                        <Popover
                          title='Group Image'
                          content={<img style={{ margin: '0 auto' }} width={100} src={group.group_image} alt='' />}
                        >
                          <FileImageOutlined />
                        </Popover>
                      </Button>
                    )}

                    <Button
                      type='default'
                      style={{ marginRight: '10px' }}
                      onClick={() => {
                        setState({ ...group, level: 0 })
                        handleClickOpen()
                      }}
                    >
                      <EditOutlined />
                    </Button>
                    <Button type='default' onClick={() => onDeleteGroup(group.id, 0, group.id)}>
                      <DeleteOutlined />
                    </Button>
                  </div>
                </div>
              </>
            }
            key={group.id}
          >
            <Button
              type='default'
              style={{ marginBottom: '10px' }}
              onClick={() => {
                setState(prev => ({ ...prev, level: 1, parent_id: group.id }))
                handleClickOpen()
              }}
            >
              Add first level group
            </Button>
            <Collapse accordion>
              {group.children?.map(firstLevelGroup => (
                <Panel
                  header={
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                      <p style={{ margin: '0' }}>{firstLevelGroup.group_name}</p>

                      <div>
                        {firstLevelGroup.group_image && (
                          <Button type='default' style={{ marginRight: '10px' }}>
                            <Popover
                              title='Group Image'
                              content={
                                <img
                                  style={{ margin: '0 auto' }}
                                  width={100}
                                  src={firstLevelGroup.group_image}
                                  alt=''
                                />
                              }
                            >
                              <FileImageOutlined />
                            </Popover>
                          </Button>
                        )}
                        <Button
                          type='default'
                          style={{ marginRight: '10px' }}
                          onClick={() => {
                            setState({ ...firstLevelGroup, level: 1 })
                            handleClickOpen()
                          }}
                        >
                          <EditOutlined />
                        </Button>
                        <Button type='default' onClick={() => onDeleteGroup(firstLevelGroup.id, 1, group.id)}>
                          <DeleteOutlined />
                        </Button>
                      </div>
                    </div>
                  }
                  key={firstLevelGroup.id}
                >
                  <Button
                    type='default'
                    style={{ marginBottom: '10px' }}
                    onClick={() => {
                      setState(prev => ({ ...prev, level: 2, parent_id: group.id, child_id: firstLevelGroup.id }))
                      handleClickOpen()
                    }}
                  >
                    Add second level group
                  </Button>
                  <Collapse accordion>
                    {firstLevelGroup.children?.map(secondLevelGroup => (
                      <Panel
                        header={
                          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                            <p style={{ margin: '0' }}>{secondLevelGroup.group_name}</p>

                            <div>
                              {secondLevelGroup?.group_image && (
                                <Button type='default' style={{ marginRight: '10px' }}>
                                  <Popover
                                    title='Group Image'
                                    content={
                                      <img
                                        style={{ margin: '0 auto' }}
                                        width={100}
                                        src={secondLevelGroup.group_image}
                                        alt=''
                                      />
                                    }
                                  >
                                    <FileImageOutlined />
                                  </Popover>
                                </Button>
                              )}
                              <Button
                                style={{ marginRight: '10px' }}
                                type='default'
                                onClick={() => onDeleteGroup(secondLevelGroup.id, 2, group.id)}
                              >
                                <DeleteOutlined />
                              </Button>
                            </div>
                          </div>
                        }
                        key={secondLevelGroup.id}
                      ></Panel>
                    ))}
                  </Collapse>
                </Panel>
              ))}
            </Collapse>
          </Panel>
        ))}
      </Collapse>

      <Modal
        title={state?.id ? 'Update Group' : 'Create new Group'}
        okText='Save'
        onOk={() => {
          state?.id ? onUpdateGroup() : onCreateGroup()

          handleClose()
        }}
        open={open}
        onCancel={handleClose}
      >
        <Input
          onChange={onChange}
          name='group_name'
          style={{ marginBottom: '20px' }}
          placeholder='Group Name'
          value={state.group_name}
        />
        <Input onChange={onChangeFile} style={{ marginBottom: '20px' }} type='file' />
        {cropData && <img style={{ width: '30%' }} src={cropData} alt='cropped' />}
      </Modal>

      <Modal
        onOk={() => {
          getCropData()
          setOpenCropModal(false)
        }}
        title='Edit'
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
    </div>
  )
}
