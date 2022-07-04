import templates from "./templates.js";
import createHtmlElement from './createHtmlElement.js';
let canvasData = {};
let pageCount = 1;
let previousTemplate;

const body = document.querySelector('body')

// Header Section
const header = createHtmlElement('div', 'header', body)
createHtmlElement('div', 'logo', header)
createHtmlElement('h1', null, header, 'Patates Baski 3000')

// Selectors
const selectorsContainer = createHtmlElement('div', null, body, null,"template-selectors")

// Download Button
const downloadButton = createHtmlElement('button', null, body, 'Fotografi Indir', 'download', handleDownload)

// Main Section
const main = createHtmlElement('div', 'main', body)
const canvasElement = createHtmlElement('canvas', null, main, null, 'canvas', null)

// All Tools
const tools = createHtmlElement('form', 'tools', main)
// Font-Family Elements
const fontFamily = createHtmlElement('div', 'font-family-controls', tools)
const fontFamilyLabel = createHtmlElement('label', 'font-family-controls', fontFamily, "Yazi tipi: ", null, null, null, 'font-family-select')
const fontFamilySelect = createHtmlElement('select', null, fontFamily, null, 'font-family-select', changeFontFamily)
const fontFamilyOption1 = createHtmlElement('option', null, fontFamilySelect, 'Arial', null, null, 'Arial')
const fontFamilyOption2 = createHtmlElement('option', null, fontFamilySelect, 'Courier', null, null, 'Courier')
const fontFamilyOption3 = createHtmlElement('option', null, fontFamilySelect, 'Sans Serif', null, null, 'Sans Serif')
const fontFamilyOption4 = createHtmlElement('option', null, fontFamilySelect, 'Serif', null, null, 'Serif')
// Font-Size Elements
const fontSize = createHtmlElement('div', 'font-size-controls', tools)
const fontSizeTitle = createHtmlElement('p', null, fontSize, 'Yazi Boyutu')
const fontSizeBtnInc = createHtmlElement('button', null, fontSize, 'A-', 'decrease-font-size-btn', () => adjustFontSize("-"))
const fontSizeBtnDec = createHtmlElement('button', null, fontSize, 'A+', 'increase-font-size-btn', () => adjustFontSize("+"))
// Font-Weight Elements
const fontWeight = createHtmlElement('div', 'font-weight-controls', tools)
const fontWeightTitle = createHtmlElement('p', null, fontWeight, 'Yazi Kalinligi')
const fontWeightBtnInc = createHtmlElement('button', null, fontWeight, '-', 'decrease-font-weight-btn', () => adjustFontWeight("-"))
const fontWeightBtnDec = createHtmlElement('button', null, fontWeight, '+', 'increase-font-weight-btn', () => adjustFontWeight("+"))
// Add Text Button
const addTextBtn = createHtmlElement('button', 'add-text', tools, 'Yazi Ekle', null, addText)
// Remove Text Button
const removeTextBtn = createHtmlElement('button', 'remove-text', tools, 'Yaziyi/Yazilari Sil', null , deleteText)
// Add Photo 
const labelAddPhoto = createHtmlElement('label', null, tools, 'Dosyadan Foto Ekle ⬅️ ', null, null, null, 'add-photo')
const photoInput = createHtmlElement('input', null, tools, null, 'add-photo', addPhotoFromFile, null, null, 'file')
const URLInputLabel = createHtmlElement('label', null, tools, null, 'url-input', addPhotoFromURL, null, null, null, "Fotograf url")
const photoInputURLBtn = createHtmlElement('button', null, tools, "Url'den Foto Ekle ⬇️", 'add-url-photo', addPhotoFromURL)
const URLInput = createHtmlElement('input', null, tools, null, 'url-input', null, null, null, 'text', 'Fotograf URL')

