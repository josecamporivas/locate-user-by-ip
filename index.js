const ipInformation = document.getElementById("ipInformation")
const form = document.getElementById("form")

document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault()
    data = await getData()

    renderInfo(data)
})

form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const value = e.target.inputIp.value

    const isValidIp = verifyIp(value.trim())
    if(!isValidIp){
        form.classList.add("error")

        setTimeout(() => {
            form.classList.remove("error")
        }, 1500);
    }else{
        const data = await getData(value)
        console.log(data)
        renderInfo(data)
        e.target.inputIp.value = ''
    }
})

function createRowList(key, value){
    const li = document.createElement('li')
    li.classList.add("rowList")
    li.appendChild(createItemRow(formatKey(key), "key"))
    li.appendChild(createItemRow(value, "value"))
    return li
}

function createItemRow(text, classs){
    const p = document.createElement("p")
    p.textContent = text
    p.classList.add(classs)

    return p
}

async function getData(searchIp){
    /* https://ipapi.co/{ip}/{format}/ */

    const ip = searchIp? `/${searchIp}`:""
    const result = await fetch(`https://ipapi.co${ip}/json/`)
    const data = await result.json()
    
    return formatData(data)
}

function renderInfo(data){
    ipInformation.innerHTML = ''
    for (const [key, value] of Object.entries(data)) {
        ipInformation.appendChild(createRowList(key, value))
    }
}

function formatData({ip, city,region,postal,latitude,longitude, country_name,currency, org}){
    const city_region = `${city}, ${region}`
    const lat_long = `${latitude} / ${longitude}`

    return {ip, city: city_region, postal,lat_long, country: country_name,currency, org}
}

function formatKey(key){
    if(key !== "lat_long")
        return key.replaceAll("_", " ")
    
    return "Lat / long"
}

function verifyIp(value){
    const result = value.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
    console.log(result)
    return result

}