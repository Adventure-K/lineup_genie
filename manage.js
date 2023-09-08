import { roles } from './teamData.js';
import { roster as defaultRoster } from './teamData.js';
import { playerSkill as defaultSkills } from './teamData.js';
import { battingOrder as defaultBattingOrder } from './teamData.js';
import { defaultRosterInactive } from './teamData.js';

const rc = JSON.parse(localStorage.getItem('roster'));                  // GET roster array
const sc = JSON.parse(localStorage.getItem('playerSkill'));             // GET player skills object
const bo = JSON.parse(localStorage.getItem('battingOrder'));            // GET batting order array
const rci = JSON.parse(localStorage.getItem('rosterInactive'));         // GET inactive roster. Inactive data for team management only
window.rc = rc; // This line is required to access the value in the console from a JS file loaded as a module. Good for debug
window.sc = sc;
window.bo = bo;
window.rci = rci;

//----------Global Variables & Event Listeners---------------//
const closeEditBtn = document.getElementsByClassName('close')[0];
const closeAddBtn = document.getElementsByClassName('close')[1];
const editSaveBtn = document.getElementById('editSaveBtn');
const generateLineupBtn = document.getElementById('generateLineupBtn')
const editPlayerModal = document.getElementById('editModal');
const addPlayerModal = document.getElementById('addModal');
const skillsDiv = document.getElementById('editSkills');
const addSkills = document.getElementById('addSkills')
const editLName = document.getElementById('editLName');
const editFName = document.getElementById('editFName');
const addFName = document.getElementById('addFName');
const addLName = document.getElementById('addLName');
const deletePlayerBtn = document.getElementById('deletePlayerBtn');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const addSaveBtn = document.getElementById('addSaveBtn');
const addPosDiv = document.getElementById('addPosDiv');
const addErrorText = document.getElementById("addErrorText");
const editErrorText = document.getElementById("editErrorText");
const manageInactiveDiv = document.getElementById('manageInactiveDiv');
const inactiveTBody = document.getElementById('inactiveTBody');
const errorDialog = document.getElementById('errorDialog');

addPlayerBtn.addEventListener('click', function () {
    addPlayer();
})

closeEditBtn.addEventListener('click', function () {
    editPlayerModal.style.display = 'none';
    editLName.value = '';
    editFName.value = '';
    skillsDiv.innerHTML = '';
    editErrorText.textContent = "";
})

closeAddBtn.addEventListener('click', function () {
    addPlayerModal.style.display = 'none';
    addPosDiv.innerHTML = '';
    addSkills.innerHTML = '';
    addErrorText.textContent = "";
})

//-------Save lineup to storage----START------//
generateLineupBtn.addEventListener('click', function () {
    const order = bo;
    const pos1Choices = document.getElementsByClassName('pos1Select');
    const pos2Choices = document.getElementsByClassName('pos2Select');
    const pos3Choices = document.getElementsByClassName('pos3Select');
    const pos1Data = {};
    const pos2Data = {};
    const pos3Data = {};
    for (let i = 0; i < pos1Choices.length; i++) { // Create object of current pos 1 selections for all participants
        let alias = order[i];
        let pos = pos1Choices[i].value;
        pos1Data[alias] = pos;
    }

    for (let i = 0; i < pos2Choices.length; i++) { // Create object of current pos 2 selections for all participants
        let alias = order[i];
        let pos2 = pos2Choices[i].value;
        pos2Data[alias] = pos2;
    }
    for (let i = 0; i < pos3Choices.length; i++) { // Create object of current pos 3 selections for all participants
        let alias = order[i];
        let pos3 = pos3Choices[i].value;
        pos3Data[alias] = pos3;
    }
    for (let i = 0; i < rc.length; i++) { // Update main roster object with new position selections
        const player = rc[i];
        const alias = player.alias;
        if (pos1Data.hasOwnProperty(alias)) {
            player.pos = pos1Data[alias]
        }
        if (pos2Data.hasOwnProperty(alias)) {
            player.pos2 = pos2Data[alias]
        }
        if (pos3Data.hasOwnProperty(alias)) {
            player.pos3 = pos3Data[alias]
        }
    }
    localStorage.setItem('roster', JSON.stringify(rc));     // POST new pos selections to localStorage roster
    window.location.href = "SLM_v2.html"                    // Push user to generator page
})

