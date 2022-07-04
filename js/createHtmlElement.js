/**
 *  <div class="header">
      <div class="logo"></div>
      <h1>Patates Baski 3000</h1>
    </div>
 */

const body = document.querySelector("body");

function createHtmlElement(tag, className, parent, text, id, callback, value, htmlFor, type, placeholder) {
  const element = document.createElement(tag, className);
  if (className) {
    element.classList.add(className);
  }
  if (text) {
    element.textContent = text;
  }
  if (className) {
    element.classList.add(className);
  }
  if (id) {
    element.setAttribute('id', id)
  }
  if (callback) {
    element.addEventListener("click", callback);
  }
  if (value) {
    element.setAttribute('value', value)
  }
  if (htmlFor) {
    element.setAttribute('for', htmlFor)
  }
  if (type) {
    element.setAttribute('type', type)
  }
  if (placeholder) {
    element.setAttribute('placeholder', placeholder)
  }
  parent.appendChild(element);
  return element;
}

export default createHtmlElement;