// Initialize canvas
const canvas = new fabric.Canvas("canvas");
// Attach Select Listener for Canvas Element
canvas.on({
  "selection:updated": handleSelection,
  "selection:created": handleSelection,
});

initializeSelectors()

// Event Handler Functions
function addPhotoFromFile(event) {
  var tgt = event.target || window.event.srcElement,
    files = tgt.files;

  // FileReader support
  if (FileReader) {
    var fr = new FileReader();
    fr.onloadend = function () {
      addImageToCanvas(fr.result, 0.4, 10);
    };
    if(files[0]){
      fr.readAsDataURL(files[0]);
    }
  }
  // Not supported
  else {
    alert("Kullandigin tarayici resim yuklemeyi desteklemiyor!");
  }
}

function addPhotoFromURL(e) {
  e.preventDefault();

  if (!URLInput.value) {
    alert("Fotografin adresini kutucuga gir!");
    return;
  }

  addImageToCanvas(URLInput.value, 0.4, 10);
}

function addText(e) {
  e.preventDefault();
  var text = new fabric.Textbox("Beni surukle ve duzenle.\n\n", {
    fill: "#111",
    fontFamily: "Arial",
    left: 400,
    top: 350,
    fontWeight: "300",
    fontSize: "20",
    lockUniScaling: false,
  });
  canvas.add(text);
}

function adjustFontSize(changeType) {
  event.preventDefault(); // check tis
  let newFontSize;
  const activeObject = canvas.getActiveObject();
  if (!activeObject) {
    alert("Yazi secili degil!!");
    return;
  }
  const currentFontSize = Number(activeObject.fontSize);
  if (changeType === "+") {
    newFontSize = `${currentFontSize + 2}`;
  } else if (changeType === "-") {
    newFontSize = `${currentFontSize - 2}`;
  }
  canvas.getActiveObject().set("fontSize", newFontSize);
  canvas.renderAll();
}

function adjustFontWeight(changeType) {
  event.preventDefault();
  let newFontWeight;
  const activeObject = canvas.getActiveObject();
  if (!activeObject) {
    alert("Yazi secili degil!!");
    return;
  }
  const currentFontWeight = Number(activeObject.fontWeight);
  if (changeType === "+") {
    newFontWeight = `${currentFontWeight + 100}`;
  } else if (changeType === "-") {
    newFontWeight = `${currentFontWeight - 100}`;
  }
  canvas.getActiveObject().set("fontWeight", newFontWeight);
  canvas.renderAll();
}

function handleDownload() {
  const link = document.createElement("a");
  link.href = canvas.toDataURL();
  const templateName = document.querySelector(".selected-template").innerText;
  const fileName = templateName.replace(" ", "-").toLowerCase();
  link.download = `${fileName}.png`;
  link.click();
}

function addPage(e) {
  e.preventDefault();
  pageCount++;
  const newsPerPage = newsPerPageInput.value;
  let newTemplate;

  if (newsPerPage === "3") {
    newTemplate = { ...templates[1] };
  } else if (newsPerPage === "2") {
    newTemplate = { ...templates[3] };
  } else {
    newTemplate = { ...templates[4] };
  }

  newTemplate.name = `Sayfa ${pageCount}`;
  const selector = createSelector(newTemplate);
  selector.innerText = `Sayfa ${pageCount}`;
  selectorsContainer.insertBefore(selector, e.target);
  selector.click();
}

function deleteText(event) {
  event.preventDefault();
  const activeObjects = canvas.getActiveObjects()
  if(activeObjects.length === 0){
    alert('Yazi secili degil!!')
  }
  activeObjects.forEach((obj) => {
    canvas.remove(obj);
  });
  canvas.discardActiveObject().renderAll();
}

function handleSelection(event) {
  if (canvas.getActiveObjects().length > 1 || !event.target.text) {
    return;
  }
  const selectedObjectFontFamily = event.target.fontFamily;
  const option = document.querySelector(
    `option[value="${selectedObjectFontFamily}"]`
  );
  option.selected = true;
}