//-------Save lineup to storage----END------//


//-----------Populate Team Management Table----START----//
const populateManagementTable = function (mRoster, battingOrder) {
    let managementTable = `<table id="teamManagementTable">`;
    console.log('mRoster: ', mRoster)
    console.log('battingOrder: ', battingOrder)

    // Headers
    managementTable += "<tr><th>Reorder</th><th>Batting Order</th><th>Main Position</th><th>2nd Position</th><th>3rd Position</th><th>Edit</th><th>Active</th></tr>";

    // Data
    let counter = 0;
    for (let name of battingOrder) {
        const player = mRoster.find(rosterObj => rosterObj.alias === name) // Find each player in roster according to batting order
        if (counter === 0) {
            managementTable += "<tr><td class='centerTD'><span class='up' style='display:none;'>⬆️</span> <span class='down'>⬇️</span></td>"; // New row, this cell holds reorder buttons. 
        } else if (counter === battingOrder.length - 1) {
            managementTable += "<tr><td class='centerTD'><span class='up'>⬆️</span> <span class='down' style='display:none;'>⬇️</span></td>"; // Conditional render for first and last rows
        } else {
            managementTable += "<tr><td class='centerTD'><span class='up'>⬆️</span> <span class='down'>⬇️</span></td>";
        }
        managementTable += "<td class='playerName'>" + (player.lName.toUpperCase()) + ", " + player.fName + "</td>"; // Player name
        managementTable += "<td class='centerTD' id='pos1SelectCell" + player.alias + "'></td>"; // Main position select
        managementTable += "<td class='centerTD' id='pos2SelectCell" + player.alias + "'></td>"; // 2nd position select
        managementTable += "<td class='centerTD' id='pos3SelectCell" + player.alias + "'></td>"; // 3rd position select
        managementTable += "<td class='centerTD'><span id='editBtn" + player.alias + "' class='editBtn'>📝</span></td>"; // Edit player button
        managementTable += "<td class='centerTD checkCell'><button class='inactiveBtn' id='activeBox" + player.alias + "'>Inactive</button>"
        managementTable += "</tr>"; // end row
        counter++;
    }
    managementTable += "</table>"
    return managementTable;
}

function positionErrorCheck() { // Make sure user selection of positions is compatible with generator
    generateLineupBtn.removeAttribute('disabled');
    errorDialog.innerHTML = '';
    const pl = [];
    for (let p = 0; p < bo.length; p++) {
        pl.push(document.getElementsByClassName('pos1Select')[p].value);    // Array of all selected positions
    }
    console.log('error check: ', pl)
    function countPos(arr, pos) {           // Function to count occurrence of values within array
        return arr.reduce((count, cv) => {
            if (cv === pos) {
                count++;
            }
            return count;
        }, 0)
    }
    if (pl.length < 9 ||            // Min lineup length: 9
        countPos(pl, 'P') != 1 ||   // 1 of each of these positions required
        countPos(pl, '1B') != 1 || 
        countPos(pl, '2B') != 1 || 
        countPos(pl, '3B') != 1 || 
        countPos(pl, 'SS') != 1 || 
        countPos(pl, 'LF') != 1 || 
        countPos(pl, 'LCF') != 1 || 
        countPos(pl, 'RF') != 1 || 
        countPos(pl, 'RCF') > 1 ||  // 0 or 1 of these required
        countPos(pl, 'C') > 1 || 
        (countPos(pl, 'RCF') != 1 && pl.length > 9) ||      // LCF required if more than 9 players
        (pl.length === 10 && countPos(pl, 'Util') > 1) ||   // At most 1 Util with 10 players
        (pl.length === 11 && countPos(pl, 'Util') > 2) ||   // At most 2 Util with 11 players
        (pl.length === 12 && countPos(pl, 'Util') > 3) ||   // At most 3 Util with 12 players
        (pl.length > 12 && countPos(pl, 'Util') > 4) ||     // At most 4 Util 
        (countPos(pl, 'Util') === 0 && countPos(pl, 'C') === 0) // Must have at least 1 C or at least 1 Util
    ) {     
        errorDialog.innerHTML = 'Lineup error. Check constraints';
        generateLineupBtn.setAttribute('disabled', true)
    }
}

