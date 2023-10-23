import { DatePicker as AntdDatePicker } from 'antd'
import type { Moment } from 'moment'
import momentGenerateConfig from 'rc-picker/lib/generate/moment'

const DatePicker = AntdDatePicker.generatePicker<Moment>(momentGenerateConfig)

export default DatePicker
