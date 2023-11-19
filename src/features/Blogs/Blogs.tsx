import * as React from 'react'
import { useState, useEffect, useMemo, useRef } from 'react'
import ImgCrop from 'antd-img-crop'
import moment from 'moment'
import notification from 'common/Notification/Notification'
import { tinyEditorSettings } from 'services/tinyEditor'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { uploadSingleFile } from 'api/media'
import { CreateBlogCategoryModal } from 'components/modals/CreateBlogCategoryModal'

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

import { Editor } from '@tinymce/tinymce-react'

import { Tooltip, Button, Modal, Input, Select, Upload, message, Typography } from 'antd'
import { Delete, Add } from '@mui/icons-material'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult, FilterDropdownProps } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'
import { SearchFilter } from 'components/Table/components/SearchFilter'
import { DateRangeFilter } from 'components/Table/components/DateRangeFilter'
import { TableActions } from 'components/TableActions/TableActions'
import { getBlogs, getBlogsCategory, createBlog, updateBlog, deleteBlog } from 'api/blogs'
import styled from '@emotion/styled'

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

const renderTitle = name => (
  <Tooltip placement='topLeft' title={name}>
    {name}
  </Tooltip>
)

const initSection = {
  name: '',
  text: '',
}

const initData = {
  name: '',
  title: '',
  sub_title: '',
  active: true,
  entity: [],
  type: '',
  images: [],
  preview: {
    title: '',
    sub_title: '',
    image: '',
  },
  section: [initSection],
}