function addPositionListenersForErrors() { // Attach input listeners to Pos 1 selects to refresh current positions object for error checker
    for (let p = 0; p < bo.length; p++) {
        document.getElementsByClassName('pos1Select')[p].addEventListener('input', function() {
            positionErrorCheck();
        })
    }
}

function addEditListeners() { // Edit button click listeners
    for (let p of rc) {
        // console.log(p)
        document.getElementById('editBtn' + p.alias).addEventListener('click', function () {
            editPlayer(p); // This is wrapped in another, anonymous function because when you tried to pass it as an argument with its own parameters it broke the hell out of everything
        })
    }
};

function addInactiveListeners() { // Active checkbox click listeners
    for (let p of rc) {
        document.getElementById('activeBox' + p.alias).addEventListener('click', function () {
            markInactive(p, sc);
        })
    }
}

function addReorderListeners() { // Reorder button click listeners
    for (let p = 0; p < bo.length; p++) {
        document.getElementsByClassName('up')[p].addEventListener('click', function () { // This is an array of all the up buttons. Their indices correspond to the indices of bo (the batting order)
            [bo[p], bo[p - 1]] = [bo[p - 1], bo[p]]                         // Swap index of this player and the one above
            localStorage.setItem('battingOrder', JSON.stringify(bo));       // Save batting order
            loadTable();                                                    // Reload table immediately
        })
        document.getElementsByClassName('down')[p].addEventListener('click', function () {
            [bo[p], bo[p + 1]] = [bo[p + 1], bo[p]]                         // Swap index of this player and the one below
            localStorage.setItem('battingOrder', JSON.stringify(bo));
            loadTable();
        })
    }
}
//-----------Populate Team Management Table----END----//

//-----------Create Position Selectors-------START----//
const addPositionSelectors = function () {
    let counter = 0; // Used to generate unique element IDs
    for (let p of rc) { // Loop of Players (Table rows)
        const pos1Select = document.createElement('select');    // Generate dropdowns
        pos1Select.id = 'pos1Select_' + counter;                // Give unique ID
        pos1Select.className = 'pos1Select'                     // Give all pos 1 selectors the same class
        const pos2Select = document.createElement('select');
        pos2Select.id = 'pos2Select_' + counter;
        pos2Select.className = 'pos2Select'
        const pos3Select = document.createElement('select');
        pos3Select.id = 'pos3Select_' + counter;
        pos3Select.className = 'pos3Select'

        const pos2Null = document.createElement('option');      // Create blank options for pos 2 and 3
        pos2Null.value = '';
        pos2Null.textContent = '- none -';
        pos2Select.appendChild(pos2Null);
        const pos3Null = document.createElement('option');
        pos3Null.value = '';
        pos3Null.textContent = '- none -';
        pos3Select.appendChild(pos3Null);

        for (let key in roles) { // Loop of Roles
            if (roles.hasOwnProperty(key)) {                    // Populate dropdowns with keys of "roles" object
                const pos1Option = document.createElement('option');
                pos1Option.value = key;
                pos1Option.textContent = key;
                pos1Select.appendChild(pos1Option);

                const pos2Option = document.createElement('option');
                pos2Option.value = key;
                pos2Option.textContent = key;
                pos2Select.appendChild(pos2Option);

                const pos3Option = document.createElement('option');
                pos3Option.value = key;
                pos3Option.textContent = key;
                pos3Select.appendChild(pos3Option);
            }
        }

        const targetElement1 = document.getElementById("pos1SelectCell" + p.alias); // Insert dropdowns into correct cells. Dropdown and cell ID# should correspond
        targetElement1.appendChild(pos1Select);                                     // Ergo line up correctly regardless of batting order
        const targetElement2 = document.getElementById("pos2SelectCell" + p.alias);
        targetElement2.appendChild(pos2Select);
        const targetElement3 = document.getElementById("pos3SelectCell" + p.alias);
        targetElement3.appendChild(pos3Select);

        for (let key in roles) {                                // Set correct default selections according to roster object
            if (key === p.pos) pos1Select.value = p.pos;
            if (key === p.pos2) pos2Select.value = p.pos2;
            if (key === p.pos3) pos3Select.value = p.pos3;
        }
        counter++;
    }
};
//-----------Create Position Selectors-------END------//


