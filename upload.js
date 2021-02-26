import { bytesToSize, createElement } from './helpers'

function __DUMMI__ () {}

export function upload (selector, options) {
  let files = []
  // ?? проверяет только null и undefined, а значения топа 0, '', false пропускает
  const onUpload = options.onUpload ?? __DUMMI__
  const input = document.querySelector(selector)
  
  const preview = createElement('div', ['preview'])  
  const openBtn = createElement('button', ['btn'], 'Открыть')
  const uploadBtn = createElement('button', ['btn', 'primary'], 'Загрузить')
  // TODO: подумать как сделать это более изящно
  uploadBtn.style.display = 'none'

  if (options.multi) {
    input.setAttribute('multiple', true)
  }

  if (Array.isArray(options.accept) && options.accept.length) {
    input.setAttribute('accept', options.accept.join(','))
  }

  input.insertAdjacentElement('afterend', preview)
  input.insertAdjacentElement('afterend', uploadBtn)
  input.insertAdjacentElement('afterend', openBtn)

  const triggerInput = () => input.click()

  const changeHandler = event => {
    // по умочанию в event.target.files хранится обьект типа FileList и с ним нельзя работать как с массивом, но это легко исправить, преобразовав его в массив с помощью Array.from
    files = Array.from(event.target.files)
    if (!files.length) return
    
    // не добавляем новые элементы к уже добавленыым ранее, а заменяем ими старые 
    preview.innerHTML = ''
    files.forEach(file => {
      // отбираем только изображения
      if (!file.type.match('image')) return

      // TODO: подумать как сделать это более изящно
      uploadBtn.style.display = 'inline'
      // специальный класс файл ридера
      const reader = new FileReader()

      // обработчик события, срабатывает в момент когда файл считался
      reader.onload = ev => {
        preview.insertAdjacentHTML('afterbegin', `
        <div class="preview-image">
          <div class="preview-remove" data-name="${file.name}">&times;</div>
          <img src="${ev.target.result}" alt="${file.name}"/>
          <div class="preview-info">
            <span>${file.name}</span>
            <span>${bytesToSize(file.size)}</span>
          </div>
        </div>`
        )
      }

      // считывает файл в виде урла, работает ассинхронно, поэтому нужно использовать в паре с onload
      reader.readAsDataURL(file)
    })
  }

  const previewRemoveClickHandler = event => {
    const name = event.target.dataset.name
    if(!name) return
    // просто удалить элемент из массива не достаточно, нужно еще произвести перерендер
    files = files.filter(file => file.name !== name)

    // TODO: подумать как сделать это более изящно
    if (!files.length) {
      uploadBtn.style.display = 'none'
    }
    // найдем в review блоке елемент с нужным именем
    const currentImageBlock = preview.querySelector(`[data-name="${name}"]`).parentElement // same preview.querySelector(`[data-name="${name}"]`).closest('.preview-image')

    currentImageBlock.classList.add('removing')
    // так мы знаем что анимация в css длится 300мс, то просто ставим таймер на это время
    setTimeout(() => currentImageBlock.remove(), 300)
  }

  const clear = el => {
    el.style.bottom = '0'
    el.innerHTML = '<div class="preview-info-progress"></div>'
  }

  const uploadBtnClickHandler = () => {
    // уберем возможность удаления
    preview.querySelectorAll('.preview-remove').forEach(el => el.remove())
    // заменим инфо блок, на отображающий прогресс загрузки
    const previewInfo = preview.querySelectorAll('.preview-info')
    previewInfo.forEach(clear)
  }

  openBtn.addEventListener('click', triggerInput)
  input.addEventListener('change', changeHandler)
  preview.addEventListener('click', previewRemoveClickHandler)
  uploadBtn.addEventListener('click', uploadBtnClickHandler)
}


// 40:50