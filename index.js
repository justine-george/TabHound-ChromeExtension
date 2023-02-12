const saveCurrTabBtn = document.getElementById("save-currtab-btn")
const saveAllTabsBtn = document.getElementById("save-alltabs-btn")
const deleteBtn = document.getElementById("delete-all-btn")

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
        let displayTitle = title
        if (title.length > 50)
            displayTitle = displayTitle.substr(0, 48) + "..."
        listItems += `
            <div class="tab-row">
                <li>
                    <a target='_blank' href='${url}'>
                        ${displayTitle}
                    </a>
                </li>
                <div class="close-btn">
                    <span class="material-symbols-outlined delete-row-btn" data-id="${url} ${title}">close</span>
                </div>
            </div>
        `
    }
    ulTablistEl.innerHTML = listItems
    const closeBtns = document.querySelectorAll(".delete-row-btn")
    closeBtns.forEach(closeBtn => {
        closeBtn.addEventListener("click", function(val) {
            deleteFromSavedLinks(val.target.dataset.id)
            localStorage.setItem("savedLinks", JSON.stringify(savedLinks) )
            render(savedLinks)
        })
    })
}

function deleteFromSavedLinks(value) {
    const index = savedLinks.indexOf(value)
    if (index > -1)
        savedLinks.splice(index, 1) // remove one element starting from index
}

saveCurrTabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        const iconUrl = tabs[0].favIconUrl

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