//-----------Edit Player------START-----------------//
const editPlayer = function (player) {
    console.log('editing ', player);
    const oldFName = player.fName;
    const oldLName = player.lName;
    editLName.value = player.lName;
    editFName.value = player.fName;
    editErrorText.textContent = "";
    editPlayerModal.style.display = 'block';
    // Skill sliders
    const thisPlayerSkills = sc[player.alias];
    console.log('current player\'s skills: ', thisPlayerSkills)
    for (let [key, value] of Object.entries(thisPlayerSkills)) {
        skillsDiv.innerHTML += '<span>' + key + '</span>' // Slider label
        skillsDiv.innerHTML += '<input class="skillSlider" id="' + key + '" type="range" min="1" max="100" value="' + value + '">'
        skillsDiv.innerHTML += '<input type="number" class="curVal" min="1" max="100" value=' + value + '><br>' // Current value display (editable)
    }

    // Auto-update values on user input
    const sliders = document.getElementsByClassName('skillSlider');
    const curVals = document.getElementsByClassName('curVal');
    for (let i = 0; i < sliders.length; i++) {
        sliders[i].addEventListener('input', function () {
            // console.log(sliders[i].id, sliders[i].value)
            curVals[i].value = sliders[i].value;
            const currentSkill = sliders[i].id;
            thisPlayerSkills[currentSkill] = parseInt(sliders[i].value);
            console.log(thisPlayerSkills)
        })
    }
    // & Limit numerical inputs to valid values
    for (let i = 0; i < curVals.length; i++) {
        curVals[i].addEventListener('input', function () {
            if (curVals[i].value > 100) {
                curVals[i].value = 100;
            } else if (curVals[i].value < 1) {
                curVals[i].value = 1;
            }
            sliders[i].value = curVals[i].value;
            const currentSkill = sliders[i].id;
            thisPlayerSkills[currentSkill] = parseInt(curVals[i].value);
            console.log(thisPlayerSkills)
        })
    }

    const handleSaveClick = function () {
            saveEdit(player, thisPlayerSkills, oldFName, oldLName);
    }
    const handleDeleteClick = function () {
        if (confirm("Delete player from memory. Proceed?")) {
            deletePlayer(player);
        }
    }

    editSaveBtn.addEventListener('click', handleSaveClick, { once: true })
    deletePlayerBtn.addEventListener('click', handleDeleteClick, { once: true });
}

function saveEdit(player, thisPlayerSkills, oldFName, oldLName) {
    let newName = false;
    if (editFName.value !== oldFName || editLName.value !== oldLName) newName = true;
    if (newName) { // Don't run validation unless name has been edited
        // INPUT VALIDATION
        if (!editFName.value || !editLName.value) {    // Require first & last name
            editErrorText.textContent = "Please enter a first and last name.";
            editErrorText.style.display = "inline";
            return;
        } else {
            editErrorText.textContent = "";
            editErrorText.style.display = "none";
        }
        editFName.value = editFName.value.trim();    // Remove any extraneous spaces
        editLName.value = editLName.value.trim();
        if (!/^[a-zA-Z-]+$/.test(editFName.value) || !/^[a-zA-Z-]+$/.test(editLName.value)) {   // Reject if non-letter chars found
            editErrorText.textContent = "Please enter alphabetic characters only.";
            editErrorText.style.display = "inline";
            return;
        } else {
            editErrorText.textContent = "";
            editErrorText.style.display = "none";
        }
        editFName.value.charAt(0).toUpperCase(); // Capitalize 1st letter
        editLName.value.charAt(0).toUpperCase();
        rc.forEach(entry => {
            if (entry.alias === editLName.value + editFName.value) {       // Prevent exact same name to keep IDs unique
                editErrorText.textContent = "Player " + editFName.value + " " + editLName.value + " already exists.";
                editErrorText.style.display = "inline";
                return;
            } else {
                editErrorText.textContent = "";
                editErrorText.style.display = "none";
            }
        })
    }
    // END VALIDATION  
    if (newName) {
        console.log('batting order object: ', bo)
        console.log('player.alias: ', player.alias)
        const boElement = bo.find(name => name === player.alias);               // Edit batting order object with new name
        console.log('boElement: ', boElement)
        const boIndex = bo.indexOf(boElement);
        console.log('boIndex: ', boIndex)
        bo[boIndex] = editLName.value + editFName.value;

        const scProperty = player.alias;                                        // Delete skills property under player's old name
        delete sc[scProperty];
        const newAlias = editLName.value + editFName.value;
        sc[newAlias] = thisPlayerSkills;                                        // Edit playerSkills object with new values for this player under new name   
        console.log(sc);
        const rcIndexOfPlayer = rc.indexOf(player);                             // Edit roster object with new name
        rc[rcIndexOfPlayer].fName = editFName.value;
        rc[rcIndexOfPlayer].lName = editLName.value;
        rc[rcIndexOfPlayer].alias = editLName.value + editFName.value;
        console.log(rc);

    } else {
        sc[player.alias] = thisPlayerSkills;                                    // Edit playerSkills object with new values for this player
        console.log(sc);
    }
    localStorage.setItem('battingOrder', JSON.stringify(bo));               // POST battingOrder object to localStorage with new values added
    localStorage.setItem('roster', JSON.stringify(rc));                     // POST roster object to localStorage with new values added
    localStorage.setItem('playerSkill', JSON.stringify(sc));                // POST skills object to localStorage with new values added
    editPlayerModal.style.display = 'none';
    editLName.value = '';
    editFName.value = '';
    skillsDiv.innerHTML = '';
    editErrorText.textContent = "";
    loadTable();

}

