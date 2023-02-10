const saveCurrTabBtn = document.getElementById("save-currtab-btn")
const saveAllTabsBtn = document.getElementById("save-alltabs-btn")
const deleteBtn = document.getElementById("delete-btn")

const ulTablistEl = document.getElementById("ul-tablist-element")

// save format: url + space + title
let savedLinks = []
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("savedLinks"))
if (leadsFromLocalStorage) {
    savedLinks = leadsFromLocalStorage
    render(savedLinks)
}

function render(savedLinks) {
    let listItems = ""
    for (let i = 0; i < savedLinks.length; i++) {
        const [url, ...rem] = savedLinks[i].split(" ")
        const title = rem.join(" ")
        listItems += `
            <li>
                <a target='_blank' href='${url}'>
                    ${title}
                </a>
            </li>
        `
    }
    ulTablistEl.innerHTML = listItems
}

saveCurrTabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        if (!savedLinks.includes(tabs[0].url + " " + tabs[0].title))
            savedLinks.unshift(tabs[0].url + " " + tabs[0].title)
        localStorage.setItem("savedLinks", JSON.stringify(savedLinks) )
        render(savedLinks)
    })
})

saveAllTabsBtn.addEventListener("click", function(){    
    chrome.tabs.query({currentWindow: true}, function(tabs){
        for (let tab of tabs) {
            if (!savedLinks.includes(tab.url + " " + tab.title))
                savedLinks.unshift(tab.url + " " + tab.title)
        }
        localStorage.setItem("savedLinks", JSON.stringify(savedLinks))   
        render(savedLinks)
    })
})

deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    savedLinks = []
    render(savedLinks)
})