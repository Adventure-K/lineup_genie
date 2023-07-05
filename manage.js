import { roster } from './teamData.js';
import { roles } from './teamData.js';
import { playerSkill } from './teamData.js';

const defaultRoster = roster;

//-----------Populate Team Management Form----START----//
const printManagementTable = function (mRoster) {
    let managementTable = "<table>";

    // Headers
    managementTable += "<tr><th>#</th><th>Player</th><th>Current Pos</th><th>Edit</th><th>Reorder</th></tr>";

    // Data
    for (let p = 0; p < mRoster.length; p++) { // For each player on roster:
        let lineupOrder = p + 1; // Number by batting order
        let last = mRoster[p].lname.toString().toUpperCase();
        managementTable += "<tr><td>" + lineupOrder + "</td>"; // new row, first cell is order #
        managementTable += "<td>" + last + ", " + mRoster[p].fname + "</td>"; // This cell is name LAST, First
        managementTable += "<td id='pposSelectCell" + p + "'></td>"; // This cell will hold position select
        managementTable += "<td id='editButton" + p + "'>📝</td>"; // This cell holds an edit player button
        managementTable += "<td id='reorderHandle" + p + "'>☰</td>" // This cell holds a handle to reorder with click and drag
        managementTable += "</tr>"; // end row
    }
    managementTable += "</table>"
    return managementTable;
}
//-----------Populate Team Management Form----END----//

//-----------Add Position Selectors-------START----//
const addPositionSelectors = function () {
    let counter = 0;
    for (let p = 0; p < roster.length; p++) {
        const pposSelect = document.createElement('select'); // Generate dropdowns for position column

        for (let key in roles) {
            if (roles.hasOwnProperty(key)) { // Populate dropdown with keys of "roles" object
                const pposOption = document.createElement('option');
                pposOption.value = key;
                pposOption.textContent = key;
                pposSelect.appendChild(pposOption);
            }
        }
        const inactive = document.createElement('option'); // Include inactive option
        inactive.value = inactive.textContent = 'Inactive';
        pposSelect.appendChild(inactive);

        const pposSelectId = 'pposSelect_' + counter; // make unique ID for each dropdown. Probably will need?
        pposSelect.id = pposSelectId;
        const targetElement = document.getElementById("pposSelectCell" + p);
        targetElement.appendChild(pposSelect); // Insert dropdown into correct cell
        for (let key in roles) {
            if (key === roster[p].pos) {
                pposSelect.value = roster[p].pos; // Set default value of position dropdown to player's main position in roster object		
            }
        }
        counter++;
    }
};
//-----------Add Position Selectors-------END------//

//-----------Print Team Management Form----START----//
const mgmtTableToHTML = function (divId, content) {
    document.getElementById(divId).innerHTML = content;
};
const loadTable = function () {
    let loadedData = JSON.parse(localStorage.getItem('roster'));
    if (loadedData === null) {
        mgmtTableToHTML("managePlayersDiv", "*** Add Player or Load Default Team Data. ***");
    } else {
        let managementTableDOM = printManagementTable(loadedData);
        mgmtTableToHTML("managePlayersDiv", managementTableDOM);
        addPositionSelectors();
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