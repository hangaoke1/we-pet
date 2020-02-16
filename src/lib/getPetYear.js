import dayjs from 'dayjs'

export default function getPetYear (birthday) {
  if (!birthday) {
    return '未知'
  }
  const day1 = dayjs()
  const day2 = dayjs(birthday)
  const diff = day1.diff(day2)
  let day = diff / (60 * 60 * 1000 * 24)

  let year = Math.floor(day / 365)

  let y = day % 365

  let month = Math.floor(y / 30)

  day = Math.floor((day % 365) % 30)
  if (year) {
    return `${year}年${month}个月`
  }
  if (month) {
    return `${month}个月${day}天`
  }
  return `${day}天`
}
