console.log("Great")

document.querySelector('output').innerText = 'YAY'

const res = await fetch('airquotes.xml')

const text = await res.text()


const parser = new DOMParser();
const xmlDoc = parser.parseFromString(text, "text/xml");

console.log(xmlDoc)

console.log(xmlDoc.getElementsByTagName("item")[0])