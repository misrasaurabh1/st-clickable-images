import { Streamlit, RenderData } from "streamlit-component-lib"

function onRender(event: Event): void {
  const data = (event as CustomEvent<RenderData>).detail

  // Remove existing content
  let child = document.body.lastElementChild;
  if (child) {
    document.body.removeChild(child)
  }

  // Add and style the image container
  let div = document.body.appendChild(document.createElement("div"))
  for (let key in data.args["div_style"]) {
    div.style[key as any] = data.args["div_style"][key]
  }

  // Add and style all images
  let imagesLoaded = 0
  for (let i = 0; i < data.args["paths"].length; i++) {
    let container_div = div.appendChild(document.createElement("div"))
    for (let key in data.args["container_div_style"]) {
      container_div.style[key as any] = data.args["container_div_style"][key]
    }
    let img_div = container_div.appendChild(document.createElement("div"))
    for (let key in data.args["img_div_style"]) {
      img_div.style[key as any] = data.args["img_div_style"][key]
    }
    let img = img_div.appendChild(document.createElement("img"))
    for (let key in data.args["img_style"]) {
      img.style[key as any] = data.args["img_style"][key]
    }
    img.src = data.args["paths"][i]
    if (data.args["titles"].length > i) {
      img.title = data.args["titles"][i]
    }
    img_div.onclick = function (): void {
      Streamlit.setComponentValue(i)
    }
    // eslint-disable-next-line
    img.onload = function (): void {
      imagesLoaded++
      if (imagesLoaded === data.args["paths"].length) {
        Streamlit.setFrameHeight()
      }
    }

    let caption = container_div.appendChild(document.createElement("div"))
    for (let key in data.args["text_div_style"]) {
      caption.style[key as any] = data.args["text_div_style"][key]
    }
    caption.textContent = data.args["titles"][i]
    caption.onclick = function (): void {
      Streamlit.setComponentValue(i)
    }
  }
}

Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)
Streamlit.setComponentReady()