function deletePlayer(player) {
    const playerIndex = rc.indexOf(player);                             // Remove from rc, array of objects. props is already the object in question
    rc.splice(playerIndex, 1);

    const boElement = bo.find(name => name === player.alias);           // Remove from bo, array of strings, using identifier (alias)
    const boIndex = bo.indexOf(boElement);
    bo.splice(boIndex, 1);

    const scProperty = player.alias;                                    // Remove from sc, object of objects, also using alias (key of property in this case)
    delete sc[scProperty];                                              // LESSON: When the property's name is a variable in the function, must use square brackets, not dot

    localStorage.setItem('roster', JSON.stringify(rc));                 // Save changes to main data objects
    localStorage.setItem('battingOrder', JSON.stringify(bo));
    localStorage.setItem('playerSkill', JSON.stringify(sc));

    editPlayerModal.style.display = 'none';                             // Close and blank edit player modal
    editLName.value = '';
    editFName.value = '';
    skillsDiv.innerHTML = '';

    loadTable();                                                        // Reload table
}
//-----------Edit Player------END-----------------//

//-----------Manage Inactive-------START----------//
function populateInactiveTable(rci) {
    inactiveTBody.innerHTML = "";
    for (let player of rci) {
        inactiveTBody.innerHTML += "<tr><td>" + (player.lName.toUpperCase()) + ", " + player.fName + "</td><td class='centerTD'><button id='activeButton" + player.alias + "'>Active</button></td></tr>"
    }

    for (let p of rci) {
        document.getElementById('activeButton' + p.alias).addEventListener('click', function () {
            markActive(p);
        }, { once: true })
    }
}

function markInactive(player, sc) {
    console.log('Inactive: ', player.alias)

    rci.push(player);                                       // add to inactive roster
    // const scProperty = player.alias; 
    // sci[player['alias']] = sc[scProperty];

    const playerIndex = rc.indexOf(player);                 // remove from active roster         
    rc.splice(playerIndex, 1);

    const boElement = bo.find(name => name === player.alias);
    const boIndex = bo.indexOf(boElement);
    bo.splice(boIndex, 1);                                  // remove from batting order

    localStorage.setItem('rosterInactive', JSON.stringify(rci));
    localStorage.setItem('roster', JSON.stringify(rc));
    localStorage.setItem('battingOrder', JSON.stringify(bo));

    loadTable();
}

function markActive(player) {
    console.log('Activate: ', player);

    rc.push(player);                            // add to active roster
    const playerIndex = rci.indexOf(player);    // remove from inactive roster
    rci.splice(playerIndex, 1);
    bo.push(player['alias']);                   // add to end of batting order

    localStorage.setItem('rosterInactive', JSON.stringify(rci));
    localStorage.setItem('roster', JSON.stringify(rc));
    localStorage.setItem('battingOrder', JSON.stringify(bo));

    loadTable();
}

function showInactive() {    // Show inactive table if inactive roster not empty, otherwise hide. Called by loadTable
    rci.length > 0 ? manageInactiveDiv.style.display = 'block' : manageInactiveDiv.style.display = 'none'
}
//-----------Manage Inactive-------END------------//

