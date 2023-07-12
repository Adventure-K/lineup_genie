import { roster } from './teamData.js';
import { roles } from './teamData.js';
import { playerSkill } from './teamData.js';
import { battingOrder } from './teamData.js';

const defaultRoster = roster;
const defaultSkills = playerSkill;
const defaultBattingOrder = battingOrder;
const rc = JSON.parse(localStorage.getItem('roster'));
const sc = JSON.parse(localStorage.getItem('playerSkill'));
const bo = JSON.parse(localStorage.getItem('battingOrder'));
window.rc = rc; // This line is required to access a value in the console from a JS file loaded as a module
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

// generateLineupBtn.addEventListener('click', function() {

// })

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
        const pos1Select = document.createElement('select'); // Generate dropdowns
        const pos2Select = document.createElement('select');
        const pos3Select = document.createElement('select');

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

        const pos1SelectId = 'pos1Select_' + counter; // make unique ID for each dropdown
        const pos2SelectId = 'pos2Select_' + counter;
        const pos3SelectId = 'pos3Select_' + counter;
        pos1Select.id = pos1SelectId;
        pos2Select.id = pos2SelectId;
        pos3Select.id = pos3SelectId;

        const targetElement1 = document.getElementById("pos1SelectCell" + p.alias); // Insert dropdowns into correct cells
        targetElement1.appendChild(pos1Select);
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
    const playerSkills = sc[player.lName];
    console.log('current player\'s skills: ', playerSkills)
    for (let [key, value] of Object.entries(playerSkills)) {
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
            playerSkills[currentSkill] = parseInt(sliders[i].value);
            console.log(playerSkills)
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
            playerSkills[currentSkill] = parseInt(curVals[i].value);
            console.log(playerSkills)
        })
    }
    editSaveBtn.addEventListener('click', function () {
        saveEdit(player, playerSkills);
    })
}

function saveEdit(player, playerSkills) {
    sc[player.lName] = playerSkills;
    console.log(sc);
    localStorage.setItem('playerSkill', JSON.stringify(sc));
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
        localStorage.setItem('roster', JSON.stringify(defaultRoster));
        localStorage.setItem('playerSkill', JSON.stringify(defaultSkills));
        localStorage.setItem('battingOrder', JSON.stringify(defaultBattingOrder));
        localStorage.setItem('roles', JSON.stringify(roles));
        loadTable();
    }
});
//-----------Invoke Default Data----END----//