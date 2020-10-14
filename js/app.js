// ----------- Variables ---------- //
const cardsDiv = document.getElementById('employees');
const card = document.querySelectorAll('.card');
const focus = document.getElementById('overlay');
const url = 'https://randomuser.me/api/?nat=us&results=12';
let employeeData=[];

// ----------- Fetch ---------- //

//basic fetch function
function fetchJson(url) {
    return fetch(url)
        .then(checkStatus)
        .then(data => data.json())
}

fetchJson(url)
    .then(employeeFill)
    .catch(error => console.log('Looks like there was an error', error))

function checkStatus(response) {
    if(response.ok) { 
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function employeeFill(data) {
    employeeData = data; 
    const employees = document.getElementById('employees');
    const employeeCards = employeeData.results.map( (item, index) => 
    `
    <div class="card" index="${index}">
    <div class="cardimage">
    <img src="${item.picture.large}" alt="employee">
    </div>
    <div class="cardtext">
    <h3 id="name">${item.name.first} ${item.name.last}</h3>
    <p>${item.email}</p>
    <p>${item.location.city}</p>
    </div>
    </div>
    `).join('')
    employees.innerHTML = employeeCards;
}

// modal card build 
function modalBuild(modalIndex) {
        let modalPrefix = employeeData.results[modalIndex];
        let tel = modalPrefix.cell;
        let loc = modalPrefix.location;
        let strNmbr = loc.street.number;
        let strState = loc.state;
        let strName = loc.street.name;
        let pic = modalPrefix.picture.large;
        let strPc = loc.postcode;
        let dob = modalPrefix.dob;
        let name =`${modalPrefix.name.first} ${modalPrefix.name.last}`;
        let email = `${modalPrefix.email}`;
        let city = `${modalPrefix.location.city}`;
        let date = new Date(dob.date); 
        
        const newModalHtml = 
        `
        <div id="new-modal-html" nmbr="${modalIndex}">
            <p id="close">X</p>
            <div class="cardimage">
            <img src="${pic}" alt="employee">
            </div>
            <div class="cardtext">
            <h3 id="name">${name}</h3>
            <p>${email}</p>
            <p>${city}</p>
        </div>
        <div id="divider"><p id="leftarrow">&lt;</p><hr><p id="rightarrow">&gt;</p></div>
            <div id="new-modal-items">
                <p>${tel}</p>
                <p>${strNmbr} ${strName}, ${strState} ${strPc}</p>
                <p>Birthday: ${date.getMonth()}/${date.getDay()}/${date.getFullYear()}</p>
            </div>
        </div>
        `;
        
        focus.innerHTML = newModalHtml;  
}


// ------- Event Handler  --------- // 

cardsDiv.addEventListener('click', (e) => {
    if (e.target !== cardsDiv) {
        focus.style.display = 'block'; 
        let modalCard = e.target.closest('.card'); 
        let modalCardHtml = modalCard.innerHTML; 
        let modalIndex = modalCard.getAttribute('index'); 
        
        modalBuild(modalIndex, modalCardHtml);   

    }
});

focus.addEventListener('click', (e) => {
    const close = document.getElementById('close');
    if (e.target === close) {
        focus.style.display = 'none';
    }
});

// clicking left and right 
focus.addEventListener('click', (e) => {
    const modal = document.getElementById('new-modal-html');
    const modalIndex = modal.getAttribute('nmbr');
    const left = document.getElementById('leftarrow');
    const right = document.getElementById('rightarrow');
    employeeData.results[modalIndex+1];

    if ((e.target === left) && (parseInt(modalIndex, 10) !== 0)) {
        modal.innerHTML = '';
        modalBuild((parseInt(modalIndex, 10)-1));   
    }
    else if ((e.target === right) && (parseInt(modalIndex, 10) !== 11)) {
        modal.innerHTML = '';
        modalBuild((parseInt(modalIndex, 10)+1));
    }
    else {
    }
   });

// Event Listener
let field = document.querySelector('input');
field.addEventListener('keyup', searchNames, false); 

function searchNames(txt) {
    const names = document.getElementsByTagName('h3'); 
    text = txt.target.value; 
    text = text.toUpperCase();
    console.log(`text = ${text}`); 
        for ( let i=0; i<names.length; i++ ) { 
            let name = names[i].textContent;
            nameCap = name.toUpperCase();
            if (nameCap.includes(text)){ 
                names[i].parentNode.parentNode.style.display = 'block'; 
            } else { 
                names[i].parentNode.parentNode.style.display = 'none'; 
            }
       }
    }