//-----------Add Player------START-----------------//
function addPlayer() {
    addErrorText.textContent = "";
    addFName.value = '';
    addLName.value = '';
    const addPos1 = document.createElement('select');    // Generate position selection dropdowns
    addPos1.id = 'addPos1';
    addPos1.className = 'addPos';
    const addPos2 = document.createElement('select');
    addPos2.id = 'addPos2';
    addPos2.className = 'addPos';
    const addPos3 = document.createElement('select');
    addPos3.id = 'addPos3';
    addPos3.className = 'addPos';

    for (let key in roles) {
        if (roles.hasOwnProperty(key)) {                    // Populate dropdowns with keys of "roles" object
            const pos1Option = document.createElement('option');
            pos1Option.value = key;
            pos1Option.textContent = key;
            addPos1.appendChild(pos1Option);

            const pos2Option = document.createElement('option');
            pos2Option.value = key;
            pos2Option.textContent = key;
            addPos2.appendChild(pos2Option);

            const pos3Option = document.createElement('option');
            pos3Option.value = key;
            pos3Option.textContent = key;
            addPos3.appendChild(pos3Option);
        }
    }

    const pos2Null = document.createElement('option');      // Create blank options for pos 2 and 3
    pos2Null.value = '';
    pos2Null.textContent = '- none -';
    addPos2.appendChild(pos2Null);
    const pos3Null = document.createElement('option');
    pos3Null.value = '';
    pos3Null.textContent = '- none -';
    addPos3.appendChild(pos3Null);

    addPosDiv.appendChild(addPos1);                         // Draw dropdowns
    addPosDiv.appendChild(addPos2);
    addPosDiv.appendChild(addPos3);
    addPos1.value = '';                                     // Some default values
    addPos2.value = '';
    addPos3.value = '';

    // Put pos choices in one obj to props to save fn
    const newPlayerPos = {
        'pos': '',
        'pos2': '',
        'pos3': ''
    }

    // Input listeners to update pos object. 
    addPos1.addEventListener('input', function () {
        newPlayerPos['pos'] = addPos1.value;
    })
    addPos2.addEventListener('input', function () {
        newPlayerPos['pos2'] = addPos2.value;
    })
    addPos3.addEventListener('input', function () {
        newPlayerPos['pos3'] = addPos3.value;
    })

    const newSkillObj = { 'P': 50, 'C': 50, '1B': 50, '2B': 50, '3B': 50, 'SS': 50, 'LF': 50, 'LCF': 50, 'RCF': 50, 'RF': 50 }

    for (let [key, value] of Object.entries(newSkillObj)) { // Add skill sliders
        addSkills.innerHTML += '<span>' + key + '</span>' // Slider label
        addSkills.innerHTML += '<input class="skillSlider" id="' + key + '" type="range" min="1" max="100" value="' + value + '">' // Slider
        addSkills.innerHTML += '<input type="number" class="curVal" min="1" max="100" value=' + value + '><br>' // Current value display (editable)
    }

    // Auto-update values on user input
    const sliders = document.getElementsByClassName('skillSlider');
    const curVals = document.getElementsByClassName('curVal');
    for (let i = 0; i < sliders.length; i++) {
        sliders[i].addEventListener('input', function () {
            // console.log(sliders[i].id, sliders[i].value)
            curVals[i].value = sliders[i].value;
            const currentSkill = sliders[i].id;
            newSkillObj[currentSkill] = parseInt(sliders[i].value);
        })
    }
    // & Limit numerical inputs to valid values
    for (let i = 0; i < curVals.length; i++) {
        curVals[i].addEventListener('input', function () {
            // console.log(sliders[i].id, curVals[i].value)
            if (curVals[i].value > 100) {
                curVals[i].value = 100;
            } else if (curVals[i].value < 1) {
                curVals[i].value = 1;
            }
            sliders[i].value = curVals[i].value;
            const currentSkill = sliders[i].id;
            newSkillObj[currentSkill] = parseInt(curVals[i].value);
        })
    }

    addSaveBtn.addEventListener('click', function () {
        saveNewPlayer(newPlayerPos, newSkillObj);
    }, { once: true })

    addPlayerModal.style.display = 'block'
}

