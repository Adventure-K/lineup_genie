/* ----------------  Make a Roster ----START----------------------*/

//Overall Team Roster. The list of (pre-defined) people Steve can choose from. If we want to add people (permanently or on the fly, need to update this roster variable.) 

export let roster = [];

const addToRoster = function (alias, pos, fname, lname, pos2, pos3, sortOrderClass) {
    //alias: name displayed on print outs
    //pos: main position suggested as default
    //fname: first name
    //lname: last name
    //pos2/3: other suggested positions
    //sortOrderClass: 1,2,...,N -- 1 will be at the top of the select list. Can use this so current roster is at top of pick-list and rare people are at the bottom.
    let rosterMember = { "alias": alias, "pos": pos, "fname": fname, "lname": lname, "pos2": pos2, "pos3": pos3, "sortOrderClass": sortOrderClass };
    roster.push(rosterMember);
};

//working from existing list...
//a hacky way to update the roster is just to add to this JSON object.
const roster_20230501 = [{ alias: 'Chalmers', pos: 'Util', fname: 'Nick', lname: 'Chalmers', pos2: '1B', pos3: 'SS', sortOrderClass: '1' }, { alias: 'Burman', pos: '1B', fname: 'Adam', lname: 'Burman', pos2: 'RF', pos3: 'RCF', sortOrderClass: '1' }, { alias: 'Waddick', pos: '1B', fname: 'Brian', lname: 'Waddick', pos2: 'Util', pos3: 'RF', sortOrderClass: '1' }, { alias: 'Oppegaard', pos: '3B', fname: 'Dave', lname: 'Oppegaard', pos2: '', pos3: '', sortOrderClass: '1' }, { alias: 'Schaefer', pos: 'LCF', fname: 'Cole', lname: 'Schaefer', pos2: 'LF', pos3: 'RCF', sortOrderClass: '1' }, { alias: 'May', pos: 'LF', fname: 'Chris', lname: 'May', pos2: 'LCF', pos3: 'RCF', sortOrderClass: '1' }, { alias: 'Welter', pos: 'RF', fname: 'Andrew', lname: 'Welter', pos2: '', pos3: '', sortOrderClass: '1' }, { alias: 'Bieganek', pos: 'SS', fname: 'Aric', lname: 'Bieganek', pos2: '', pos3: '', sortOrderClass: '1' }, { alias: 'DeCausmeaker', pos: 'Util', fname: 'John', lname: 'DeCausmeaker', pos2: 'P', pos3: 'SS', sortOrderClass: '1' }, { alias: 'Norman', pos: 'LF', fname: 'Steve', lname: 'Norman', pos2: 'LCF', pos3: 'RCF', sortOrderClass: '1' }, { alias: 'Lanser', pos: 'RCF', fname: 'Eric', lname: 'Lanser', pos2: 'LCF', pos3: 'RF', sortOrderClass: '1' }, { alias: 'Travis', pos: '2B', fname: 'Lloyd', lname: 'Travis', pos2: '', pos3: '', sortOrderClass: '1' }, { alias: 'Mensink', pos: 'P', fname: 'Mike', lname: 'Mensink', pos2: '', pos3: '', sortOrderClass: '1' }];

//add each person to the roster.
for (let i = 0; i < roster_20230501.length; i++) {
    addToRoster(roster_20230501[i].alias, roster_20230501[i].pos, roster_20230501[i].fname, roster_20230501[i].lname, roster_20230501[i].pos2, roster_20230501[i].pos3, roster_20230501[i].sortOrderClass);
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