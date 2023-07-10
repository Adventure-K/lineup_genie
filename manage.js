import { roster } from './teamData.js';
import { roles } from './teamData.js';
import { playerSkill } from './teamData.js';

const defaultRoster = roster;
const defaultSkills = playerSkill;
const rc = JSON.parse(localStorage.getItem('roster'));
const sc = JSON.parse(localStorage.getItem('playerSkill'));
window.rc = rc; // This line is required to access a value in the console from a JS file loaded as a module
window.sc = sc;



//-----------Populate Team Management Table----START----//
const populateManagementTable = function (mRoster) {
    let managementTable = "<table>";

    // Headers
    managementTable += "<tr><th>#</th><th>Player</th><th>Pos 1</th><th>Pos 2</th><th>Pos 3</th><th>Edit</th><th>Reorder</th></tr>";

    // Data
    for (let p = 0; p < mRoster.length; p++) { // For each player on roster:
        let lineupOrder = p + 1; // Number by batting order
        let last = mRoster[p].lName.toString().toUpperCase();
        managementTable += "<tr><td class='centerTD'>" + lineupOrder + "</td>"; // new row, first cell is order #
        managementTable += "<td>" + last + ", " + mRoster[p].fName + "</td>"; // This cell is name LAST, First
        managementTable += "<td class='centerTD' id='pos1SelectCell" + p + "'></td>"; // This cell holds main position select
        managementTable += "<td class='centerTD' id='pos2SelectCell" + p + "'></td>"; // This cell holds 2nd position select
        managementTable += "<td class='centerTD' id='pos3SelectCell" + p + "'></td>"; // This cell holds 3rd position select
        managementTable += "<td class='centerTD'><span id='editBtn" + p + "' class='editBtn'>📝</span></td>"; // This cell holds an edit player button
        managementTable += "<td class='centerTD' id='reorderHandle" + p + "'>☰</td>" // This cell holds a handle to reorder with click and drag
        managementTable += "</tr>"; // end row
    }
    managementTable += "</table>"
    return managementTable;
}

function addEditListeners() { // Add click listeners to make the edit buttons work
    for (let p = 0; p < rc.length; p++) {
        document.getElementById('editBtn' + p).addEventListener('click', function () {
            editPlayer(p); // This is wrapped in another, anonymous function because when you tried to pass it as an argument with its own parameters it broke the hell out of everything
        })
    }
};
//-----------Populate Team Management Table----END----//

//-----------Add Position Selectors-------START----//
const addPositionSelectors = function () {
    let counter = 0; // Used to generate unique element IDs
    for (let p = 0; p < roster.length; p++) { // Loop of Players (Table rows)
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

        const targetElement1 = document.getElementById("pos1SelectCell" + p); // Insert dropdowns into correct cells
        targetElement1.appendChild(pos1Select);
        const targetElement2 = document.getElementById("pos2SelectCell" + p);
        targetElement2.appendChild(pos2Select);
        const targetElement3 = document.getElementById("pos3SelectCell" + p);
        targetElement3.appendChild(pos3Select);

        for (let key in roles) { // Set correct default selections per roster object
            if (key === roster[p].pos) pos1Select.value = roster[p].pos;
            if (key === roster[p].pos2) pos2Select.value = roster[p].pos2;
            if (key === roster[p].pos3) pos3Select.value = roster[p].pos3;
        }
        counter++;
    }
};
//-----------Add Position Selectors-------END------//

const closeBtn = document.getElementsByClassName('close')[0];


//-----------Edit Player------START-----------------//
const editPlayer = function (player) {
    console.log('edit ', player)
    const editPlayerModal = document.getElementById('editModal');
    const skillsDiv = document.getElementById('editSkills');
    const editLName = document.getElementById('editLName');
    const editFName = document.getElementById('editFName');
    editLName.setAttribute('placeholder', roster[player].lName);
    editFName.setAttribute('placeholder', roster[player].fName);
    editPlayerModal.style.display = 'block';
    // Skill sliders
    const skillsData = JSON.parse(localStorage.getItem('playerSkill'));
    const thisPlayer = skillsData[roster[player].lName];
    console.log(thisPlayer)
    for (let [key, value] of Object.entries(thisPlayer)) {
        skillsDiv.innerHTML += '<span>' + key + ':</span>' // Slider label
        skillsDiv.innerHTML += '<input class="skillSlider" id="slider_' + key + '" type="range" min="1" max="100" value="' + value + '">'
        skillsDiv.innerHTML += '<input type="number" class="curVal" min="1" max="100" value=' + value + '><br>' // Current value display (editable)
    }

    // Auto-update values on user input
    const sliders = document.getElementsByClassName('skillSlider');
    const curVals = document.getElementsByClassName('curVal');
    for (let i = 0; i < sliders.length; i++) {
        sliders[i].addEventListener('input', function () {
            curVals[i].value = sliders[i].value;
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
        })
    }

    closeBtn.addEventListener('click', function () {
        if (confirm("Discard ell edits?")) {
            editPlayerModal.style.display = 'none';
            editLName.setAttribute('placeholder', '');
            editFName.setAttribute('placeholder', '');
            skillsDiv.innerHTML = '';
        }
    })
}
//-----------Edit Player------END-----------------//

//-----------Add Player------START-----------------//
//-----------Add Player------END-----------------//

//-----------Print Team Management Form----START----//
const mgmtTableToHTML = function (divId, content) {
    document.getElementById(divId).innerHTML = content;
};
const loadTable = function () {
    let loadedData = JSON.parse(localStorage.getItem('roster'));
    if (loadedData === null) {
        mgmtTableToHTML("managePlayersDiv", "*** No player data found.  Add Player or Load Default Team Data. ***");
    } else {
        let managementTableDOM = populateManagementTable(loadedData);
        mgmtTableToHTML("managePlayersDiv", managementTableDOM);
        addPositionSelectors();
        addEditListeners();
    }
};
document.addEventListener('DOMContentLoaded', loadTable());
//-----------Print Team Management Form----END----//

//-----------Invoke Default Data----START----//
const loadDefaultBtn = document.getElementById('defaultData');

loadDefaultBtn.addEventListener('click', function () {
    if (confirm("THIS WILL OVERRIDE ANY SAVED PLAYER DATA. PROCEED?")) {
        console.log('DEFAULT DATA')
        localStorage.setItem('roster', JSON.stringify(defaultRoster));
        localStorage.setItem('playerSkill', JSON.stringify(defaultSkills));
        localStorage.setItem('roles', JSON.stringify(roles));
        loadTable();
    }
});
//-----------Invoke Default Data----END----//