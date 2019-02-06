const hogsUrl = 'http://localhost:3000/hogs'
const hogDivEl = document.querySelector('#hog-container');
const hogformEl = document.querySelector('#hog-form');
// let test ;

//STATE///////////////////////////////////////////////////////////////////////////////////////////

const state = {
                hogs: [],
                selectedHog: null
                };

//MAIN PAGE EL////////////////////////////////////////////////////////////////////////////////////

const showHogCard = (hog) => {
    const divCard = document.createElement('div');

    divCard.className = 'hog-card';
    divCard.innerHTML = `<h2>${hog.name}</h2>
                         <img src="${hog.image}">
                         <h3>Specialty: ${hog.specialty}</h3>
                         <p>Weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water: <br>${hog['weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water']}</p>
                         <p>Highest medal achieved: ${hog['highest medal achieved']}</p>
                         <input type='checkbox' ${hog.greased? 'checked' : ''}>Greased? </input>
                         <button class='delete' >Slaughter Hog!</button>`

    hogDivEl.prepend(divCard)
};

const renderHogs = () => {
    hogDivEl.innerHTML = '';
    // debugger
    // console.log(state.hogs)
    state.hogs.forEach(showHogCard);
};

//FORM EL////////////////////////////////////////////////////////////////////////////////////////////

const grabFormData = () => {
    return {
        name: hogformEl.name.value,
        specialty: hogformEl.specialty.value,
        'highest medal achieved': hogformEl.medal.value,
        'weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water': hogformEl.weight.value,
        img: hogformEl.img.value,
        greased: (hogformEl.greased.checked ? true : false)
    };
 }

//EVENT LISTENERS////////////////////////////////////////////////////////////////////////////////////
const setSelectedState = () => {
    //it should only be called inside checkbox listener
    const hog = event.target.parentElement.firstChild.innerText;
    const clickedhog = state.hogs.find(elem => elem.name === hog);
    state.selectedHog = clickedhog;
};

const DivListener = () => {
    hogDivEl.addEventListener('click', event => {
        if (event.target.type === 'ckeckbox') {
            setSelectedState()
            
            state.selectedHog.greased = !state.selectedHog.greased
            // console.log(state.selectedHog.greased)
            patchHog()
                .then(renderHogs())            
        } else if (event.target.className === 'delete') {
            setSelectedState()
            deleteHog()
            .then(() => getHogs())
            .then(jso => {
                state.hogs = jso;
                renderHogs();
            })
        };
    });
};

const formListener = () => {
    hogformEl.addEventListener('submit', event => {
        event.preventDefault();
        const hog = grabFormData()
        createHog(hog)
            .then(() => getHogs())
            .then(jso => {
                state.hogs = jso;
                renderHogs();
            });
    }
    );
};
 const applyDelete = () => {

 };


//SERVER FETCH///////////////////////////////////////////////////////////////////////////////////////

const getHogs = () => {
    return fetch(hogsUrl)
        .then(resp => resp.json());
}

const patchHog = (hog=state.selectedHog) => {
    return fetch(`${hogsUrl}/${hog.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(hog)
    }).then(resp => resp.json());
};

const createHog = (hog) => {
    return fetch(hogsUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(hog)
    }).then(resp => {resp.json()});
};

const deleteHog = (hog=state.selectedHog) => {
    return fetch(`${hogsUrl}/${hog.id}`, {
        method: 'DELETE'
    })
};

//INITIALISE/////////////////////////////////////////////////////////////////////////////////////////

const init = () => {
    getHogs()
        .then(jso => {
            state.hogs = jso;
            console.log("statz.hogs inside the init", state.hogs)
            renderHogs();
        });
    DivListener();
    formListener();
};

init ();