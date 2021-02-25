export function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

export function createElement(tag, classList=[], content='') {
  const element = document.createElement(tag)

  if (classList.length) {
    element.classList.add(...classList)
  }

  if (content) {
    element.textContent = content
  }

  return element
}