function changeFontFamily(event) {
  const activeObject = canvas.getActiveObject();
  const newFontFamily = event.target.value;
  if (!activeObject) {
    alert("Yazi sec!");
  }
  activeObject.set("fontFamily", newFontFamily);
  canvas.renderAll();
}
// -End- Event Handler Functions

// Helpers
function createSelector(template) {
  const selector = document.createElement("button");
  selector.innerText = template.name;
  selector.onclick = function () {
    const currentSelection = document.querySelector(".selected-template");
    currentSelection.classList.remove("selected-template");
    this.classList.add("selected-template");
    renderTemplate(template);
  };
  return selector;
}

function renderTemplate(template) {
  if (previousTemplate) {
    canvasData[previousTemplate.name] = JSON.stringify(canvas);
  }
  previousTemplate = template;
  const { width, height, backgroundUrl, textFields } = template;
  textFields.forEach((textField) => {
    // textField.on("selected", function(){alert('selected');});
  });

  canvas.clear();

  if (canvasData[template.name]) {
    // resume current canvas
    canvas.setDimensions({ width, height });
    canvas.loadFromJSON(
      canvasData[template.name],
      canvas.renderAll.bind(canvas)
    );
  } else {
    // canvas is not created before
    canvas.setDimensions({ width, height });
    canvas.setBackgroundImage(backgroundUrl, canvas.renderAll.bind(canvas));
    const textBoxFields = textFields.map(
      ({ text, ...options }) => new fabric.Textbox(text, options)
    );
    canvas.add(...textBoxFields);
  }
}

function roundedCorners(fabricObject, cornerRadius) {
  return new fabric.Rect({
    width: fabricObject.width,
    height: fabricObject.height,
    rx: cornerRadius / fabricObject.scaleX,
    ry: cornerRadius / fabricObject.scaleY,
    left: -fabricObject.width / 2,
    top: -fabricObject.height / 2,
  });
}

function addImageToCanvas(src, scale, radius) {
  const imgElement = new Image();
  imgElement.crossOrigin = "anonymous";
  imgElement.src = src;
  imgElement.onerror = function () {
    alert(
      "Fotograf yuklenemedi!\n" +
        "Sunlari dene:\n" +
        ' Url\'den fotograf eklemek icin eklemek istedigin resme sag tikla ve "Resmi yan sekmede ac"a tiklayip acilan sekmedeki adresi yapistir.' +
        "Eger dosya yuklemeyi basaramadiysan:\n" +
        "Yuklemeye calistigin dosyanin resim uzantisi (.jpg, .jpeg, .png ...) olup olmadigini kontrol et."
    );
  };

  imgElement.onload = function () {
    var imgInstance = new fabric.Image(imgElement, {
      left: 400,
      top: 400,
      opacity: 0.85,
    });
    imgInstance.scale(scale);
    imgInstance.set("clipPath", roundedCorners(imgInstance, radius));
    canvas.add(imgInstance);
  };
}

function initializeSelectors() {
  for (let index = 0; index < 3; index += 1) {
    const template = templates[index];
    const selector = createSelector(template);
    selectorsContainer.appendChild(selector);
  }
  selectorsContainer.firstChild.classList.add("selected-template");
  renderTemplate(templates[0]);
  const lastPage = selectorsContainer.lastChild;
  const addPageBtn = document.createElement("button");
  addPageBtn.innerHTML = `<select id="pet-select">
  <option value="3">3</option>
  <option value="2">2</option>
  <option value="1">1</option>
  </select> haberli sayfa ekle`;
  const newsPerPageInput = addPageBtn.querySelector("select");
  newsPerPageInput.onclick = (e) => {
    e.stopPropagation();
  };
  selectorsContainer.insertBefore(addPageBtn, lastPage);
  addPageBtn.addEventListener("click", addPage);
}
