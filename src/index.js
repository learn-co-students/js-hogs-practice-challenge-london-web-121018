const containerOfHogs = document.getElementById("hog-container");
const submitBtn = document.getElementById("hog-form");

let hogs;

function renderAllHogs(hogs){
    containerOfHogs.innerHTML = '';
    for(const hog of hogs){
        renderIndividualHog(hog);
    }
}

function renderIndividualHog(hog){
    containerOfHogs.innerHTML += `
    <div class="hog-card" data-id="${hog.id}"> <h4>${hog.name}</h4>
    <p>Specialty: ${hog.specialty}</p>
    <img src="${hog.image}">
    <h6>Weight as a ratio of hog to LG - 24.7 Cu. 
    Ft. French Door Refrigerator with Thru-the-Door Ice and Water: 
    ${hog["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"]}</h6>
    <p>Highest medal achieved: ${hog["highest medal achieved"]} </p>
    <h4>${hog.greased ?  "Greased" : "Clean" }</h4>
    <input type="checkbox" id="${hog.id}" ${hog.greased ?  'checked' : "unchecked" }>
    </div>`

}

function greasyButtonListener(){
    containerOfHogs.addEventListener('click', e=>{
        if(e.target && e.target.matches('input')){
            console.log(e.target.id)
            greaseThePig(hogs[e.target.id]);
        }
    });
}

function greaseThePig(hog){
    hog.greased = !hog.greased
    updateHog(hog)
    renderAllHogs(hogs)
}

function createHog(){
    submitBtn.addEventListener('submit', e=>{
        e.preventDefault();
         let hogForm = new FormData(document.getElementById("hog-form"))
         validateHogValues(hogForm);
    })
}

function validateHogValues(hog){
    correctHog = {id: hogs.length, 
                name: hog.get('name'),
                specialty: hog.get('specialty'),
                greased:   hog.get('greased') ? true : false,
                "weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water": hog.get('weight'),
                "highest medal achieved": hog.get('medal'),
                image: hog.get('image')
            }
    newHog(correctHog);
}

function initialize(){
    getHogs()
    .then(pigs =>{
        hogs = pigs
        renderAllHogs(hogs);
    })
    greasyButtonListener()
    createHog()
}

function getHogs(){
    return fetch("http://localhost:3000/hogs").then(resp => resp.json())
}
function updateHog(hog){
    return fetch(`http://localhost:3000/hogs/${hog.id}`,{
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hog)
    }).then(resp => resp.json())
}
function newHog(hog){
    return fetch('http://localhost:3000/hogs',{
      method:'Post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hog)
    }).then(getHogs).then(renderAllHogs);
  }
initialize()



