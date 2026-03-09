const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues"
let issuesData = []

const loginPage = document.getElementById("loginPage")
const dashboard = document.getElementById("dashboard")
const loading = document.getElementById("loading")
const issuesContainer = document.getElementById("issuesContainer")
const username = document.getElementById("username")
const password = document.getElementById("password")
const totalCount = document.getElementById("totalCount")
const searchInput = document.getElementById("searchInput")
const modal = document.getElementById("modal")
const modalTitle = document.getElementById("modalTitle")
const modalDesc = document.getElementById("modalDesc")
const modalPriority = document.getElementById("modalPriority")


function showLoader() {
    loading.classList.remove("hidden")
    loading.classList.add("flex")
}

function hideLoader() {
    loading.classList.add("hidden")
    loading.classList.remove("flex")
}

function login() {

    if (username.value === "admin" && password.value === "admin123") {
        loginPage.classList.add("hidden")
        dashboard.classList.remove("hidden")
        loadIssues("all")
    } else {
        alert("Invalid Credentials")
    }
}



async function loadIssues(type) {
    setActiveTab(type)
    showLoader()
    const res = await fetch(API)
    const data = await res.json()
    issuesData = data.data
    let filtered = issuesData
    if (type === "open") {
        filtered = issuesData.filter(i => i.status === "open")
    }
    if (type === "closed") {
        filtered = issuesData.filter(i => i.status === "closed")
    }
    totalCount.innerText = filtered.length
    displayIssues(filtered)
    hideLoader()

}


// display issues card
function displayIssues(list) {
    issuesContainer.innerHTML = ""
    list.forEach(issue => {
        const border = issue.status === "open" ?
            "border-t-4 border-green-500" :
            "border-t-4 border-purple-500"
        const priority = issue.priority.toUpperCase();
        let priorityClass = "";
        let icon = "";











        if (priority === "HIGH") {
            priorityClass = "bg-red-100 text-red-600 border border-red-300 flex items-center justify-center ml-auto  py-1 rounded";
            icon = '<span class=" flex items-center justify-center bg-red-100 text-red-600 rounded-full text-xs"><img src="assets/open-Status.png"></span>'

        }

        if (priority === "MEDIUM") {
            priorityClass = "bg-red-100 text-red-600 border border-red-300 flex items-center justify-center ml-auto  py-1 rounded";
            icon = '<span class="flex items-center justify-center bg-red-100 text-red-600 rounded-full text-xs"><img src="assets/open-Status.png"></span>'

            Medium - Status
        }

        if (priority === "LOW") {
            priorityClass = "bg-red-100 text-red-600 border border-red-300 flex items-center justify-center ml-auto  py-1 rounded";
            icon = '<span class="flex items-center justify-center bg-red-100 text-red-600 rounded-full text-xs"><img src="assets/closed-Status.png"></span>'
        }


        const card = document.createElement("div")
        card.className = `bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer ${border}`
        card.onclick = () => openModal(issue)
        card.innerHTML = `
                        <div class="flex justify-center mb-2 ">${icon}
                            <span class="text-xs px-2 py-1 rounded ${priorityClass}">${priority}</span>
                            </div>
                            <h3 class="font-semibold text-sm mb-1">${issue.title}</h3>
                            <p class="text-gray-500 text-xs mb-5">${issue.description.slice(0,70)}</p>
                            
                            <div class="flex gap-2 space-y-2 border-b mt-3 pb-3">
                                <span class="border border-red-300 bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">🐞 BUG </span>
                                <span class="border border-yellow-300 bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">🛟 HELP WANTED</span>
                            </div>
                            <div class="flex flex-col space-y-1 mt-3 ">
                                <span class="text-xs text-gray-500"># ${issue.author}</span>
                                <span class="text-xs text-gray-500">${new Date(issue.createdAt).toLocaleDateString()}</span>
                            </div>
                         
                         
                        </div>   
                        `
        issuesContainer.appendChild(card)
    })
}


// modal functions popup
function openModal(issue) {

    modal.classList.remove("hidden")
    modal.classList.add("flex")

    modalTitle.innerText = issue.title
    modalDesc.innerText = issue.description

    const date = new Date(issue.createdAt).toLocaleDateString()

    document.getElementById("modalDate").innerText = date
    document.getElementById("modalAssignee").innerText = issue.author
    document.getElementById("modalAssigneeName").innerText = issue.author


    const status = document.getElementById("modalStatus")

    if (issue.status === "open") {
        status.className = "bg-green-500 text-white text-xs px-3 py-1 rounded-full"
        status.innerText = "OPENED"
    } else {
        status.className = "bg-purple-500 text-white text-xs px-3 py-1 rounded-full"
        status.innerText = "CLOSED"
    }


    const p = issue.priority.toUpperCase()

    modalPriority.innerText = p

    modalPriority.className = "px-3 py-1 rounded-full text-xs font-semibold text-white"

    if (p === "HIGH") {
        modalPriority.classList.add("bg-red-500")
    }

    if (p === "MEDIUM") {
        modalPriority.classList.add("bg-yellow-500")
    }

    if (p === "LOW") {
        modalPriority.classList.add("bg-gray-500")
    }

}



function closeModal() {

    modal.classList.add("hidden")
    modal.classList.remove("flex")

}



async function searchIssues() {

    const text = searchInput.value.trim()

    if (!text) {
        loadIssues("all")
        return
    }

    showLoader()

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`)

    const data = await res.json()

    displayIssues(data.data)

    hideLoader()

}



function setActiveTab(type) {

    document.querySelectorAll(".tab").forEach(btn => {
        btn.classList.remove("active")
    })

    if (type === "all") allBtn.classList.add("active")
    if (type === "open") openBtn.classList.add("active")
    if (type === "closed") closedBtn.classList.add("active")

}