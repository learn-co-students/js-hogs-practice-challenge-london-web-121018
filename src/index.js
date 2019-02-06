const hogForm = document.querySelector('#hog-form')
const hogCont = document.querySelector('#hog-container')
const formTitle = document.querySelector('h3')

// state
const state = {
  hogs: [],
  selectedHog: null
}

// add single hog
function addHog (hog) {
	hogEl = document.createElement('div');
	hogEl.className = 'hog-card';
	hogEl.innerHTML = `
		<h2>${hog.name}</h2>
		<img src='${hog.image}' height='250'>
		<p>Hog Speciality: ${hog.specialty}</p>
		<p>Weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water: ${hog["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"]}</p>
		<p>Highest medal achieved: ${hog["highest medal achieved"]}</p>
		<h4>Greased? <input class='hog-greased' data-id=${hog.id} type="checkbox" value="greased" ${ hog.greased ? 'checked' : '' }></h4>
    <button class='delete-btn'>Delete pig!</button>
    <button style="margin-left: 20px;" data-id=${hog.id} class='edit-btn'>Edit pig!</button>
	`
	hogCont.append(hogEl);
  const deleteBtn = hogEl.querySelector('.delete-btn')
  deleteBtn.addEventListener('click', () => {
    state.selectedHog = hog
    deleteHog()
      .then(grabHogs);
  })
}

// add all hogs to page
function addHogs(hogs) {
  hogCont.innerHTML = '';
  hogs.forEach(addHog);
}

// create new hog
function createHog () {
  const newHog = {
    "name": hogForm.name.value,
    "specialty": hogForm.specialty.value,
    "greased": hogForm.greased.checked,
    "weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water": parseInt(hogForm.weight.value),
    "highest medal achieved": hogForm.medal.value,
    "image": hogForm.img.value
  }
  postHog(newHog)
    .then(addHog);
}

// edit hog
function editHog() {
  const hog = state.selectedHog;
  hog.name = hogForm.name.value;
  hog.specialty = hogForm.specialty.value;
  hog.greased = hogForm.greased.checked;
  hog["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"] = parseInt(hogForm.weight.value);
  hog["highest medal achieved"] = hogForm.medal.value;
  hog.image = hogForm.img.value;
}

// event listener for create hog button
function addEventListenerToCreateHogBtn(){
  document.addEventListener('click', event => {
    if(event.target.className === "sub-btn"){
      if(formTitle.innerText === 'New Hog'){
        createHog();
      } else {
        editHog();
        updateHog();
      }
    } else if (event.target.className === "hog-greased"){
      hogSelected();
      state.selectedHog.greased = !state.selectedHog.greased
      updateHog()
        .then(grabHogs)
    }
  })
}

// event listener to edit button on page
function addEventListenerToEditHog () {
  document.addEventListener('click', event => {
    if(event.target.className === 'edit-btn'){
      hogSelected();
      populateHogForm();
    }
  })
}

// identify hog selected need a dataset ID on button or event target to work
const hogSelected = () => {
  const hogId = parseInt(event.target.dataset.id);
  state.selectedHog = state.hogs.find( hog => hog.id === hogId )
}

// populate the hog edit form
const populateHogForm = () => {
  formTitle.innerText = 'Edit Hog'
  const hog = state.selectedHog
  hogForm.name.value = hog.name;
  hogForm.specialty.value = hog.specialty;
  hogForm.greased.checked = hog.greased;
  hogForm.weight.value = hog["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"];
  hogForm.medal.value = hog['highest medal achieved'];
  hogForm.img.value = hog.image;
}

// server stuff
// get all hogs
function getHogs () {
  return fetch('http://localhost:3000/hogs')
    .then(resp => resp.json())
}

// post hog
function postHog (hog) {
  return fetch('http://localhost:3000/hogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hog)
  })
}

// delete hog
function deleteHog() {
  return fetch(`http://localhost:3000/hogs/${state.selectedHog.id}`, {
    method: 'DELETE'
  })
}

// update hog
function updateHog() {
  return fetch(`http://localhost:3000/hogs/${state.selectedHog.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state.selectedHog)
  })
  .then(resp => resp.json())
}

// grab hogs from server
const grabHogs = () => {
  getHogs()
    .then(hogs => {
      state.hogs = hogs;
      addHogs(state.hogs);
    })
}

// on page load
function initialization () {
  grabHogs();
  addEventListenerToCreateHogBtn();
  addEventListenerToEditHog();
}

initialization()
