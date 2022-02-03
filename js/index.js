import templates from './templates.js'
const canvasDatas = {}
let prevTemplate = templates[0]
let pageCount = 1

// Initialize canvas
const canvas = new fabric.Canvas('canvas')

// Grab Html Elements
const selectorsContainer = document.getElementById('template-selectors')
const downloadButton = document.getElementById('download')
const addTextBtn = document.querySelector('.add-text')
const addAvatarBtn = document.getElementById('add-avatar')
const avatarInput = document.getElementById('avatar-input')
const photoInput = document.getElementById('add-photo')
const photoInputURLBtn = document.getElementById('add-url-photo')
const URLInput = document.getElementById('url-input')

// Attach Event Listeners
photoInputURLBtn.addEventListener('click', addPhotoFromURL)
photoInput.addEventListener('change', addPhotoFromFile)
addAvatarBtn.addEventListener('click', addAvatar)
addTextBtn.addEventListener('click', addText)

// Event Handler Functions
function addPhotoFromFile(e) {
  var tgt = e.target || window.event.srcElement,
    files = tgt.files

  // FileReader support
  if (FileReader && files && files.length) {
    var fr = new FileReader()
    fr.onload = function () {
      addImageToCanvas(fr.result, 0.4, 10)
    }
    fr.readAsDataURL(files[0])
  }
  // Not supported
  else {
    alert('Kullandigin tarayici resim yuklemeyi desteklemiyor!')
  }
}

function addPhotoFromURL(e) {
  e.preventDefault()

  if (!URLInput.value) {
    alert('Fotografin adresini kutucuga gir!')
    return
  }

  addImageToCanvas(URLInput.value, 0.4, 10)
}

async function addAvatar(e) {
  e.preventDefault()

  if (!avatarInput.value) {
    alert('kullanici adini asagidaki kutucuga giriniz.')
    return
  }

  try {
    let response = await fetch(
      `https://www.reddit.com/user/${avatarInput.value}/about.json`,
      { mode: 'cors' }
    )
    let databank = await response.json()
    const encodedSrc = databank.data.icon_img || databank.data.snoovatar_img
    var decodedSrc = encodedSrc.replaceAll('&amp;', '&')
  } catch (error) {
    console.log(error)
    alert('Boyle bir kullanici bulunmamaktadir, tekrar kontrol et.')
  }

  addImageToCanvas(decodedSrc, 0.4, 10)
}

function addText(e) {
  e.preventDefault()

  var text = new fabric.IText('Beni surukle ve duzenle.\n\n', {
    fill: '#555',
    fontFamily: 'Arial',
    left: 400,
    top: 350,
    fontWeight: '300',
    fontSize: '20',
  })
  canvas.add(text)
}

for (const template of templates) {
  const selector = createSelector(template)
  selectorsContainer.appendChild(selector)
}

downloadButton.addEventListener('click', () => {
  const link = document.createElement('a')
  link.href = canvas.toDataURL()

  const templateName = document.querySelector('.selected-template').innerText
  const fileName = templateName.replace(' ', '-').toLowerCase()
  link.download = `${fileName}.png`

  link.click()
})

selectorsContainer.firstChild.classList.add('selected-template')
renderTemplate(templates[0])

function createSelector(template) {
  const selector = document.createElement('button')
  selector.innerText = template.name
  selector.onclick = function () {
    document
      .querySelector('.selected-template')
      .classList.remove('selected-template')
    this.classList.add('selected-template')
    renderTemplate(template)
  }
  return selector
}

function renderTemplate(template) {
  canvasDatas[prevTemplate.name] = JSON.stringify(canvas)
  prevTemplate = template
  const { width, height, backgroundUrl, textFields } = template
  canvas.clear()

  if (template.firstrender) {
    // canvas is not created before
    template.firstrender = false
    canvas.setDimensions({ width, height })
    canvas.setBackgroundImage(backgroundUrl, canvas.renderAll.bind(canvas))
    const iTextFields = textFields.map(
      ({ text, ...options }) => new fabric.IText(text, options)
    )
    canvas.add(...iTextFields)
  } else {
    // resume current canvas
    canvas.setDimensions({ width, height })
    canvas.loadFromJSON(
      canvasDatas[template.name],
      canvas.renderAll.bind(canvas)
    )
  }
}

const lastPage = selectorsContainer.lastChild

const addPageBtn = document.createElement('button')
addPageBtn.textContent = 'Sayfa Ekle ➕'

selectorsContainer.insertBefore(addPageBtn, lastPage)

addPageBtn.addEventListener('click', addPage)

function addPage(e) {
  e.preventDefault()
  pageCount++
  const newTemplate = {
    name: 'Sayfa 1',
    firstrender: true,
    backgroundUrl: './img/default.png',
    width: 640,
    height: 786,
    textFields: [
      {
        text: 'Imleci buraya getir, bir kere tikladiginda boyutlandirabilir, \n ikinci tikladiginda yaziyi degistirebilirsin.\n Bu kutucugun disina tiklayarak buradaki isini bitirebilirsin.',
        fill: '#555',
        fontFamily: 'Arial',
        left: 60,
        top: 260,
        fontWeight: '300',
        fontSize: '20',
      },
    ],
  }
  newTemplate.name = pageCount
  const selector = createSelector(newTemplate)
  selector.innerText = `Sayfa ${pageCount}`
  selectorsContainer.insertBefore(selector, e.target)
}

function roundedCorners(fabricObject, cornerRadius) {
  return new fabric.Rect({
    width: fabricObject.width,
    height: fabricObject.height,
    rx: cornerRadius / fabricObject.scaleX,
    ry: cornerRadius / fabricObject.scaleY,
    left: -fabricObject.width / 2,
    top: -fabricObject.height / 2,
  })
}

function addImageToCanvas(src, scale, radius) {
  try {
  } catch (error) {}
  const imgElement = new Image()
  imgElement.src = src
  imgElement.crossOrigin = 'anonymous'
  imgElement.onerror = function () {
    alert(
      'Fotograf yuklenemedi!\n' +
        'Sunlari dene:\n' +
        ' Url\'den fotograf eklemek icin eklemek istedigin resme sag tikla ve "Resmi yan sekmede ac"a tiklayip acilan sekmedeki adresi yapistir.' +
        'Eger dosya yuklemeyi basaramadiysan:\n' +
        'Yuklemeye calistigin dosyanin resim uzantisi (.jpg, .jpeg, .png ...) olup olmadigini kontrol et.'
    )
  }

  imgElement.onload = function () {
    var imgInstance = new fabric.Image(imgElement, {
      left: 400,
      top: 400,
      opacity: 0.85,
    })
    imgInstance.scale(scale)
    imgInstance.set('clipPath', roundedCorners(imgInstance, radius))
    canvas.add(imgInstance)
  }
}
