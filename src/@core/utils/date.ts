import dayjs from 'dayjs'

const DATE_FORMAT = 'DD/MM/YYYY'

export const formatDate = (date: dayjs.Dayjs, format: string = DATE_FORMAT) => {
  return dayjs(date).format(format);
}