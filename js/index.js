const saveCurrTabBtn = document.getElementById("save-currtab-btn")
const saveAllTabsBtn = document.getElementById("save-alltabs-btn")
const deleteBtn = document.getElementById("delete-all-btn")
// get backup-google-btn element
const backupBtn = document.getElementById("backup-google-btn")

const ulTablistEl = document.getElementById("ul-tablist-element")

/*
const savedLinks = [
    {
        id: "8f81f04d-ef4a-4e12-8a38-2d2c57a9d446",
        url: "https://www.google.com/",
        title: "Google",
        iconUrl: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
    },
];
*/
let savedLinks = []
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("savedLinks"))
if (leadsFromLocalStorage) {
    savedLinks = leadsFromLocalStorage
    render(savedLinks)
}

function render(savedLinks) {
    let listItems = ""
    for (const savedLink of savedLinks) {
        // const [url, ...rem] = savedLinks[i].split(" ")
        // const title = rem.join(" ")
        const iconUrl = (savedLink.iconUrl === "" || savedLink.iconUrl == undefined) ? "./assets/icons/white_icon.png" : savedLink.iconUrl
        let displayTitle = savedLink.title
        if (savedLink.title.length > 60)
            displayTitle = displayTitle.substr(0, 60) + "..."
        listItems += `
            <div class="tab-row-container">
                <a target='_blank' href='${savedLink.url}' class="tab-row">
                    <img class="tab-icon" src="${iconUrl}">
                    <li>${displayTitle}</li>
                </a>
                <div class="close-btn">
                    <span class="material-symbols-outlined delete-row-btn" data-id="${savedLink.id}">close</span>
                </div>
            </div>
        `
    }
    ulTablistEl.innerHTML = listItems
    const closeBtns = document.querySelectorAll(".delete-row-btn")
    closeBtns.forEach(closeBtn => {
        closeBtn.addEventListener("click", function (val) {
            deleteFromSavedLinks(val.target.dataset.id)
            localStorage.setItem("savedLinks", JSON.stringify(savedLinks))
            render(savedLinks)
        })
    })
}

function deleteFromSavedLinks(uuid) {
    const index = savedLinks.findIndex(link => link.id === uuid);
    if (index !== -1) {
        savedLinks.splice(index, 1);
    }
}

saveCurrTabBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const existingLink = savedLinks.find(item => item.url === tabs[0].url && item.title === tabs[0].title)
        if (!existingLink) {
            addToSavedLinks(
                self.crypto.randomUUID(),
                tabs[0].url,
                tabs[0].title,
                tabs[0].favIconUrl
            )
        }
        localStorage.setItem("savedLinks", JSON.stringify(savedLinks))
        render(savedLinks)
    })
})

saveAllTabsBtn.addEventListener("click", function () {
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
        for (let tab of tabs) {
            let existingLink = savedLinks.find(item => item.url === tab.url && item.title === tab.title)
            if (!existingLink) {
                addToSavedLinks(
                    self.crypto.randomUUID(),
                    tab.url,
                    tab.title,
                    tab.favIconUrl
                )
            }
        }
        localStorage.setItem("savedLinks", JSON.stringify(savedLinks))
        render(savedLinks)
    })
})

function addToSavedLinks(id, url, title, iconUrl) {
    savedLinks.unshift({ id, url, title, iconUrl })
}

deleteBtn.addEventListener("dblclick", function () {
    localStorage.clear()
    savedLinks = []
    render(savedLinks)
})