import templates from "./templates.js";
let canvasData = {};
let pageCount = 1;
let previousTemplate;

// Initialize canvas
const canvas = new fabric.Canvas("canvas");

// Grab Html Elements
const selectorsContainer = document.getElementById("template-selectors");
const downloadButton = document.getElementById("download");
const addTextBtn = document.querySelector(".add-text");
const photoInput = document.getElementById("add-photo");
const photoInputURLBtn = document.getElementById("add-url-photo");
const URLInput = document.getElementById("url-input");
const increaseFontSizeBtn = document.getElementById("increase-font-size-btn");
const decreaseFontSizeBtn = document.getElementById("decrease-font-size-btn");
const increaseFontWeightBtn = document.getElementById(
  "increase-font-weight-btn"
);
const decreaseFontWeightBtn = document.getElementById(
  "decrease-font-weight-btn"
);
const removeTextBtn = document.querySelector(".remove-text");
const fontSelect = document.getElementById("font-family-select");

// Attach Event Listeners
photoInputURLBtn.addEventListener("click", addPhotoFromURL);
photoInput.addEventListener("change", addPhotoFromFile);
addTextBtn.addEventListener("click", addText);
increaseFontSizeBtn.addEventListener("click", () => adjustFontSize("+"));
decreaseFontSizeBtn.addEventListener("click", () => adjustFontSize("-"));
increaseFontWeightBtn.addEventListener("click", () => adjustFontWeight("+"));
decreaseFontWeightBtn.addEventListener("click", () => adjustFontWeight("-"));
downloadButton.addEventListener("click", handleDownload);
removeTextBtn.addEventListener("click", deleteText);
fontSelect.addEventListener("change", changeFontFamily);

// Event Handler Functions
function addPhotoFromFile(e) {
  var tgt = e.target || window.event.srcElement,
    files = tgt.files;

  // FileReader support
  if (FileReader && files && files.length) {
    var fr = new FileReader();
    fr.onload = function () {
      addImageToCanvas(fr.result, 0.4, 10);
    };
    fr.readAsDataURL(files[0]);
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
  event.preventDefault();
  let newFontSize;
  const activeObject = canvas.getActiveObject();
  if (!activeObject) {
    alert("Yazi secili degil!!");
    return;
  }

  // console.log(activeObject);
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

  // console.log(activeObject);
  const currentFontWeight = Number(activeObject.fontWeight);
  if (changeType === "+") {
    newFontWeight = `${currentFontWeight + 100}`;
  } else if (changeType === "-") {
    newFontWeight = `${currentFontWeight - 100}`;
  }
  // console.log(currentFontWeight);
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

// -End- Event Handler Functions

for (let index = 0; index < 3; index += 1) {
  const template = templates[index];
  const selector = createSelector(template);
  selectorsContainer.appendChild(selector);
}

selectorsContainer.firstChild.classList.add("selected-template");
renderTemplate(templates[0]);

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
    // console.log('resume');
    // resume current canvas
    canvas.setDimensions({ width, height });
    canvas.loadFromJSON(
      canvasData[template.name],
      canvas.renderAll.bind(canvas)
    );
  } else {
    // console.log("not created before");
    // canvas is not created before
    canvas.setDimensions({ width, height });
    canvas.setBackgroundImage(backgroundUrl, canvas.renderAll.bind(canvas));
    const textBoxFields = textFields.map(
      ({ text, ...options }) => new fabric.Textbox(text, options)
    );
    canvas.add(...textBoxFields);
  }
}

const lastPage = selectorsContainer.lastChild;

const addPageBtn = document.createElement("button");
addPageBtn.textContent = "Sayfa Ekle ▼";
addPageBtn.innerHTML = `<select id="pet-select">
<option value="3">3</option>
<option value="2">2</option>
<option value="1">1</option>
</select> haberli sayfa ekle`;

const newsPerPageInput = addPageBtn.querySelector("select");
newsPerPageInput.onclick = (e) => {
  e.stopPropagation();
};

console.dir(newsPerPageInput.value);

selectorsContainer.insertBefore(addPageBtn, lastPage);

addPageBtn.addEventListener("click", addPage);

function addPage(e) {
  e.preventDefault();
  pageCount++;
  // console.log(newsPerPageInput.value);
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
  try {
  } catch (error) {}
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

function deleteText(event) {
  event.preventDefault();
  canvas.getActiveObjects().forEach((obj) => {
    canvas.remove(obj);
  });
  canvas.discardActiveObject().renderAll();
}

canvas.on({
  "selection:updated": HandleElement,
  "selection:created": HandleElement,
});

function HandleElement(event) {
  const selectedObjectFontFamily = event.target.fontFamily;
  const option = document.querySelector(
    `option[value="${selectedObjectFontFamily}"]`
  );
  console.log(selectedObjectFontFamily);
  option.selected = true;
}

function changeFontFamily(event) {
  const activeObject = canvas.getActiveObject();
  const newFontFamily = event.target.value;
  if (!activeObject) {
    alert("Yazi sec!");
  }
  console.log(activeObject);
  activeObject.set("fontFamily", newFontFamily);
  canvas.renderAll();
}
