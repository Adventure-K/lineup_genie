import { roster } from './teamData.js';
import { roles } from './teamData.js';
import { playerSkill } from './teamData.js';

const defaultRoster = roster;
const rc = JSON.parse(localStorage.getItem('roster'));
const sc = JSON.parse(localStorage.getItem('playerSkill'));
window.rc = rc; // This line is required to access a value in the console from a module
window.sc = sc;

//-----------Populate Team Management Table----START----//
const populateManagementTable = function (mRoster) {
    let managementTable = "<table>";

    // Headers
    managementTable += "<tr><th>#</th><th>Player</th><th>Current Pos</th><th>Edit</th><th>Reorder</th></tr>";

    // Data
    for (let p = 0; p < mRoster.length; p++) { // For each player on roster:
        let lineupOrder = p + 1; // Number by batting order
        let last = mRoster[p].lName.toString().toUpperCase();
        managementTable += "<tr><td class='centerTD'>" + lineupOrder + "</td>"; // new row, first cell is order #
        managementTable += "<td>" + last + ", " + mRoster[p].fName + "</td>"; // This cell is name LAST, First
        managementTable += "<td class='centerTD' id='pos1SelectCell" + p + "'></td>"; // This cell holds main position select
        managementTable += "<td class='centerTD'><span id='editButton" + p + "' class='editButton'>📝</span></td>"; // This cell holds an edit player button
        managementTable += "<td class='centerTD' id='reorderHandle" + p + "'>☰</td>" // This cell holds a handle to reorder with click and drag
        managementTable += "</tr>"; // end row
    }
    managementTable += "</table>"
    return managementTable;
}

function addEditListeners() { // Add click listeners to make the edit buttons work
    for (let p = 0; p < rc.length; p++) {
        document.getElementById('editButton' + p).addEventListener('click', function () {
            editPlayer(p); // This is wrapped in another, anonymous function because when you tried to pass it as an argument with its own parameters it broke the hell out of everything
        })
    }
};
//-----------Populate Team Management Table----END----//

//-----------Add Position Selectors-------START----//
const addPositionSelectors = function () {
    let counter = 0;
    for (let p = 0; p < roster.length; p++) {
        const pos1Select = document.createElement('select'); // Generate dropdowns for position column

        for (let key in roles) {
            if (roles.hasOwnProperty(key)) { // Populate dropdown with keys of "roles" object
                const pos1Option = document.createElement('option');
                pos1Option.value = key;
                pos1Option.textContent = key;
                pos1Select.appendChild(pos1Option);
            }
        }
        const inactive = document.createElement('option'); // Include inactive option
        inactive.value = inactive.textContent = 'Inactive';
        pos1Select.appendChild(inactive);

        const pos1SelectId = 'pos1Select_' + counter; // make unique ID for each dropdown. Probably will need?
        pos1Select.id = pos1SelectId;
        const targetElement = document.getElementById("pos1SelectCell" + p);
        targetElement.appendChild(pos1Select); // Insert dropdown into correct cell
        for (let key in roles) {
            if (key === roster[p].pos) {
                pos1Select.value = roster[p].pos; // Set default value of position dropdown to player's main position in roster object		
            }
        }
        counter++;
    }
};
//-----------Add Position Selectors-------END------//

//-----------Edit Player------START-----------------//
const editPlayer = function (player) {
    const editPlayerModal = document.getElementById('modalContainer');
    editPlayerModal.innerHTML += '<div id="myModal" class="modal">'
    editPlayerModal.innerHTML += '<div class="modal-content">'
    editPlayerModal.innerHTML += '<span class="closeBtn">&times;</span>'
    editPlayerModal.innerHTML += '<h2>Edit Player</h2>'
    editPlayerModal.innerHTML += '<input type="text" id="fName" placeholder=' + roster[player].fName + '>'
    editPlayerModal.innerHTML += '<input type="text" id="lName" placeholder=' + roster[player].lName + '>'
    editPlayerModal.innerHTML += // Figure out how to do skill sliders;
        editPlayerModal.innerHTML += '</div>'
}

//-----------Edit Player------END-----------------//

//-----------Add Player------START-----------------//
const addPlayerBtn = document.getElementById('addPlayerBtn');
addPlayerBtn.addEventListener('click', function () {
    const addPlayerModal = document.getElementById('modalContainer')
    addPlayerModal.innerHTML += '<div id="myModal" class="modal">'
    addPlayerModal.innerHTML += '<div class="modal-content">'
    addPlayerModal.innerHTML += '<span class="closeBtn">&times;</span>'
    addPlayerModal.innerHTML += '<h2>Add Player</h2>'

    addPlayerModal.innerHTML += '</div>'

    const closeBtn = document.getElementByClassName('closeBtn');
    closeBtn.addEventListener('click', function () {
        addPlayerModal.innerHTML = '';
    })
})
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
        loadTable();
    }
});
//-----------Invoke Default Data----END----//