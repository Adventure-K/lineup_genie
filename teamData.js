/* ----------------  Make a Roster ----START----------------------*/

//Overall Team Roster. The list of (pre-defined) people Steve can choose from. If we want to add people (permanently or on the fly, need to update this roster variable.) 

export let roster = [];

const addToRoster = function (alias, pos, fName, lName, pos2, pos3, sortOrderClass) {
    //alias: name displayed on print outs
    //pos: main position suggested as default. Valid values are the keys of roles object, below
    //fName: first name
    //lName: last name
    //pos2/3: other suggested positions
    //sortOrderClass: 1,2,...,N -- 1 will be at the top of the select list. Can use this so current roster is at top of pick-list and rare people are at the bottom.
    let rosterMember = { "alias": alias, "pos": pos, "fName": fName, "lName": lName, "pos2": pos2, "pos3": pos3, "sortOrderClass": sortOrderClass };
    roster.push(rosterMember);
};

//working from existing list...
//a hacky way to update the roster is just to add to this JSON object.
const roster_20230501 = [
    { alias: 'Chalmers', pos: 'Util', fName: 'Nick', lName: 'Chalmers', pos2: '1B', pos3: 'SS', sortOrderClass: '1' },
    { alias: 'Burman', pos: '1B', fName: 'Adam', lName: 'Burman', pos2: 'RF', pos3: 'RCF', sortOrderClass: '1' },
    { alias: 'Waddick', pos: '1B', fName: 'Brian', lName: 'Waddick', pos2: 'Util', pos3: 'RF', sortOrderClass: '1' },
    { alias: 'Oppegaard', pos: '3B', fName: 'Dave', lName: 'Oppegaard', pos2: '', pos3: '', sortOrderClass: '1' },
    { alias: 'Schaefer', pos: 'LCF', fName: 'Cole', lName: 'Schaefer', pos2: 'LF', pos3: 'RCF', sortOrderClass: '1' },
    { alias: 'May', pos: 'LF', fName: 'Chris', lName: 'May', pos2: 'LCF', pos3: 'RCF', sortOrderClass: '1' },
    { alias: 'Welter', pos: 'RF', fName: 'Andrew', lName: 'Welter', pos2: '', pos3: '', sortOrderClass: '1' },
    { alias: 'Bieganek', pos: 'SS', fName: 'Aric', lName: 'Bieganek', pos2: '', pos3: '', sortOrderClass: '1' },
    { alias: 'DeCausmeaker', pos: 'Util', fName: 'John', lName: 'DeCausmeaker', pos2: 'P', pos3: 'SS', sortOrderClass: '1' },
    { alias: 'Norman', pos: 'LF', fName: 'Steve', lName: 'Norman', pos2: 'LCF', pos3: 'RCF', sortOrderClass: '1' },
    { alias: 'Lanser', pos: 'RCF', fName: 'Eric', lName: 'Lanser', pos2: 'LCF', pos3: 'RF', sortOrderClass: '1' },
    { alias: 'Travis', pos: '2B', fName: 'Lloyd', lName: 'Travis', pos2: '', pos3: '', sortOrderClass: '1' },
    { alias: 'Mensink', pos: 'P', fName: 'Mike', lName: 'Mensink', pos2: '', pos3: '', sortOrderClass: '1' }
];

//add each person to the roster.
for (let i = 0; i < roster_20230501.length; i++) {
    addToRoster(roster_20230501[i].alias, roster_20230501[i].pos, roster_20230501[i].fName, roster_20230501[i].lName, roster_20230501[i].pos2, roster_20230501[i].pos3, roster_20230501[i].sortOrderClass);
}

