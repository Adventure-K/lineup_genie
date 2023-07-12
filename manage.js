import { roster } from './teamData.js';
import { roles } from './teamData.js';
import { playerSkill } from './teamData.js';
import { battingOrder } from './teamData.js';

const defaultRoster = roster;
const defaultSkills = playerSkill;
const defaultBattingOrder = battingOrder;
const rc = JSON.parse(localStorage.getItem('roster'));          // GET
const sc = JSON.parse(localStorage.getItem('playerSkill'));     // GET
const bo = JSON.parse(localStorage.getItem('battingOrder'));    // GET
window.rc = rc; // This line is required to access the rc value in the console from a JS file loaded as a module
window.sc = sc;

//----------Global Variables & Event Listeners---------------//
const closeBtn = document.getElementsByClassName('close')[0];
const editSaveBtn = document.getElementById('editSaveBtn');
const generateLineupBtn = document.getElementById('generateLineupBtn')
const editPlayerModal = document.getElementById('editModal');
const skillsDiv = document.getElementById('editSkills');
const editLName = document.getElementById('editLName');
const editFName = document.getElementById('editFName');

closeBtn.addEventListener('click', function () {
    editPlayerModal.style.display = 'none';
    editLName.value = '';
    editFName.value = '';
    skillsDiv.innerHTML = '';
})

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
    // console.log('pos 1 ', pos1Data);
    // console.log('pos 2 ', pos2Data);
    // console.log('pos 3 ', pos3Data);
    console.log(rc)
    localStorage.setItem('roster', JSON.stringify(rc));     // POST new pos selections to roster
    window.location.href = "SLM_v2.html"
})

//-----------Populate Team Management Table----START----//
const populateManagementTable = function (mRoster, battingOrder) {
    let managementTable = "<table>";
    console.log('mRoster: ', mRoster)
    console.log('battingOrder: ', battingOrder)

    // Headers
    managementTable += "<tr><th>#</th><th>Player</th><th>Pos 1</th><th>Pos 2</th><th>Pos 3</th><th>Edit</th><th>Reorder</th></tr>";

    // Data
    let counter = 1; // For batting order display
    for (let key of battingOrder) {
        const player = mRoster.find(rosterObj => rosterObj.alias === key) // Find each player in roster according to batting order
        managementTable += "<tr><td class='centerTD'>" + counter + "</td>"; // new row, first cell is batting order
        managementTable += "<td>" + (player.lName.toUpperCase()) + ", " + player.fName + "</td>"; // Player name
        managementTable += "<td class='centerTD' id='pos1SelectCell" + player.lName + "'></td>"; // Main position select
        managementTable += "<td class='centerTD' id='pos2SelectCell" + player.lName + "'></td>"; // 2nd position select
        managementTable += "<td class='centerTD' id='pos3SelectCell" + player.lName + "'></td>"; // 3rd position select
        managementTable += "<td class='centerTD'><span id='editBtn" + player.lName + "' class='editBtn'>📝</span></td>"; // Edit player button
        managementTable += "<td class='centerTD' id='reorderHandle" + player.lName + "'>☰</td>" // Handle to reorder with click and drag WIP
        managementTable += "</tr>"; // end row
        counter++;
    }
    managementTable += "</table>"
    return managementTable;
}

function addEditListeners() { // Add click listeners to make the edit buttons work
    for (let p of rc) {
        // console.log(p)
        document.getElementById('editBtn' + p.lName).addEventListener('click', function () {
            editPlayer(p); // This is wrapped in another, anonymous function because when you tried to pass it as an argument with its own parameters it broke the hell out of everything
        })
    }
};
//-----------Populate Team Management Table----END----//

//-----------Add Position Selectors-------START----//
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

        const pos2Null = document.createElement('option'); // Create blank options for pos 2 and 3
        pos2Null.value = '';
        pos2Null.textContent = '- none -';
        pos2Select.appendChild(pos2Null);
        const pos3Null = document.createElement('option');
        pos3Null.value = '';
        pos3Null.textContent = '- none -';
        pos3Select.appendChild(pos3Null);

        for (let key in roles) { // Loop of Roles
            if (roles.hasOwnProperty(key)) { // Populate dropdowns with keys of "roles" object
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

        const inactive = document.createElement('option'); // Include inactive option in pos 1 selector
        inactive.value = 'Inactive';
        inactive.textContent = 'Inactive';
        pos1Select.appendChild(inactive);

        const targetElement1 = document.getElementById("pos1SelectCell" + p.alias); // Insert dropdowns into correct cells. Dropdown and cell ID# should correspond
        targetElement1.appendChild(pos1Select);                                     // Ergo line up correctly regardless of batting order
        const targetElement2 = document.getElementById("pos2SelectCell" + p.alias);
        targetElement2.appendChild(pos2Select);
        const targetElement3 = document.getElementById("pos3SelectCell" + p.alias);
        targetElement3.appendChild(pos3Select);

        for (let key in roles) { // Set correct default selections per roster object
            if (key === p.pos) pos1Select.value = p.pos;
            if (key === p.pos2) pos2Select.value = p.pos2;
            if (key === p.pos3) pos3Select.value = p.pos3;
        }
        counter++;
    }
};
//-----------Add Position Selectors-------END------//


//-----------Edit Player------START-----------------//
const editPlayer = function (player) {
    console.log('editing ', player);
    editLName.value = player.lName;
    editFName.value = player.fName;
    editPlayerModal.style.display = 'block';
    // Skill sliders
    const thisPlayerSkills = sc[player.lName];
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
            // console.log(sliders[i].id, curVals[i].value)
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
    editSaveBtn.addEventListener('click', function () {
        saveEdit(player, thisPlayerSkills);
    })
}

function saveEdit(player, thisPlayerSkills) {
    sc[player.lName] = thisPlayerSkills;
    console.log(sc);
    localStorage.setItem('playerSkill', JSON.stringify(sc)); // POST
    editPlayerModal.style.display = 'none';
    editLName.value = '';
    editFName.value = '';
    skillsDiv.innerHTML = '';
}




//-----------Edit Player------END-----------------//

//-----------Add Player------START-----------------//
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
    }
};
document.addEventListener('DOMContentLoaded', loadTable());
//-----------Print Team Management Form----END----//

//-----------Invoke Default Data---------START----//
const loadDefaultBtn = document.getElementById('defaultData');

loadDefaultBtn.addEventListener('click', function () {
    if (confirm("THIS WILL OVERRIDE ANY SAVED PLAYER DATA. PROCEED?")) {
        console.log('DEFAULT DATA')
        localStorage.setItem('roster', JSON.stringify(defaultRoster));              // POST
        localStorage.setItem('playerSkill', JSON.stringify(defaultSkills));         // POST
        localStorage.setItem('battingOrder', JSON.stringify(defaultBattingOrder));  // POST
        localStorage.setItem('roles', JSON.stringify(roles));                       // POST
        loadTable();
    }
});
//-----------Invoke Default Data----END----//