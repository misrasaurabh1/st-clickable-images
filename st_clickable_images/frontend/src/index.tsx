import {RenderData, Streamlit} from "streamlit-component-lib"

function onRender(event: Event): void {
    const data = (event as CustomEvent<RenderData>).detail

    // Remove existing content
    let child = document.body.lastElementChild;
    if (child) {
        document.body.removeChild(child)
    }
    let compare_mode = data.args["compare_mode"]
    let compare_list: number[] = [];
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
            if (key !== "on-click-border" && key !== "on-click-border-radius") {
                container_div.style[key as any] = data.args["container_div_style"][key]
            }
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
            if (compare_mode) {
                container_div.style["border"] = data.args["container_div_style"]["on-click-border"]
                container_div.style["border-radius" as any] = data.args["container_div_style"]["on-click-border-radius"]
                compare_list.push(i)
                Streamlit.setComponentValue(compare_list)
            } else {
                Streamlit.setComponentValue(i)
            }
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
            if (compare_mode) {
                console.log("Compare mode on")
                container_div.style["border"] = data.args["container_div_style"]["on-click-border"]
                container_div.style["border-radius" as any] = data.args["container_div_style"]["on-click-border-radius"]
                compare_list.push(i)
                Streamlit.setComponentValue(compare_list)
            } else {
                Streamlit.setComponentValue(i)
            }
        }
        let row1 = container_div.appendChild(document.createElement("div"))
        row1.textContent = ""
        if ("healthkart_com" in data.args["rating"][i] || "healthkart_com" in data.args["reviews"][i]) {
            row1.textContent = "HK :" + data.args["rating"][i]["healthkart_com"] + "⭐"
            row1.textContent += " (" + data.args["reviews"][i]["healthkart_com"] + ")"
        }
        if ("amazon_in" in data.args["rating"][i] || "amazon_in" in data.args["reviews"][i]) {
            if (row1.textContent.length > 0) {
                let row2 = container_div.appendChild(document.createElement("div"))
                row2.textContent = "Amazon :" + data.args["rating"][i]["amazon_in"] + "⭐"
                row2.textContent += " (" + data.args["reviews"][i]["amazon_in"] + ")"
            } else {
                row1.textContent = "Amazon :" + data.args["rating"][i]["amazon_in"] + "⭐"
                row1.textContent += " (" + data.args["reviews"][i]["amazon_in"] + ")"
            }
        } else if ("amazon" in data.args["rating"][i] || "amazon" in data.args["reviews"][i]) {
            if (row1.textContent.length > 0) {
                let row2 = container_div.appendChild(document.createElement("div"))
                row2.textContent = "Amazon :" + data.args["rating"][i]["amazon"] + "⭐"
                row2.textContent += " (" + data.args["reviews"][i]["amazon"] + ")"
            } else {
                row1.textContent = "Amazon :" + data.args["rating"][i]["amazon"] + "⭐"
                row1.textContent += " (" + data.args["reviews"][i]["amazon"] + ")"
            }
        }

    }
}

Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)
Streamlit.setComponentReady()