const hogContainer = document.querySelector("#hog-container")
const hogForm = document.querySelector("#hog-form")

const state = {
  hogs: [],
  currentHog: null,
}




function displayHogs() {

  hogContainer.innerHTML = ""
  state.hogs.forEach(hog => {
    hogDisplay = document.createElement("div")
    hogDisplay.className = "hog-card"
    hogDisplay.innerHTML = `<h2>${hog.name}</h2><img src = ${hog.image}><br>Speciality: ${hog.specialty} <br>Weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water: ${hog["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"]}<br>Highest Medal Achieved: ${hog['highest medal achieved']}<br><h4>Greased?</h4> `
    greasedButton = document.createElement('input')
    greasedButton.setAttribute("type", "checkbox")
    greasedButton.id = hog.id
    if (hog.greased) {
      greasedButton.checked = true
    }
    deleteButton = document.createElement("span")
    deleteButton.innerHTML = "<br><button class='delete'>Delete this hog</button>"
    deleteButton.id = hog.id
    hogDisplay.append(greasedButton)
    hogDisplay.append(deleteButton)
    hogContainer.append(hogDisplay)
  })
}

document.addEventListener("click", (click) => {
  //debugger
  console.log(click.target)
  if (click.target.type === "checkbox") {
    state.currentHog = state.hogs.find((hog) => { return hog.id === parseInt(click.target.id) })
    console.log(state.currentHog)
    state.currentHog.greased = !state.currentHog.greased
    updateHog()
    if (state.currentHog.greased) {
      alert(`Your hog has now been greased`)
    } else {
      alert(`Your hog has now been degreased`)
    }
  } else if (click.target.className === "submit") {
    event.preventDefault()
    buildHog()
    displayHogs()
    addHog()
  } else if (click.target.className === "delete") {
    state.currentHog = state.hogs.find((hog) => { return hog.id === parseInt(click.target.parentElement.id) })
    console.log(state.currentHog)
    deleteHog().then(getHogs)
  }
}
)

function updateHog() {
  return fetch(`http://localhost:3000/hogs/${state.currentHog.id}`, {
    method: "PATCH",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state.currentHog)
  })
}

function addHog() {
  return fetch(`http://localhost:3000/hogs/`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state.currentHog)
  })
}

function deleteHog() {
  return fetch(`http://localhost:3000/hogs/${state.currentHog.id}`, {
    method: "DELETE",
    headers: { 'Content-Type': 'application/json' },
  })
}

function buildHog() {
  state.currentHog = {}
  state.currentHog.name = hogForm.name.value
  state.currentHog.greased = hogForm.greased.checked
  state.currentHog.specialty = hogForm.specialty.value
  state.currentHog["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"] = hogForm.weight.value
  state.currentHog.image = hogForm.img.value
  state.currentHog["highest medal achieved"] = hogForm.medal.value
  state.hogs.push(state.currentHog)
  console.log(state.currentHog)
}


function getHogs() {
  return fetch("http://localhost:3000/hogs").then(response => { return response.json() }).then(resp => state.hogs = resp).then(displayHogs)
}


getHogs()