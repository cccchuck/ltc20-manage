export const formatDate = (date: Date | string) => {
  typeof date === 'string' && (date = new Date(date))
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minus = date.getMinutes().toString().padStart(2, '0')
  const secos = date.getSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minus}:${secos}`
}