function saveNewPlayer(posObj, skillObj) {
    // INPUT VALIDATION
    if (!addFName.value || !addLName.value) {    // Require first & last name
        addErrorText.textContent = "Please enter a first and last name.";
        addErrorText.style.display = "inline";
        return;
    } else {
        addErrorText.textContent = "";
        addErrorText.style.display = "none";
    }
    addFName.value = addFName.value.trim();    // Remove any extraneous spaces
    addLName.value = addLName.value.trim();
    if (!/^[a-zA-Z-]+$/.test(addFName.value) || !/^[a-zA-Z-]+$/.test(addLName.value)) {   // Reject if non-letter chars found. Hyphens excepted
        addErrorText.textContent = "Please enter alphabetic characters only.";
        addErrorText.style.display = "inline";
        return;
    } else {
        addErrorText.textContent = "";
        addErrorText.style.display = "none";
    }
    addFName.value.charAt(0).toUpperCase();
    addLName.value.charAt(0).toUpperCase();
    rc.forEach(player => {
        if (player.alias === addLName.value + addFName.value) {       // Prevent exact same name to keep IDs unique
            addErrorText.textContent = "Player " + addFName.value + " " + addLName.value + " already exists.";
            addErrorText.style.display = "inline";
            return;
        } else {
            addErrorText.textContent = "";
            addErrorText.style.display = "none";
        }
    })

    if (posObj['pos'] === '') {  // Require primary position
        addErrorText.textContent = "Please select a primary position.";
        addErrorText.style.display = "inline";
        return;
    } else {
        addErrorText.textContent = "";
        addErrorText.style.display = "none";
    }
    // END VALIDATION
    // Create final playerObj and add other required properties
    const playerObj = {};
    playerObj['alias'] = addLName.value + addFName.value;       // Unique ID for roster object
    playerObj['pos'] = posObj['pos'];
    playerObj['fName'] = addFName.value;
    playerObj['lName'] = addLName.value;
    playerObj['pos2'] = posObj['pos2'];
    playerObj['pos3'] = posObj['pos3'];
    playerObj['sortOrderClass'] = '1';                          // Secret Lanser esoterica

    console.log('playerObj: ', playerObj)
    console.log('skillObj: ', skillObj)

    rc.push(playerObj);                                         // Append new data to main data objects
    sc[playerObj['alias']] = skillObj;
    bo.push(playerObj['alias']);

    localStorage.setItem('roster', JSON.stringify(rc));         // Upload updated data objects to localStorage
    localStorage.setItem('playerSkill', JSON.stringify(sc));
    localStorage.setItem('battingOrder', JSON.stringify(bo));
    addPlayerModal.style.display = 'none';                      // Close and blank add player dialog
    addPosDiv.innerHTML = '';
    addSkills.innerHTML = '';
    addFName.innerHTML = '';
    addLName.innerHTML = '';
    addErrorText.textContent = "";
    loadTable();                                                // Reload table
}
//-----------Add Player------END-----------------//

//-----------Print Team Management Form----START----//
const mgmtTableToHTML = function (divId, content) {
    document.getElementById(divId).innerHTML = content;
};
const loadTable = function () {
    if (rc === null) {
        mgmtTableToHTML("managePlayersDiv", "*** No player data found.  Add Player or Load Default Team Data. ***");
    } else {
        let managementTableDOM = populateManagementTable(rc, bo);
        mgmtTableToHTML("managePlayersDiv", managementTableDOM);
        addPositionSelectors();
        addEditListeners();
        addReorderListeners();
        addInactiveListeners();
        populateInactiveTable(rci);
        showInactive();
        addPositionListenersForErrors();
        positionErrorCheck();
    }
};
document.addEventListener('DOMContentLoaded', loadTable());
//-----------Print Team Management Form----END----//

//-----------Invoke Default Data---------START----//
const loadDefaultBtn = document.getElementById('defaultData');

loadDefaultBtn.addEventListener('click', function () {
    if (confirm("THIS WILL OVERRIDE ANY SAVED PLAYER DATA. PROCEED?")) {
        console.log('DEFAULT DATA')
        localStorage.clear();
        localStorage.setItem('roster', JSON.stringify(defaultRoster));                  // POST
        localStorage.setItem('playerSkill', JSON.stringify(defaultSkills));             // POST
        localStorage.setItem('battingOrder', JSON.stringify(defaultBattingOrder));      // POST
        localStorage.setItem('rosterInactive', JSON.stringify(defaultRosterInactive));  // POST
        loadTable();
        location.reload();
    }
});
//-----------Invoke Default Data----END----//