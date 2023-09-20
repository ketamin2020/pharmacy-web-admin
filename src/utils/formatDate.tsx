import moment from 'moment'
import 'moment/locale/uk'
export const formatDate = (dateString: string) => {
  const date = moment.tz(dateString, 'Europe/Kiev')
  const formattedDate = date.format('D MMMM YYYY р.')
  const fullFormattedDate = formattedDate.replace(formattedDate[1], formattedDate[1].toUpperCase())
  return fullFormattedDate
}