export const Blogs = () => {
  const editorRef = useRef(null)
  const [data, setData] = useState([])
  const [blog, setBlog] = useState(initData)
  const [loading, setLoading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')

  const [openCategoryModal, setOpenCategoryModal] = useState(false)

  const [category, setCategory] = useState([])

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 25,
    total: 10,
  })

  const [clickedRowIndex, setClickedRowIndex] = useState<number | null>(null)

  const [open, setOpen] = useState(false)

  const handleOpenModal = () => {
    setOpen(true)
  }
  const handleCloseModal = () => {
    setOpen(false)
    setBlog(initData)
  }

  const fetchList = async params => {
    try {
      const { data, meta } = await getBlogs(params)
      setPagination({
        page: meta.current,
        page_size: meta.pageSize,
        total: meta.total,
      })
      setData(data)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  const fetchCategory = async () => {
    const res = await getBlogsCategory({})
    setCategory(res)
  }

  useEffect(() => {
    fetchList({ page: pagination.page, per_page: pagination.per_page })
  }, [])

  useEffect(() => {
    fetchCategory()
  }, [])

  const handleTableChange = (
    pagination: PaginationConfig,
    filters: Partial<Record<keyof object, string[]>>,
    sorter: SorterResult<object>,
  ) => {
    fetchList({
      page: pagination.current,
      sort_field: sorter.order ? sorter.field : null,
      order: sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : null,
      per_page: pagination.pageSize,
      ...filters,
    })
  }

  const onRow = (record: any, rowIndex: number) => ({
    onClick: () => {
      setClickedRowIndex(rowIndex)
    },
  })

  const tableActionProps = record => ({
    todos: ['delete', 'edit'],
    callbacks: [
      () => handleDeleteBlog(record.id),
      () => {
        setBlog({ ...record, type: record?.type?.id })
        setOpen(true)
      },
    ],
    preloaders: [],
    disabled: [false, false],
    tooltips: ['Remove this blog?', 'Edit this blog?'],
    popConfirms: ['Are you sure that you want to delete this blog?'],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBlog(prev => ({ ...prev, [name]: value }))
  }
  const handleChangePreviewInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBlog(prev => ({ ...prev, preview: { ...prev.preview, [name]: value } }))
  }

  const handleChangeSection = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const { name, value } = e.target

    const newSection = [...blog.section]
    newSection[idx][name] = value

    setBlog(prev => ({ ...prev, section: newSection }))
  }

  const handleAddSection = () => {
    setBlog(prev => ({ ...prev, section: [...prev.section, initSection] }))
  }
  const handleDeleteSection = idx => {
    setBlog(prev => ({ ...prev, section: prev.section.filter((_, index) => index !== idx) }))
  }

  const handleChangeUpload: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as RcFile, url => {
        setLoading(false)
      })
    }
    setLoading(false)
  }

  const handleUploadSingleFile = async (file, isList) => {
    try {
      const res = await uploadSingleFile({ image: file })

      if (isList) {
        setBlog(prev => ({ ...prev, images: [...prev.images, res] }))
      } else {
        setBlog(prev => ({ ...prev, preview: { ...prev.preview, image: res.url } }))
      }

      return res
    } catch (error) {
      console.log(error)
    }
  }

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))

    setPreviewUrl(file.url)
  }

  const columns: ColumnProps<any> = useMemo(
    () => [
      {
        title: renderTitle('Name'),
        dataIndex: 'name',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Status'),
        dataIndex: 'active',
        sorter: true,
        render: value => (value ? 'Active' : 'Inactive'),
      },

      {
        title: renderTitle('Preview'),
        dataIndex: 'preview',
        sorter: true,
      },

      {
        title: renderTitle('Type'),
        dataIndex: 'type',
        sorter: true,
        render: value => value?.name || '-',
      },

      {
        title: renderTitle('Count Of Section'),
        dataIndex: 'section',
        sorter: true,
        render: value => value?.length,
      },

      {
        title: renderTitle('Created at'),
        dataIndex: 'created_at',
        sorter: true,
        width: 200,
        render: value => moment(value).format('DD/MM/YYYY HH:mm'),
        filterDropdown: (props: FilterDropdownProps) => <DateRangeFilter {...props} />,
      },
      {
        title: renderTitle('Updated at'),
        dataIndex: 'updated_at',
        sorter: true,
        width: 200,
        render: value => moment(value).format('DD/MM/YYYY HH:mm'),
        filterDropdown: (props: FilterDropdownProps) => <DateRangeFilter {...props} />,
      },
      {
        title: renderTitle('Actions'),
        dataIndex: 'actions',
        sorter: false,
        width: 200,
        render: (value, record) => <TableActions {...tableActionProps(record)} />,
      },
    ],
    [clickedRowIndex],
  )

  const handleSaveBlog = async () => {
    try {
      const res = await createBlog(blog)
      handleCloseModal()
      fetchList({ page: pagination.page, per_page: pagination.per_page })
    } catch (error) {
      console.error(error)
    }
  }
  const handleUpdateBlog = async () => {
    try {
      const res = await updateBlog(blog)
      handleCloseModal()
      fetchList({ page: pagination.page, per_page: pagination.per_page })
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteBlog = async id => {
    try {
      await deleteBlog(id)
      fetchList({ page: pagination.page, per_page: pagination.per_page })
    } catch (error) {
      console.error(error)
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  return (
    <Wrapper>
      <Controls>
        <Button onClick={handleOpenModal}>Add Blog</Button>
      </Controls>
      <Table columns={columns} dataSource={data} pagination={pagination} onChange={handleTableChange} onRow={onRow} />
      <Modal
        width={800}
        centered
        destroyOnClose
        title={blog?.id ? 'Update blog' : 'Add Blog'}
        open={open}
        onOk={blog?.id ? handleUpdateBlog : handleSaveBlog}
        onCancel={handleCloseModal}
      >
        <p>Main Info</p>
        <Controls>
          <Select
            placeholder='Status'
            onChange={value => handleChange({ target: { value, name: 'active' } })}
            style={{ width: '100%' }}
            value={blog.active}
            options={[
              { label: 'Active', value: true },
              { label: 'Inactive', value: false },
            ]}
          />
        </Controls>
        <Controls>
          <Select
            placeholder='Category'
            onChange={value => handleChange({ target: { value, name: 'type' } })}
            style={{ width: '100%' }}
            options={category.map(item => ({ value: item.id, label: item.name }))}
            value={blog?.type || blog?.type?.id}
          />
          <span style={{ cursor: 'pointer' }} onClick={() => setOpenCategoryModal(true)}>
            <Add />
          </span>
        </Controls>
        <Controls>
          <Input placeholder='Name' name='name' onChange={handleChange} value={blog.name} />
        </Controls>
        <Controls>
          <Input placeholder='Title' name='title' onChange={handleChange} value={blog.title} />
        </Controls>
        <Controls>
          <Input placeholder='Sub-Title' name='sub_title' onChange={handleChange} value={blog.sub_title} />
        </Controls>

        <p>Blog Preview</p>

        <Controls>
          <Input placeholder='Title' name='title' onChange={handleChangePreviewInfo} value={blog.preview.title} />
        </Controls>
        <Controls>
          <Input
            placeholder='Sub-Title'
            name='sub_title'
            onChange={handleChangePreviewInfo}
            value={blog.preview.sub_title}
          />
        </Controls>
        <Controls>
          <span>Preview Blog Image</span>
          <ImgCrop rotationSlider>
            <Upload
              name='avatar'
              listType='picture-card'
              className='avatar-uploader'
              showUploadList={false}
              customRequest={options => handleUploadSingleFile(options.file)}
              beforeUpload={beforeUpload}
              onChange={handleChangeUpload}
            >
              {blog?.preview?.image ? (
                <img src={blog?.preview?.image} alt='avatar' style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </ImgCrop>
        </Controls>

        <p>Blog Content</p>

        <p>Media</p>
        <ImgCrop rotationSlider>
          <Upload
            customRequest={options => handleUploadSingleFile(options.file, true)}
            listType='picture-card'
            fileList={blog.images}
            onPreview={handlePreview}
            onChange={handleChangeUpload}
          >
            {blog.images.length >= 10 ? null : uploadButton}
          </Upload>
        </ImgCrop>

        {blog.section.map((item, idx) => (
          <SectionWrapper key={idx}>
            <SectionControls>
              <p>{`Section #${idx + 1}`}</p>
              <div>
                <span onClick={handleAddSection}>
                  <Add />
                </span>
                <span onClick={() => handleDeleteSection(idx)}>
                  <Delete />
                </span>
              </div>
            </SectionControls>
            <Controls>
              <Input placeholder='Name' name='name' onChange={e => handleChangeSection(e, idx)} value={item.name} />
            </Controls>

            <Editor
              apiKey={process.env.REACT_APP_TINY_EDITOR_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={item?.text}
              value={item?.text}
              onEditorChange={value => handleChangeSection({ target: { value, name: 'text' } }, idx)}
              init={tinyEditorSettings}
            />
          </SectionWrapper>
        ))}
      </Modal>

      <CreateBlogCategoryModal
        callback={fetchCategory}
        open={openCategoryModal}
        handleClose={() => setOpenCategoryModal(false)}
      />

      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <Typography.Paragraph copyable>{previewUrl}</Typography.Paragraph>
        <img alt='example' style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Wrapper>
  )
}

const Wrapper = styled.div``
const Controls = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`

const SectionWrapper = styled.div`
  padding: 10px;
`

const SectionControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & span {
    cursor: pointer;
  }
`