export const roles = {
    "P": { name: "Pitcher", num: 1, area: "infield" }
    , "C": { name: "Catcher", num: 2, area: "infield" }
    , "1B": { name: "1st Base", num: 3, area: "infield" }
    , "2B": { name: "2nd Base", num: 4, area: "infield" }
    , "3B": { name: "3rd Base", num: 5, area: "infield" }
    , "SS": { name: "Short Stop", num: 6, area: "infield" }
    , "LF": { name: "Left Field", num: 7, area: "outfield" }
    , "LCF": { name: "Left-Center Field", num: 8, area: "outfield" }
    , "RCF": { name: "Right-Center Field", num: 9, area: "outfield" }
    , "RF": { name: "Right Field", num: 10, area: "outfield" }
    , "Util": { name: "Utility", num: 11, area: "any" }
    //,"IFU": {name:"Infield Utility",num:12,area:"infield"}	//obviated by optimizations utilizing playerSkill
    //,"OFU": {name:"Outfield Utility",num:13,area:"outfield"}	//obviated by optimizations utilizing playerSkill
    , "DH": { name: "NOT IMPLEMENTED Designated Hitter", num: 14, area: "bench" }		//not tested yet. But should be ready. Perhaps try after v1 acceptance.
}; //Front-end Dev note: maybe you want this as a pick-list for steve to choose from for assigning roles

//PlayerSkill. 0=incapable. 100 highest by convention. 
//Another note on the scale: This will be randomized on the order of 0 to +20 points, (2 binary rolls of 0|5), so centered on +5). So ~ 5% of highest assignable skill by convention.
export let playerSkill = {
    'Chalmers': { 'P': 70, 'C': 70, '1B': 80, '2B': 80, '3B': 80, 'SS': 80, 'LF': 85, 'LCF': 85, 'RCF': 85, 'RF': 85 }
    , 'Burman': { 'P': 1, 'C': 70, '1B': 80, '2B': 50, '3B': 50, 'SS': 50, 'LF': 50, 'LCF': 50, 'RCF': 50, 'RF': 50 }
    , 'Waddick': { 'P': 1, 'C': 70, '1B': 70, '2B': 70, '3B': 40, 'SS': 40, 'LF': 70, 'LCF': 70, 'RCF': 70, 'RF': 70 }
    , 'Oppegaard': { 'P': 20, 'C': 70, '1B': 40, '2B': 60, '3B': 80, 'SS': 60, 'LF': 20, 'LCF': 20, 'RCF': 20, 'RF': 20 }
    , 'Schaefer': { 'P': 1, 'C': 70, '1B': 50, '2B': 85, '3B': 60, 'SS': 60, 'LF': 95, 'LCF': 95, 'RCF': 95, 'RF': 95 }
    , 'May': { 'P': 1, 'C': 70, '1B': 50, '2B': 60, '3B': 60, 'SS': 60, 'LF': 100, 'LCF': 100, 'RCF': 100, 'RF': 100 }
    , 'Welter': { 'P': 1, 'C': 70, '1B': 50, '2B': 60, '3B': 20, 'SS': 10, 'LF': 60, 'LCF': 60, 'RCF': 70, 'RF': 75 }
    , 'Bieganek': { 'P': 60, 'C': 70, '1B': 70, '2B': 90, '3B': 90, 'SS': 90, 'LF': 70, 'LCF': 70, 'RCF': 70, 'RF': 70 }
    , 'DeCausmeaker': { 'P': 80, 'C': 70, '1B': 75, '2B': 75, '3B': 75, 'SS': 75, 'LF': 75, 'LCF': 75, 'RCF': 75, 'RF': 75 }
    , 'Norman': { 'P': 70, 'C': 70, '1B': 30, '2B': 70, '3B': 70, 'SS': 70, 'LF': 99, 'LCF': 99, 'RCF': 99, 'RF': 99 }
    , 'Lanser': { 'P': 50, 'C': 70, '1B': 50, '2B': 60, '3B': 40, 'SS': 60, 'LF': 85, 'LCF': 85, 'RCF': 85, 'RF': 85 }
    , 'Travis': { 'P': 1, 'C': 70, '1B': 10, '2B': 70, '3B': 20, 'SS': 50, 'LF': 40, 'LCF': 40, 'RCF': 40, 'RF': 50 }
    , 'Mensink': { 'P': 100, 'C': 60, '1B': 40, '2B': 1, '3B': 1, 'SS': 1, 'LF': 1, 'LCF': 1, 'RCF': 1, 'RF': 1 }

};