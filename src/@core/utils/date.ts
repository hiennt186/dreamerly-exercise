const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm:ss'
import dayjs from 'dayjs'

export const formatDate = (date: dayjs.Dayjs, format: string = DATE_TIME_FORMAT) => {
  return dayjs(date).format(format)
}
