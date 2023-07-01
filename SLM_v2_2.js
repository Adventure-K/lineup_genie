//softball lineup maker v2
//const slm = {
//use with SLM_v2.html (same folder) for development

//linting with: https://jshint.com/.
/*jshint esversion: 6 */
/*jshint laxbreak:true */
/*jshint laxcomma:true */
/*jshint ignore:start */
/*
Version 2.1 goals: check that each on-field position is assigned each inning. reject games that fail this test.
*/

/*jshint ignore:end */

//Optimization Control Parameters:
const iterationsToRun = 1000;

//Control Parameters:
const PitcherNeverSits = true;
const CatcherNeverSits = false;

//Dev-Ops Stuff and fun:

const verbose = false; //when almost done, go through and wrap all the (non-failure-notification) console.logs in "if (verbose) {console.log...}" blocks.
const verboseoop = false;
const verbosefill = false;
const runTests = "none"; //Values in use: "all" , "inputConfigurationValidation", "adjacency","utility_and_catcher_assignment",
const TestSet = 2;	//for testing adjacency, multiple scenarios 1,2,3,4

const kaneIsTheMan = true;
const steveIsTheBestManager = true;
const chalmersDoesHisBitTooWhenNeeded = true;
const daveIsCousin = true;

/* ----------------  Make a Roster ----START----------------------*/

//Overall Team Roster. The list of (pre-defined) people Steve can choose from. If we want to add people (permanently or on the fly, need to update this roster variable.) 
let roster = [];

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

//maybe sort roster for the pick-list. (sort on sortOrderClass then...alphabetical by name, or maybe by primary pos, or just the order they're already in...or random or whatever )


/* ---------------- Make a Roster ----END----------------------*/
/* ----------------  Determine Attendance. Assign Batting Order. Assign Role (Primary Position). ----START----------------------*/
//some basic info:

const onFieldPositions = {
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
}; //included "area" to support infield vs outfield utility (in future versions). should probably remove it, b/c that will require a bunch more work and we're unlikely to use it.


const roles = {
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

//define position adjacencies of concern:
let avoidedAdjacencies = [
	{ "3B": "SS" }, { "SS": "3B" }
	, { "LF": "LCF" }, { "LCF": "LF" }
	, { "LCF": "RCF" }, { "RCF": "LCF" }
	//,{"RCF":"RF"},{"RF":"RCF"}	//ignoring RF/RCF adjacency. not that many hits to right-field anyhow
];

//add people playing this game
//Front-end Dev note -- I just assigned to the controlling variable. I'm not sure what kind of HTML hooks/etc you'll use to populate this variable.
//Maybe Steve will want to determine the batting order by choosing from the pick-list in order.
//Maybe we'll want to support re-ordering it later. (So i made a separate variable for that.)

let players = []; //list of player aliases

//example player list: grab from 20230501 roster info (this was 5/1's attendees...in their batting order).
//Front-end Dev note: you need to replace this with with another method for assigning attendees--namely, letting Steve choose it in the UI!
for (let i = 0; i < roster_20230501.length; i++) {
	players.push(roster_20230501[i].alias);
}
//end example set player list

let battingOrder = []; //player (alias) in batting order

//example batting order: grab from 20230501 roster info (this was 5/1's attendees...in their batting order).
//Front-end Dev note: you need to replace this with with another method for assigning batting order--namely, letting Steve choose it in the UI!
//for (let i=0; i < roster_20230501.length;i++) {
//	battingOrder.push(roster_20230501[i].alias);
//}

battingOrder = [
	'Chalmers'
	, 'Norman'
	, 'Waddick'
	, 'Oppegaard'
	, 'DeCausmeaker'
	, 'Lanser'
	, 'Bieganek'
	, 'May'
	, 'Schaefer'
	, 'Burman'
	, 'Travis'
	, 'Mensink'
];

//end example set batting order
let playerRoles = {}; //player (alias):role

//example player roles (i.e. positions): 
//Front-end Dev note: you need to replace this with with another method for assigning player roles/positions--namely, letting Steve choose it at any given time!
playerRoles = {
	Chalmers: 'Util'
	, Burman: '1B'
	, Waddick: 'RF'
	, Oppegaard: '3B'
	, Schaefer: 'LCF'
	, Bieganek: 'SS'
	, DeCausmeaker: 'Util'
	, Norman: 'RCF'	//LF, Util, C
	, Lanser: 'DH'
	, May: 'LF'
	, Travis: '2B'
	, Mensink: 'P'
};
//end example set player roles (positions)

//check batting order validity
let battingOrderValid = false; //initialize as false. we'll check it next, and update.

//Front-End Dev note: i imagine you want to check this when Steve tries to click "submit" or whatever, so i made it a function.
const checkBattingOrderValidity = function (bo, p) {	//bo = battingOrder, p=players
	let allfound = false;
	//First check that length of batting array matches numPlayers
	if (bo.length != p.length) {
		console.log("The number of players in the batting order differs from the number in attendance. BattingOrder:" + bo.length + " vs Players:" + p.length);
		//Front-end Dev note: maybe you want to put these kinds of errors somewhere visible to Steve. I'm sure you'll have others of your own too.
		return false;
	}

	//if total length matches, now check that all positions are filled //Front-End Dev note: depending what solution you use, maybe there will be blanks or nulls or something. We may have to tweak this.
	//for now I'm just checking for names not on the player (attendance) list.

	//check for names not on the attendance list!
	allfound = true; //starting as true, as I'm ANDing it with each 'found' result per player in the batting order. if any one is not found, result will be that this is set to false
	//go through the batting order list
	for (let i = 0; i < bo.length; i++) {
		let found = false; //initialize as false. loop below sets to true when it finds a match.
		//go through the players (attendance) list
		for (let ii = 0; ii < p.length; ii++) {
			if (p[ii] === bo[i]) {
				found = true;
			}
		}
		allfound = allfound && found;
		if (allfound === false) {
			console.log("not all players in batting order are also in the player (attendance) list. Namely: " + bo[i] + " isn't listed.");
			//Front-end Dev note: maybe you want to put these kinds of errors somewhere visible to Steve. I'm sure you'll have others of your own too.
			return false;
		}
	}
	return true;
};

//do the check.
//Front-End Dev note: you may want to change when this happens. it's easy for me but maybe harder for you to know when the batting order is "all done", maybe when steve hits submit or something.
battingOrderValid = checkBattingOrderValidity(battingOrder, players);


//Position Importance. (0=no importance, 100 highest by convention)
let positionImportance = {
	'P': 100
	, 'C': 1
	, '1B': 70
	, '2B': 15
	, '3B': 75
	, 'SS': 85
	, 'LF': 90
	, 'LCF': 80
	, 'RCF': 70
	, 'RF': 10
};

//PlayerSkill. 0=incapable. 100 highest by convention. 
//Another note on the scale: This will be randomized on the order of 0 to +20 points, (2 binary rolls of 0|5), so centered on +5). So ~ 5% of highest assignable skill by convention.
let playerSkill = {
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




//check player role validity
//each player is assigned. total length of this array matches numPlayers
//each position is assigned
//correct # of utilities/DHs assigned
//requirements: depending on # of players, and whether someone is assigned to catcher or not, there is an expected # of utility (or DH) players
//numPlayers minus 10
//if no C is assigned, +1 utility
//with 9 players we skip RCF i guess.
//cases:
//9 players: No RCF. 0 utility (+1 if no C)
//10 players = 0 utility (+1 if no C)
//11 players = 1 utility (+1 if no C)
//12 players = 2 utility (+1 if no C)
//13 players = 3 utility (+1 if no C)

let playerRoleValidity = false; //initializing as false. we'll check it next and update.

//Front-End Dev note: i imagine you want to check this when Steve tries to click "submit" or whatever, so i made it a function.
const checkPlayerRoleValidity = function (pr, p) {	//pr = playerRoles {}, p=players []
	//does the playerRoles object have the same # of elements as the players array?
	//get length of playerRoles assignment
	let playerRolesLength = 0;
	for (var player in pr) {
		if (pr.hasOwnProperty(player)) {
			playerRolesLength = playerRolesLength + 1;
		}
	}
	//now check if lengths match
	if (p.length != playerRolesLength) {
		console.log("different # of players assigned roles than players designated as in attendance. players in attendance: " + p.length + ". players assigned roles:" + playerRolesLength);
		return false;
	}

	//check how many are assigned to each role
	let posNums = {
		"P": 0
		, "C": 0
		, "1B": 0
		, "2B": 0
		, "3B": 0
		, "SS": 0
		, "LF": 0
		, "LCF": 0
		, "RCF": 0
		, "RF": 0
		, "UtilOrDH": 0
	}; //start at 0, add in more as I find them!

	//tally up count in each position. probably could it done it more elegantly, but it's fine.
	for (let i = 0; i < p.length; i++) {
		if (pr[p[i]] === "DH") {
			posNums.UtilOrDH = posNums.UtilOrDH + 1;
		}
		if (pr[p[i]] === "Util" || pr[p[i]] === "IFU" || pr[p[i]] === "OFU") {
			posNums.UtilOrDH = posNums.UtilOrDH + 1;
		}
		if (pr[p[i]] === "P") {
			posNums.P = posNums.P + 1;
		}
		if (pr[p[i]] === "C") {
			posNums.C = posNums.C + 1;
		}
		if (pr[p[i]] === "1B") {
			posNums["1B"] = posNums["1B"] + 1;
		}
		if (pr[p[i]] === "2B") {
			posNums["2B"] = posNums["2B"] + 1;
		}
		if (pr[p[i]] === "3B") {
			posNums["3B"] = posNums["3B"] + 1;
		}
		if (pr[p[i]] === "SS") {
			posNums["SS"] = posNums["SS"] + 1;
		}
		if (pr[p[i]] === "LF") {
			posNums["LF"] = posNums["LF"] + 1;
		}
		if (pr[p[i]] === "LCF") {
			posNums["LCF"] = posNums["LCF"] + 1;
		}
		if (pr[p[i]] === "RCF") {
			posNums["RCF"] = posNums["RCF"] + 1;
		}
		if (pr[p[i]] === "RF") {
			posNums["RF"] = posNums["RF"] + 1;
		}
	}

	let c = false; //catcher assigned (inside validity check function)
	if (posNums.C > 0) {
		c = true;
	}

	//console.log(posNums);

	//are expected positions assigned?
	//define expected positions. this is relative to # of players and whether catcher is assigned
	let expectedPosNums = {
		"P": 1
		, "C": 0
		, "1B": 1
		, "2B": 1
		, "3B": 1
		, "SS": 1
		, "LF": 1
		, "LCF": 1
		, "RCF": 1
		, "RF": 1
		, "UtilOrDH": 1
	};
	//console.log(expectedPosNums);
	//adjust expected Number of players per position, based on # of players attending, and whether a catcher is assigned.
	if (p.length === 9) {
		//9 players: no RCF
		expectedPosNums.RCF = 0;
		//9 players: 0 utilities. +1 if C.
		if (c === true) {
			expectedPosNums.C = 1;
			expectedPosNums.UtilOrDH = 0;
		} else {
			expectedPosNums.C = 0;
			expectedPosNums.UtilOrDH = 1;
		}
	} else {
		//if not 9 players, the general formula is consistent
		if (c === true) {
			expectedPosNums.C = 1;
			expectedPosNums.UtilOrDH = expectedPosNums.UtilOrDH - 1; //catcher replaces the (1) default expected Utility
		}
		expectedPosNums.UtilOrDH = expectedPosNums.UtilOrDH + p.length - 10;
		//e.g. 10 players with catcher. 0+10-10 = 0;
		//e.g. 10 players with no catcher. 1+10-10 = 1
		//e.g. 11 players with no catcher. 1+11-10 =2 
		//e.g. 12 players with no catcher. 1+12-10 =3 
	}
	//console.log(expectedPosNums);

	//check assigned roles versus expected # in each role/position.
	//loop through each role/position. check for each role if counts match in expected and actual assigned roles
	let posCheck = {};
	for (var pos in expectedPosNums) {
		if (expectedPosNums.hasOwnProperty(pos)) {
			if (posNums[pos] === expectedPosNums[pos]) {
				posCheck[pos] = true;
			} else {
				posCheck[pos] = false;
			}
		}
	}
	//console.log(posCheck);
	let allpospass = true; //initialize as true. going to AND tests to it below.
	//loop through the posCheck object and make sure all positions are positive.
	for (var posC in posCheck) {
		if (expectedPosNums.hasOwnProperty(posC)) {
			allpospass = allpospass && posCheck[posC];
		}
	}
	if (allpospass) {
		if (verbose) {
			console.log("Role Assignment passes validation.");
		}
		return true;
	} else {
		console.log("!!!!! Role Assignment FAILS validation !!!!!");
		console.log("Roles with wrong # of people:" + JSON.stringify(posCheck));
		//console.log(posCheck);
		console.log("# in each Role:" + JSON.stringify(posNums));
		//console.log(posNums);
		console.log("Role assignments:" + JSON.stringify(pr));
		//console.log(pr);
		if (p.length === 9 && posNums.RCF === 1) {
			console.log("With 9 players, this script assumes we won't use a Right-center fielder.");
		}
		return false;
	}
};


//do the check.
//Front-End Dev note: you may want to change when this happens. it's easy for me but maybe harder for you to know when the position assignment is "all done", maybe when steve hits submit or something.
playerRoleValidity = checkPlayerRoleValidity(playerRoles, players);

/* ----------------  Determine Attendance. Assign Batting Order. Assign Primary Position. ----END----------------------*/

/* ----------------  Determine Utility and Catcher Assignment by Inning (and all other assignments too, of course) ----START----------------------*/
//basic setup info
const numInnings = 14;
//const inningInfo = {1:1,2:1,3:1,4:1,5:1,6:1,7:1,8:2,9:2,10:2,11:2,12:2,13:2,14:2}; //i dunno, in case i want a "robust" way to assign innings to games (a lookup, rather than a formula). maybe we'll play 5-inning triple-headers to make up time someday b/c of covid 2.0 or something. I'd hate to have to write new code during a second global pandemic! (LOL)

const innings = [];
for (let i = 0; i < numInnings; i++) {
	innings.push(i + 1);
}

let inningAssignments = []; //e.g. [1:{P:"Mensink", 1B:"Burman",...}, 2:{P:"Mensink"...}, 3...]


//-------------Generic Inning Assignments:

const resetInningAssignments = function () { //works from global variables
	//Start by assigning every player with a position-specific role (P, 1B, 2B, etc.) to their position each inning
	//loop through innings. i feel like i'm definitely going to make off-by-one errors with the innings array...0 based, and innings numbered starting with 1. just be careful.
	for (let i = 0; i < innings.length; i++) {
		//create any empty object for each inning
		inningAssignments[innings[i]] = {};
		//console.log(inningAssignments);
		//for each field position, assign a player to it
		//loop through field positions
		for (var pos in onFieldPositions) {
			if (onFieldPositions.hasOwnProperty(pos)) {
				//assign a player to this field position this inning. (At his stage assign the default/standard player, per (non utility) player roles)
				//loop through playerRoles
				for (var player in playerRoles) {
					if (playerRoles.hasOwnProperty(player)) {
						//when the role being checked right now is the position being checked right now, assign! A bit hard to follow, but (current 5/3/2023) QA tests pass.
						if (playerRoles[player] === pos) {
							inningAssignments[innings[i]][pos] = player;
						}
					}
				}
			}
		}
	}
}
resetInningAssignments();
//this array has an empty first element. i guess that's acceptable. it sort of fixes the 0-base vs 1-base problem. just keep being careful.
console.log("base position assignments by inning, before out-of-position (sitting/catching) assignment starts");
console.log(inningAssignments);

//find number of utility players
let utilities = 0;
for (let i = 0; i < players.length; i++) {
	if (playerRoles[players[i]] === "Util" || playerRoles[players[i]] === "IFU" || playerRoles[players[i]] === "OFU") {
		utilities = utilities + 1;
	}
}
//find if we have a catcher role assigned
let catcherAssigned = false;
for (let i = 0; i < players.length; i++) {
	if (playerRoles[players[i]] === "C") {
		catcherAssigned = true;
	}
}


//depending on # of utility players and if we have a catcher role, pick 0 or more people to play catcher or to sit.
let numOutOfPos = utilities; //the number of players playing catcher or sitting is the same as the # of utility players (else who would play their normal positions?)

//number of sitters is almost the same as the above, but need to check if we have a catcher assigned.
let numSitters = utilities;
if (catcherAssigned === false) {
	numSitters = numSitters - 1; //if we do not have a catcher assigned, someone has to play there (1 less person can sit) (same # are playing out of position though, this doesn't impact that.)
}

if (verbose) {
	console.log("Players Attending Today:" + players.length + ". Utilities:" + utilities + ". T/F we have a catcher assigned?:" + catcherAssigned + ". " + numSitters + " sitting each inning.");
}

//since i'll use it a lot, random number function copied from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomIntInclusive = function (min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
};

//pick people to sit or play catcher
//I would start with the top of the order, but that would obviously be unfair over multiple weeks (assuming same people tend to be at the top of the order each week)
//so using random number generation. I found out (later, intiially) that i should just base this off of non-exempt people to start with.

//make batting order excluding exempt players
let battingOrderNonExempt = [];
for (let i = 0; i < battingOrder.length; i++) {
	let exempt = false;
	if (PitcherNeverSits) {
		if (playerRoles[battingOrder[i]] === "P") {
			exempt = true;
		}
	}
	if (CatcherNeverSits) {
		if (playerRoles[battingOrder[i]] === "C") {
			exempt = true;
		}
	}
	if (playerRoles[battingOrder[i]] === "DH") {
		exempt = true;
	}
	if (exempt === false) {
		battingOrderNonExempt.push(battingOrder[i]);
	}
}

if (verbose) {
	console.log("Batting order excluding exempt people:\n" + battingOrderNonExempt);
}

let playerGameInfo = {};

const resetPlayerGameInfo = function () { //works from global variables.
	playerGameInfo = {};
	for (var player in playerRoles) {
		if (playerRoles.hasOwnProperty(player)) {
			playerGameInfo[player] = {}; //setup an object for each player: name: {key1:value1, key2:value2,...}
			//add facts!
			//role
			playerGameInfo[player].role = playerRoles[player];
			//batting order
			for (let i = 0; i < battingOrder.length; i++) {
				if (battingOrder[i] === player) {
					playerGameInfo[player].battingOrderIndex = i;
					playerGameInfo[player].battingOrder = i + 1;
				}
			}
			//batting order nonExempt
			for (let i = 0; i < battingOrderNonExempt.length; i++) {
				if (battingOrder[i] === player) {

					playerGameInfo[player].battingOrderNonExemptIndex = i;
					//playerGameInfo[player].battingOrderNonExempt=i+1;
				}
			}
			//out of position counts. used for choosing whom to play OOP beyond initial random selection (and default spacing), and later for checkign fairness.
			//initialize these at 0 here
			playerGameInfo[player].catchCt = 0;
			playerGameInfo[player].sitCt = 0;
			playerGameInfo[player].OOPCt = 0;
		}
	}
}

resetPlayerGameInfo();
// Choose who plays out of position (Sit/Catch/etc.) each inning
// 2023-05-08: picking people at random from a candidate pool for all inning OOP selections
//Checking Adjacency requirements and Equity, and already selected. Restricting the pool accordingly, then picking someone from the pool at random.
//repeating above until I have enough OOP people.

let OOPcandidatePool = [];
let OOPinfo = [];

const Pick1OOP = function (inning, ma, cO, c, oopp, tis) {	//works from global variables: playerGameInfo (OOP count, role). Sets OOPinfo. 
	OOPcandidatePool = []; //empty the candidate pool
	let currentOOP = cO || [];
	let previousOOPinfo = OOPinfo;	//store this here, may need/want it if need to retry random selection but keep 1st 1 or 2 (etc) OOP selections
	OOPinfo = currentOOP; //empty this out, unless a value is passed here (likely from this very function, recursively)
	let margin = ma || 0;
	let counter = c || 0; //initialize or inhert the count. 		//c is a counter in case i need to make this recursive.
	//counter = counter +1; //increment the count (this is now done in the empty OOP candidate pool section)
	let OOPpadding = oopp || 2;
	if (oopp === 0) {
		OOPpadding = 0; //# of innings of OOP immunity after last sitting. 0 = can sit adjacent. 1= can't. 2=at least 2 inning between sits. etc.
	}
	//let OOPpadding = oopp || 2;	//# of innings of OOP immunity after last sitting. 0 = can sit adjacent. 1= can't. 2=at least 2 inning between sits. etc.
	let forbidTwiceInSeven = tis || true;
	if (tis === false || utilities > 3) {	//if 4+ utility players, also need to turn off this requirement.
		forbidTwiceInSeven = false; //forbid sitting more than 2x in 7 innings (trailing 6). boolean. defaults to true.	
	}


	//skippedreq = skippedreq; //array of requirement #s skipped. e.g. [5]. Only supports 5 right now..NOT IMPLEMENTED AT ALL

	//requirements to be in the pool. 
	//1. batting order nonExempt member
	//2. not already in OOPinfo
	//3. having you sit will not violate adjacency requirements.
	//4. sat within margin # of times of qualified player who has sat the least
	//5. Sat last inning
	//6. Already sat 2x in current game. (1-7,8-14)
	//let's do each test in turn. #3 AMONG qualifiers for #1/#2. #4 AMONG qualifiers for #1/2/3		

	//reqs 1 and 2:
	//build the pool criteria (full pool, each player flagged to eliminate or not when building the final pool)
	let OOPcandidatePoolInfo = [];
	for (let i = 0; i < battingOrderNonExempt.length; i++) { //requirement 1. starting universe is the non-exempt batting order members
		OOPcandidatePoolInfo.push({});
		OOPcandidatePoolInfo[i].player = battingOrderNonExempt[i];
		//OOPcandidatePoolInfo[i].battingOrderNonExempt = i;
		OOPcandidatePoolInfo[i].eliminated = false;
		OOPcandidatePoolInfo[i].eliminatedReasons = [];
		//requirement 2. omit people already selected this inning
		for (let j = 0; j < currentOOP.length; j++) {
			if (currentOOP[j].player === battingOrderNonExempt[i]) {
				OOPcandidatePoolInfo[i].eliminated = true;
				OOPcandidatePoolInfo[i].eliminatedReasons.push("Inning#" + inning + " Already selcted as OOP this inning.");
			}
		}
		//append more facts
		//find player roles and OOPct for remaining players (needed in each of req #3 and #4)
		for (var playerR in playerGameInfo) {
			if (playerGameInfo.hasOwnProperty(playerR)) {
				if (playerR === battingOrderNonExempt[i]) {
					OOPcandidatePoolInfo[i].role = playerGameInfo[playerR].role;
					OOPcandidatePoolInfo[i].OOPCt = playerGameInfo[playerR].OOPCt;
				}
			}
		}
	}

	//loop through pool info and include in candidate pool only those who qualify after latest requirement.
	for (let i = 0; i < OOPcandidatePoolInfo.length; i++) {
		if (OOPcandidatePoolInfo[i].eliminated === false) {
			OOPcandidatePool.push(OOPcandidatePoolInfo[i].player);
		}
	}

	//Requirement 3 -- 	//eliminate people in an adjacent position to someone already picked.
	if (currentOOP.length > 0) {
		let avoidedRoles = [];
		//for each person already selected, find the roles that cannot be subbed for
		for (let j = 0; j < currentOOP.length; j++) {
			//currentOOP[j].role
			//loop through avoidedAdjacencies and flag the roles that aren't eligible
			for (let i = 0; i < avoidedAdjacencies.length; i++) {
				if (avoidedAdjacencies[i][currentOOP[j].role] != undefined) { //find the role of the subbed player. e.g. LCF
					avoidedRoles.push(avoidedAdjacencies[i][currentOOP[j].role]); //push the related avoided adjaceny. e.g. LF, RCF
				}
			}
		}
		//find the players in those roles, and mark them eliminated from the pool
		if (avoidedRoles.length > 0) {
			for (let j = 0; j < avoidedRoles.length; j++) {
				for (let i = 0; i < OOPcandidatePoolInfo.length; i++) {
					if (avoidedRoles[j] === OOPcandidatePoolInfo[i].role) {
						OOPcandidatePoolInfo[i].eliminated = true;
						OOPcandidatePoolInfo[i].eliminatedReasons.push("Inning#" + inning + " AdjacentPosition");
					}
				}
			}
		}
		//update the pool (req 3)
		OOPcandidatePool = [];
		//loop through pool info and include in candidate pool only those who qualify after latest requirement.
		for (let i = 0; i < OOPcandidatePoolInfo.length; i++) {
			if (OOPcandidatePoolInfo[i].eliminated === false) {
				OOPcandidatePool.push(OOPcandidatePoolInfo[i].player);
			}
		}
	}


	//requirement 4. Hasn't sat more than (remaining) others (within margin)
	//get least OOP among those who are still eligible to OOP this inning
	let leastOOP = 99;
	for (let i = 0; i < OOPcandidatePoolInfo.length; i++) {
		if (OOPcandidatePoolInfo[i].eliminated === false) {
			leastOOP = Math.min(leastOOP, OOPcandidatePoolInfo[i].OOPCt);
		}
	} //updated leastOOP. For comparison (per req 4) to each player's OOP Count
	for (let i = 0; i < OOPcandidatePoolInfo.length; i++) {
		for (var player in playerGameInfo) {
			if (playerGameInfo.hasOwnProperty(player)) {
				if (OOPcandidatePoolInfo[i].player === player) {
					if (playerGameInfo[player].OOPCt > leastOOP + margin) { //eliminate if has sat too much relative to least sitters.
						OOPcandidatePoolInfo[i].eliminated = true;
						OOPcandidatePoolInfo[i].eliminatedReasons.push("Inning#" + inning + " OOP Equity. Margin:" + margin);
					}
				}
			}
		}
	}

	//update the pool (Req4)
	OOPcandidatePool = [];
	//loop through pool info and include in candidate pool only those who qualify after latest requirement.
	for (let i = 0; i < OOPcandidatePoolInfo.length; i++) {
		if (OOPcandidatePoolInfo[i].eliminated === false) {
			OOPcandidatePool.push(OOPcandidatePoolInfo[i].player);
		}
	}

	//Requirement 5 - didn't sit in last N innings. maybe start this at 2, and then relax to 1 or 0 if can't find a solution?
	//find innings to consider:
	let OOPpaddingInningRangeStart = Math.max(inning - OOPpadding, 1);
	//e.g. inning 4, padding 1. start is 3. this means if sat in 3rd, can't also sit in the 4th.
	let OOPpaddingInningRange = [];
	//1-14 (vs 0 <14)
	for (let i = 1; i <= numInnings; i++) {
		if (i >= OOPpaddingInningRangeStart && i < inning) {
			OOPpaddingInningRange.push(i);
		}
	}
	let OOPRecently = [];
	//if there are any innigns to consider, do more stuff
	if (OOPpaddingInningRange.length > 0 && OOPpadding > 0) {
		//find inningAssignments for those innings
		for (let i = OOPpaddingInningRangeStart; i < inning; i++) {
			//if catcher is not set, then add catcher to the list to omit this inning
			if (catcherAssigned === false) {
				OOPRecently.push(inningAssignments[i]["C"]);
			}
			//loop through those set to sit and add each of them to the list
			for (let j = 0; j < inningAssignments[i].sit.length; j++) {
				OOPRecently.push(inningAssignments[i].sit[j]);
			}
		}
		//update Candidate Pool Info
		for (let i = 0; i < OOPcandidatePoolInfo.length; i++) {
			for (let j = 0; j < OOPRecently.length; j++) {
				if (OOPcandidatePoolInfo[i].player === OOPRecently[j]) {
					OOPcandidatePoolInfo[i].eliminated = true;
					OOPcandidatePoolInfo[i].eliminatedReasons.push("Inning#" + inning + " OOP Recently. Padding:" + OOPpadding);
				}
			}
		}
		//update the pool (Req5)
		OOPcandidatePool = [];
		//loop through pool info and include in candidate pool only those who qualify after latest requirement.
		for (let i = 0; i < OOPcandidatePoolInfo.length; i++) {
			if (OOPcandidatePoolInfo[i].eliminated === false) {
				OOPcandidatePool.push(OOPcandidatePoolInfo[i].player);
			}
		}
	}	//end Requirement 5 (sat/OOP recently)

	//Requirement 6 (Sit no more than 2x per game). 
	//To make it a bit more generalized, how about sit no more than 2x in any 7 innings. 
	//i think that strictly includes the 2x per game requirement. (assuming all games are 7 or fewer innings)

	//find the innings to consider based on the current inning.
	let OOPperGameRangeStart = Math.max(inning - 6, 1);
	//e.g. inning 7: start is 1 (1-7). inning 10, start is 4 (4-10). 
	let OOPperGameInningRange = [];
	//1-14 (vs 0 <14)
	for (let i = 1; i <= numInnings; i++) {
		if (i >= OOPpaddingInningRangeStart && i < inning) {
			OOPperGameInningRange.push(i);
		}
	}

	let TimesOOPlastSeven = {};
	let OOPTwiceInSeven = [];
	//if there are any innings to consider, do more stuff
	if (OOPperGameInningRange.length > 0 && forbidTwiceInSeven === true) {
		//find inningAssignments for those innings
		for (let i = OOPperGameRangeStart; i < inning; i++) {
			//if catcher is not set, then add catcher to the list to omit this inning
			if (catcherAssigned === false) {
				//OOPTwiceInSeven.push(inningAssignments[i]["C"]);
				TimesOOPlastSeven[inningAssignments[i]["C"]] = TimesOOPlastSeven[inningAssignments[i]["C"]] + 1 || 1;
			}
			//loop through those set to sit and add each of them to the list
			for (let j = 0; j < inningAssignments[i].sit.length; j++) {
				//OOPTwiceInSeven.push(inningAssignments[i].sit[j]);
				TimesOOPlastSeven[inningAssignments[i].sit[j]] = TimesOOPlastSeven[inningAssignments[i].sit[j]] + 1 || 1;
			}
		}
		//make a list of those who've sat twice in trailing 6 innings (to prevent 3x in 7). i.e. OOPTwiceInSeven
		for (var playerTS in TimesOOPlastSeven) {
			if (TimesOOPlastSeven.hasOwnProperty(playerTS)) {
				if (TimesOOPlastSeven[playerTS] >= 2) {
					OOPTwiceInSeven.push(playerTS);
				}
			}
		}

		//update Candidate Pool Info
		for (let i = 0; i < OOPcandidatePoolInfo.length; i++) {
			for (let j = 0; j < OOPTwiceInSeven.length; j++) {
				if (OOPcandidatePoolInfo[i].player === OOPTwiceInSeven[j]) {
					OOPcandidatePoolInfo[i].eliminated = true;
					OOPcandidatePoolInfo[i].eliminatedReasons.push("Inning#" + inning + " Can't be OOP twice in 7 innings.");
				}
			}
		}

		//update the pool (Req6)
		OOPcandidatePool = [];
		//loop through pool info and include in candidate pool only those who qualify after latest requirement.
		for (let i = 0; i < OOPcandidatePoolInfo.length; i++) {
			if (OOPcandidatePoolInfo[i].eliminated === false) {
				OOPcandidatePool.push(OOPcandidatePoolInfo[i].player);
			}
		}
	}	//end Requirement 6 (>3 sits per 7 innings)


	//requirements done. now check that anyone is left to assign!
	//check whether anyone is left in the pool
	if (OOPcandidatePool.length === 0) { //if zero left, loosen margin requirements and try again
		if (counter < 10) {	//50
			//retry the inning with the same requirements, increment the counter
			return Pick1OOP(inning, margin, [], counter + 1, OOPpadding, true);
		} else if (counter <= 20) {		//150
			console.log("inning#" + inning + " is attempting 50+ times before finding an OOP solution. Relaxing no more than twice-per-7 requirement.");

			return Pick1OOP(inning, margin, [], counter + 1, OOPpadding, false);
		} else if (counter < 30) {	//250
			console.log("inning#" + inning + " is attempting 150+ times before finding an OOP solution. retrying the whole inning without twice-per-7 requirement.");
			return Pick1OOP(inning, Math.min(margin + 1, 2), [], counter + 1, OOPpadding, false);	//do NOT pass CURRENT OOPinfo, so that it resets what it has done above and tries again. If i pass nothing it'll start the whole inning over (with higher margin), probably better to pass it "established" OOP selections in the global variable.			
		} else if (counter < 40) {	//400
			console.log("inning#" + inning + " is attempting 250+ times before finding an OOP solution. Removing Inning Spacing requirements.");

			return Pick1OOP(inning, margin + 1, [], counter + 1, Math.max(OOPpadding - 1, 0), false); //shouldn't happen, but retry the whole inning OOP if it takes more than 100 attempts
		} else if (counter < 50) {	//1000
			console.log("inning#" + inning + " is attempting 400+ times before finding an OOP solution. Removing Inning Spacing requirements, and retrying the whole inning.");

			return Pick1OOP(inning, margin + 1, [], counter + 1, Math.max(OOPpadding - 1, 0), false);
		} else {
			console.log("uh oh! tried to assign out-of-position players for inning#" + inning + " 1000 times without success. This shouldn't happen.");
			return false;
		}
	} else {
		//if candidate pool is not empty, assign one member at random to be OOP this inning
		let theChosenOne = {};
		let theChosenOneIndex = getRandomIntInclusive(0, OOPcandidatePool.length - 1);
		//find info for the chosen one
		for (let i = 0; i < OOPcandidatePoolInfo.length; i++) {
			if (OOPcandidatePool[theChosenOneIndex] === OOPcandidatePoolInfo[i].player) {
				theChosenOne.player = OOPcandidatePoolInfo[i].player;
				theChosenOne.role = OOPcandidatePoolInfo[i].role;
				theChosenOne.OOPCt = OOPcandidatePoolInfo[i].OOPCt + 1;
				//theChosenOne.battingOrderNonExempt = OOPcandidatePoolInfo[i].battingOrderNonExempt;
			}
		}
		currentOOP.push(theChosenOne);
		//update OOPinfo
		OOPinfo = currentOOP;

		//including here for debuging:
		//start mid-game equity
		if (verbose || verboseoop) {
			OOPCounts = {};
			OOPCountDetail = {};
			OOPEquityCheck();
			if (verbose || verboseoop) {
				console.log("mid-game equity check for inning#:" + inning + "\n" + JSON.stringify(OOPCountDetail));
			}
			//end mid-game equity
		}
		return theChosenOne.player;
	}
}; //end PickOOP. Sets OOPinfo: [{player:XYZ},{battingOrderNonExempt:0},{role:"Util"}],{OOPCt:0}. Updates playerGameInfo OOPCt

//let testOOPinfo = [{player:"Schaefer",role:"LCF",OOPCt:1}];
//Pick1OOP(1,0,testOOPinfo);

const PickAllOOP = function (inning) {	//calls Pick1OOP until all needed OOP selections are made. 
	let numAssignedOOP = 0;
	let safetyCounter = 0;
	OOPinfo = [];
	while (numAssignedOOP < numOutOfPos) {
		let confirmPicked = Pick1OOP(inning, 0, OOPinfo, 0);	//always starts at margin=0 and pass in latest OOP
		if (confirmPicked) {
			numAssignedOOP = numAssignedOOP + 1;
		}
		safetyCounter = safetyCounter + 1;
		if (safetyCounter > 50000) {
			console.log("abandoning OOP after 50k attempts.")
			return false;
			numAssignedOOP = 3;
		}
	}
	//update OOPCt in playerGameInfo
	for (var player in playerGameInfo) {
		if (playerGameInfo.hasOwnProperty(player)) {
			for (let j = 0; j < OOPinfo.length; j++) {
				if (OOPinfo[j].player === player) {
					playerGameInfo[player].OOPCt = playerGameInfo[player].OOPCt + 1;
				}
			}
		}
	}
	return true;
};

//PickAllOOP(1);
let OOPCounts = {};
let OOPCountDetail = {};

const OOPEquityCheck = function () {	//works from global variables. returns true = pass, false=fail
	let leastOOP = 99;
	let greatestOOP = 0;
	let OOPEquityInfo = [];
	for (let i = 0; i < battingOrderNonExempt.length; i++) {
		let thisGuy = {};
		thisGuy.player = battingOrderNonExempt[i];
		for (var player in playerGameInfo) {
			if (playerGameInfo.hasOwnProperty(player)) {
				if (battingOrderNonExempt[i] === player) {
					leastOOP = Math.min(leastOOP, playerGameInfo[player].OOPCt);
					greatestOOP = Math.max(greatestOOP, playerGameInfo[player].OOPCt);
					thisGuy.OOPCt = playerGameInfo[player].OOPCt;
				}
			}
		}
		OOPEquityInfo.push(thisGuy);
	} //updated leastOOP. 

	//for each player: see if they OOP more than the person who OOPed the least (by more than 1) (among nonexempt players)
	//group by # of OOP
	OOPCounts = {};
	OOPCountDetail = {};
	for (let i = 0; i < OOPEquityInfo.length; i++) {
		OOPCounts[OOPEquityInfo[i].OOPCt] = OOPCounts[OOPEquityInfo[i].OOPCt] + 1 || 1;
		if (OOPCountDetail[OOPEquityInfo[i].OOPCt]) {
			OOPCountDetail[OOPEquityInfo[i].OOPCt].push(OOPEquityInfo[i].player);
		} else {
			OOPCountDetail[OOPEquityInfo[i].OOPCt] = [];
			OOPCountDetail[OOPEquityInfo[i].OOPCt].push(OOPEquityInfo[i].player);
		}

	}

	if (greatestOOP > leastOOP + 1) {
		//console.log("Unequal OOP/sitting this game. GreatestOOP:"+greatestOOP+" LeastOOP:"+leastOOP+".");
		return false;
	}
	else {
		return true;
	}
};




/* ------- Adjacency (within inning testing and reassignment of OOP------END-----*/
/* ------ fill positions, and determine bench/catch ----START--*/
//plan:
//try to fill the (now open) field positions 
//Using the playerRolesExtended prioritization for this.
//Look at the positions that need to be filled. Look at the utility players.
//For all open positions and all utility players, look up their position prefrence (playerRolesExtended).
//for each position, determine the rank order among the utility players
//assign the 1st position to be played by player with highest rank order.
//remove that player from consideration for the other positions
//assign next position to be played by the remaining player with the highest rank order
//repeat the prior 2 steps until done.
//In this version, I don't care about ties, as long as someone is assigned.




let openFieldPositionsInfo = [];
let fillPositions = function (inning, rounds, scale) { //modify global variables.
	//for noisy skill:
	rounds = rounds || 2;
	scale = scale || 5;
	//
	openFieldPositionsInfo = [];
	//from OOPinfo, determine (field position) that are empty. (A utility player may be sitting, so even if we have 3 utility players, we may only need to fill 2 fied positions)
	let openFieldPositions = [];
	for (let i = 0; i < OOPinfo.length; i++) {
		for (var position in onFieldPositions) {
			//if it's an actual position (not DH, not utility, etc.) then it goes in open Field Positions
			if (onFieldPositions.hasOwnProperty(position)) {
				if (OOPinfo[i].role === position) {
					openFieldPositions.push(OOPinfo[i].role);
				}
			}
		}
	}

	//lets make an info object for this, so I can assign people to the positions, etc.
	for (let i = 0; i < openFieldPositions.length; i++) {
		let openPos = {};
		openPos.position = openFieldPositions[i];
		openPos.importance = positionImportance[openFieldPositions[i]];
		openFieldPositionsInfo.push(openPos);
	}

	if (verbose || verbosefill) {
		console.log("open positions inning#:" + inning + JSON.stringify(openFieldPositionsInfo));
	}

	//figure out which utility players are available this inning. (Some may be OOP this inning)
	let unavailableUtil = [];
	//figure out which players are utility, then figure out which are OOP this inning. 
	for (var player in playerRoles) {
		//look through playerRoles and keep just the utility players
		if (playerRoles.hasOwnProperty(player)) {
			if (playerRoles[player] === "Util" || playerRoles[player] === "IFU" || playerRoles[player] === "OFU") {
				//look through those out of position, and keep just those NOT out of position this inning
				for (let i = 0; i < OOPinfo.length; i++) {
					if (OOPinfo[i].player === player) {
						unavailableUtil.push(player);
					}
				}
			}
		}
	}
	if (verbose && verbosefill) {
		console.log("unavailable utility:" + unavailableUtil);
	}

	//seems i could have done this better, but going with it. now that i've found unavailable utility players, determine available ones...start with all of them, and splice out unavailable?
	let utilPlayers = [];
	for (let i = 0; i < players.length; i++) {
		if (playerRoles[players[i]] === "Util" || playerRoles[players[i]] === "IFU" || playerRoles[players[i]] === "OFU") {
			utilPlayers.push(players[i]);
		}
	}
	if (verbose && verbosefill) {
		console.log("all utility:" + utilPlayers);
	}
	let availableUtil = [];
	for (let i = 0; i < utilPlayers.length; i++) {
		let isUnavail = false;
		for (let j = 0; j < unavailableUtil.length; j++) {
			if (utilPlayers[i] === unavailableUtil[j]) {
				isUnavail = true;
			}
		}
		if (isUnavail === false) {
			availableUtil.push(utilPlayers[i]);
		}
	}

	if (verbose || verbosefill) {
		console.log("available utility:" + availableUtil);
	}


	//Determine Position Priority among open positions. Actually I don't need to do this if doing variation B of optimization (all combos)
	//let sorted = Object.keys(positionImportance).sort(function(a,b){return positionImportance[b]-positionImportance[a]});
	//generate all combinations of available utility players in each position.
	//OK, I'm going to be lame and not generate all distinct combinations, but just 10 at random. (could do less than 10 to save time...1, 4, 9 are common # of unique combos)

	let someCombos = generatePlayerPosCombos(openFieldPositionsInfo, availableUtil);


	//score each combination. without (esimatedSkill) and with (noisySkill) noise.
	let comboScores = [];
	for (let i = 0; i < someCombos.length; i++) {
		thisCombo = {};
		thisCombo.index = i;
		thisCombo.score = 0;
		thisCombo.noisyScore = 0;
		thisCombo.assignments = someCombos[i];

		//score each combination (position assignment set)
		for (var position in someCombos[i]) {
			if (someCombos[i].hasOwnProperty(position)) {
				let weight = positionImportance[position];
				let estimatedSkill = playerSkill[someCombos[i][position]][position]; // playerSKill[player][position]
				let noisySkill = makeNoisySkill(estimatedSkill, rounds, scale); //add the randomness factor to each player's estimated skill
				thisCombo.score = thisCombo.score + estimatedSkill * weight; //score skill*importance for each assignment  (2 versions, estimated skill, and noisyskill (with randomness))
				thisCombo.noisyScore = thisCombo.noisyScore + noisySkill * weight;
			}
		}
		comboScores.push(thisCombo);
	}
	//pick the combination with the best score (noisy skill). assign positions accordingly.
	//find that combination
	let bestNoisyComboScore = 0;
	let playerAssignmentUsed = {};
	for (let i = 0; i < comboScores.length; i++) {
		bestNoisyComboScore = Math.max(bestNoisyComboScore, comboScores[i].noisyScore);
		if (bestNoisyComboScore === comboScores[i].noisyScore) {
			playerAssignmentUsed = comboScores[i].assignments;
		}
	}

	//update inning Assignments with the utility players selected in the open positions.
	for (var position in playerAssignmentUsed) {
		if (playerAssignmentUsed.hasOwnProperty(position)) {
			inningAssignments[inning][position] = playerAssignmentUsed[position];
		}
	}


	//assign OOP players to catch or sit. (whoever has done it the least? then random to settle ties?)
	if (catcherAssigned === true) {
		//if catcher role is filled, OOP are all sitting.
		inningAssignments[inning]["sit"] = [];	//bleh, this needs to be an array, b/c it can have multiples. it's OK. later when printing the lineup it'll be a bit more complicated to code.
		for (let i = 0; i < OOPinfo.length; i++) {
			//update inningAssignment
			inningAssignments[inning]["sit"].push(OOPinfo[i].player);
			//update playerGameInfo (sit count)
			playerGameInfo[OOPinfo[i].player].sitCt = playerGameInfo[OOPinfo[i].player].sitCt + 1;
		}
	} else {
		//check catchCt for each OOP player. find minimum catch count. assign a player with the minimum catch count to catcher, and the rest to sit. update sit and catch counts.
		//find minimum catch count
		let minCatchCt = 99;
		for (let i = 0; i < OOPinfo.length; i++) {
			minCatchCt = Math.min(minCatchCt, playerGameInfo[OOPinfo[i].player].catchCt);
		}
		//for each player tied with the minimum, add them to the array for consideration as catcher.
		let catcherCandidates = [];
		for (let i = 0; i < OOPinfo.length; i++) {
			if (playerGameInfo[OOPinfo[i].player].catchCt === minCatchCt) {
				catcherCandidates.push(OOPinfo[i].player);
			}
		}
		//assign a random player tied for fewest (OOP) catching assignments so far.
		let assignedToCatcher = catcherCandidates[getRandomIntInclusive(0, catcherCandidates.length - 1)];
		inningAssignments[inning]["C"] = assignedToCatcher;
		//update playerGameInfo (catch count)
		//find the player by name
		for (let i = 0; i < OOPinfo.length; i++) {
			if (OOPinfo[i].player === assignedToCatcher) {
				playerGameInfo[OOPinfo[i].player].catchCt = playerGameInfo[OOPinfo[i].player].catchCt + 1;
			}
		}
		//assign the others to sit
		inningAssignments[inning]["sit"] = [];	//bleh, this need to be an array, b/c it can have multiples. it's OK. later when printing the lineup it'll be a bit more complicated to code.
		for (let i = 0; i < OOPinfo.length; i++) {
			if (OOPinfo[i].player != assignedToCatcher) {
				//update inningAssignment
				inningAssignments[inning]["sit"].push(OOPinfo[i].player);
				//update playerGameInfo (sit count)
				playerGameInfo[OOPinfo[i].player].sitCt = playerGameInfo[OOPinfo[i].player].sitCt + 1;
			}
		}
	}
	if (verbose || verboseoop || verbosefill) {
		console.log("Inning Assignments for inning#" + inning + "\n" + JSON.stringify(inningAssignments[inning]));
	}
};

//fillPositions(1);

let generateOnePlayerPosComb = function (openFieldPositionsInfo, availableUtil) {
	//generate one combination:
	let fillPlayerPosCombo = {};
	let playerPool = availableUtil.slice(0);	//clone of the array (vs a pointer.)
	//for first position, assign someone at random from utility pool. remove them from utility pool, assign next position at random. repeat.
	for (let i = 0; i < openFieldPositionsInfo.length; i++) {
		let playerIndex = getRandomIntInclusive(0, playerPool.length - 1);
		fillPlayerPosCombo[openFieldPositionsInfo[i].position] = playerPool[playerIndex];

		playerPool.splice(playerIndex, 1);

	}
	return fillPlayerPosCombo;
}

let generatePlayerPosCombos = function (openFieldPositionsInfo, availableUtil) {
	let combos = [];
	for (let n = 0; n < 10; n++) {
		combos.push(generateOnePlayerPosComb(openFieldPositionsInfo, availableUtil));
	}
	return combos;
};

let makeNoisySkill = function (skill, rounds, scale) {
	//skill = estimated player skill from playerSkill
	//rounds = # of rounds of randomness added
	//scale = how much 'skill' is added on winning roles
	noisySkill = skill;	//start as skill
	//generate noise N times
	for (let n = 0; n < rounds; n++) {
		noisySkill = noisySkill + getRandomIntInclusive(0, 1) * scale;
	}
	return noisySkill;
};

/* ------ fill positions, and determine bench/catch ----END--*/

/* ----------------  Determine Utility and Catcher Assignment by Inning (and all other assignments too, of course) ----END----------------------*/

/* ----------------  Generate All Innings ----START----------------------*/
//now that I should have all the basic functions to setup an inning (and have even done it for the 1st inning), create a function to generate additional innings using existing code. hopefully mostly/all function calls.
//(consider doing inning 1 this way too)
let doInning = function (inning) {

	let pickWorked = PickAllOOP(inning);

	openFieldPositionsInfo = []; //reset openFieldPositionInfo
	fillPositions(inning);
	if (pickWorked) {
		return true;
	} else {

		return false;
	}

};

//do each inning
//notes, loop starts at 1, and is <= numInnings (both are atypical convention. doing it to match inning #s)
//loop starts at 2 for the moment as inning 1 is not done using the function at present
// for (let i=1; i <= numInnings;i++) {
let doWeek = function (s, e) {	//start inning, end inning
	let start = s || 1;
	let end = e || numInnings;
	for (let i = start; i <= end; i++) {
		let inningWorked = doInning(i);
		if (inningWorked === false) {
			return false;
		}
	}

	//may wrap this in some conditions, and reattempt the whole week if fails equity...with counter to prevent endless recursion, etc. etc.
	//for now it just logs results.
	OOPCounts = {};
	OOPCountDetail = {};
	OOPEquityCheck();
	if (verbose || verboseoop) {
		console.log("End-game OOP Equity Check:\n" + JSON.stringify(OOPCountDetail));
	}

};

let doAndCheckWeek = function (s, e) {
	resetPlayerGameInfo();
	resetInningAssignments();
	let weekWorked = doWeek(s, e);
	if (weekWorked === false) {
		console.log("!! had to reset the whole game and try (randomized) OOP again!!")
		resetPlayerGameInfo();
		resetInningAssignments();
		doWeek(s, e);
	}
	return inningAssignments;
};

//doAndCheckWeek(1,14);


/* ----------------  Generate All Innings ----END----------------------*/

/* ----------------  Generate Multiple Alternative Assignments for a given game/week ----START----------------------*/

//score a game's position-skill
let scoreGame = function (inningAssignments) {
	let gameScore = {};
	gameScore.skill = 0;
	gameScore.inningAssignments = inningAssignments.splice(0); //clone it, so they stay separate
	//go through each inning
	for (let i = 1; i <= gameScore.inningAssignments.length; i++) {
		//go through each position
		for (var position in gameScore.inningAssignments[i]) {
			if (gameScore.inningAssignments[i].hasOwnProperty(position)) {
				if (position != 'sit') {
					let weight = positionImportance[position];
					let estimatedSkill = playerSkill[gameScore.inningAssignments[i][position]][position];	//// playerSKill[player][position]
					gameScore.skill = gameScore.skill + estimatedSkill * weight;
				}
			}
		}
	}
	return gameScore;
};

//let gameScore = scoreGame(doAndCheckWeek(1,numInnings));


//make 3 games (or more!)

let genMultipleSolutions = function (games) {
	let solutions = [];
	games = games || 3;
	for (let i = 0; i < games; i++) {
		let solution = scoreGame(doAndCheckWeek(1, numInnings));
		solutions.push(solution);
	}
	return solutions;
};

let solutions = genMultipleSolutions(iterationsToRun);	// [{score:123, inningAssignments:[]}, ...]



//check solutions. (Finding many with missing sit assignments. let's omit them.)

//calculate expected # of sits based on # of players.
let expectedSits = numSitters; //battingOrder.length-10;


for (let i = 0; i < solutions.length; i++) {
	solutions[i].rejected = false;
	//start at inning 1
	for (let j = 1; j < solutions[i].inningAssignments.length; j++) {
		if (solutions[i].inningAssignments[j].sit.length != expectedSits) {
			solutions[i].rejected = true;
		}
	}
}

//further check solutions. (each position assigned each inning.)
//each solution (game)
for (let i = 0; i < solutions.length; i++) {
	let gamePassed = true; //initialize the value to true; if any inning is rejected it will flip to false.

	//each inning
	for (let j = 1; j < solutions[i].inningAssignments.length; j++) {
		let inningPassed = false; //start each inning as not (yet) validated
		let onFieldPositionsCheck = {
			"P": { assigned: false }
			, "C": { assigned: false }
			, "1B": { assigned: false }
			, "2B": { assigned: false }
			, "3B": { assigned: false }
			, "SS": { assigned: false }
			, "LF": { assigned: false }
			, "LCF": { assigned: false }
			, "RCF": { assigned: false }
			, "RF": { assigned: false }
		};	//start each inning with each position not yet validated
		//each position each inning. mark onFieldPositionCheck completed as i come across a player assigned to that position
		for (var position in solutions[i].inningAssignments[j]) {
			if (solutions[i].inningAssignments[j].hasOwnProperty(position)) {
				if (position != "sit") {
					if (solutions[i].inningAssignments[j][position].length > 1) { //if a player (valid string) is assigned to this position,
						onFieldPositionsCheck[position].assigned = true; //mark the onFieldPositionCheck as true for that position.
					}
				}
			}
		}


		//now check each position this inning. are all positions assigned?
		let allPositionsPassed = true; //start as true, b/c i'm going to AND it with each inning
		for (var position in onFieldPositionsCheck) {
			if (onFieldPositionsCheck.hasOwnProperty(position)) {
				allPositionsPassed = allPositionsPassed && onFieldPositionsCheck[position]; //if any position wasn't assigned this will resolve as false
			}
		}
		if (allPositionsPassed === false) {
			inningPassed = false; //if any positions weren't assigned, mark the inning and game as failed
			gamePassed = false;
		} else {
			inningPassed = true;
		}
	}

	//if the game is marked as rejected then add this solution to the rejected games list 
	if (gamePassed === false) {
		solutions[i].rejected = true;
		console.log(i + " rejected. missing some positions.");
	}
}




//keep only solutions not rejected
let approvedSolutions = [];
for (let i = 0; i < solutions.length; i++) {
	if (solutions[i].rejected === false) {
		approvedSolutions.push(solutions[i]);
	}
}



//sort them best to worst
let sortedSolutionsIndices = Object.keys(approvedSolutions).sort(function (a, b) { return approvedSolutions[b].skill - approvedSolutions[a].skill });

console.log("solutions run: " + solutions.length + "." + approvedSolutions.length + "solutions passed QA.");

let top3 = [];
top3[0] = approvedSolutions[sortedSolutionsIndices[0]].inningAssignments;
top3[1] = approvedSolutions[sortedSolutionsIndices[1]].inningAssignments;
top3[2] = approvedSolutions[sortedSolutionsIndices[2]].inningAssignments;


/* ----------------  Generate Multiple Alternative Assignments for a given game/week ----END----------------------*/


/* ----------------  Print Outputs ----START----------------------*/

//Front-End Dev note: feel free to go to town here, obviously.

//let's make a data structure for easier printing. One like example #1 above. Namely, a JSON object, with one array PER PLAYER. With elements per inning. element is their position that turn.
const MakeBatterInfoByInning = function (inn, bo) {	// inn=inningAssignments  [{},{}]   ,   bo = battingOrder [], //uses global variable playerRoles as input, too
	let bi = [];
	for (let i = 0; i < battingOrder.length; i++) {
		let thisBatter = {};
		//name
		thisBatter.name = battingOrder[i];
		//role
		for (var player in playerRoles) {
			if (playerRoles.hasOwnProperty(player)) {
				if (battingOrder[i] === player) {
					thisBatter.role = playerRoles[player];
				}
			}
		}
		//get positions by inning for this batter
		//starts at a=1 b/c 0 is empty and index 1 is the first inning
		for (let a = 1; a < inn.length; a++) {
			//handle DH
			if (thisBatter.role === "DH") {
				thisBatter[a] = "sit";
			}
			//hanlde everything else!
			for (var position in inn[a]) {
				if (inn[a].hasOwnProperty(position)) {
					//find this batter
					if (inn[a][position] === bo[i]) {
						thisBatter[a] = position; // this inning (Chalmers: {1:C} )

					}
					//handle sit instead of pos:name, the format is sit:[name,name,name]
					if (position === "sit") {
						for (let ii = 0; ii < inn[a]["sit"].length; ii++) {
							if (inn[a]["sit"][ii] === bo[i]) {
								thisBatter[a] = "sit";

							}
						}
					}
				}
			}
		}
		bi.push(thisBatter);
	}


	return bi;
};

//let batterInfoByInning= MakeBatterInfoByInning(top3[0],battingOrder); //top3[0]   || inningAssignments
//Front-End-Dev Note: "batterInfoByInning" variable is probably what you want to build your outputs/visualizations from.
//I've got two examples below that I used for my own testing...but they are dumb. (Fixed width text printing...not a table, and certainly not anything fancier.)




//printDivHTML("basictext",variableWithHTMLcontent)
const printDivHTML = function (divid, content) {
	document.getElementById(divid).innerHTML += content;
};

//-----------Sparse Table Output -------- START
const PrintSparseTable = function (batterInfo, formattingOptions) {
	let formats = formattingOptions || { namerolewidth: 10, poswidth: 5, endchar: "|" };	//currently requires poswidth=5, that element is not really variable.
	let sparseTableHTML = "<table>";	//(pre tag makes this-preformatted text, and fixed width as needed here)
	let games = 2; // Double-header = 2, etc. Matters only for output format
	let inningsPerGame = 7; // Matters only for output format

	//-------------column headers -----------    

	for (let game = 1; game <= games; game++) { // Generate a separate table for each game in the evening
		sparseTableHTML = sparseTableHTML + "<tr><th colspan=2>GAME " + game + "</th><th colspan=7>INNING</th></tr>"; // Extra header row to show game #
		sparseTableHTML = sparseTableHTML + "<tr>"; //start header row
		sparseTableHTML = sparseTableHTML + "<th>ORDER</th>";
		sparseTableHTML = sparseTableHTML + "<th>NAME</th>";
		//sparseTableHTML = sparseTableHTML+"<style display: font-family: monospace; width: 8em;>"; //start styling for inning column widths
		//loop through other innings (starting at 2)
		for (let a = ((game - 1) * inningsPerGame) + 1; a <= inningsPerGame * game; a++) {
			sparseTableHTML = sparseTableHTML + "<th>" + (a - ((game - 1) * inningsPerGame)) + "</th>"; // Display inning # as 1 through inningsPerGame regardless of game
		}
		sparseTableHTML = sparseTableHTML + "</tr>"; //end header row


		//column widths:
		//"<style>display: font-family: monospace; width: 8em;</style>"

		//-------------data------------
		for (let i = 0; i < batterInfo.length; i++) {
			//---lineup Order---
			let lineupOrder = i + 1;
			sparseTableHTML = sparseTableHTML + "<tr><td>" + lineupOrder + "</td>";	//new row, then lineup order #

			//---Name and Role---
			sparseTableHTML = sparseTableHTML + "<td>" + batterInfo[i].name + ", " + batterInfo[i].role + "</td>"; //name and role

			//---Positions by Inning---
			//loop through innings
			for (var inning in batterInfo[i]) {
				if (batterInfo[i].hasOwnProperty(inning)) {
					//let's just guarantee this is going in order of innings. 1 to 14 (not 0 to < 14)
					for (let a = ((game - 1) * inningsPerGame) + 1; a <= inningsPerGame * game; a++) {
						if ([inning] == a) {
							let position = batterInfo[i][inning];
							//For "Sparse" Versions, check role. and alter "position" variable to blank if the position matches the role.
							if (batterInfo[i].role === batterInfo[i][inning]) {
								position = "";
							}


							//print out the posstring!
							sparseTableHTML = sparseTableHTML + "<td>" + position + "</td>"; //position
						}
					}
				}
			}
			//end row
			sparseTableHTML = sparseTableHTML + "</tr>";

		}
	}
	

		//done


		return sparseTableHTML + "</table>";
	
};

//let sparseTable = PrintSparseTable(batterInfoByInning);
//printDivHTML("sparsetable1",sparseTable);
//-----------Sparse Table Output -------- END


let batterInfos = [];
batterInfos[0] = MakeBatterInfoByInning(top3[0], battingOrder);
batterInfos[1] = MakeBatterInfoByInning(top3[1], battingOrder);
batterInfos[2] = MakeBatterInfoByInning(top3[2], battingOrder);

let sparseTable1 = PrintSparseTable(batterInfos[0]);
printDivHTML("result1score", "Sparse Table - Result 1. SkillScore: " + approvedSolutions[sortedSolutionsIndices[0]].skill + "<br>");
printDivHTML("sparsetable1", sparseTable1);
let sparseTable2 = PrintSparseTable(batterInfos[1]);
printDivHTML("result2score", "Sparse Table - Result 2. SkillScore: " + approvedSolutions[sortedSolutionsIndices[1]].skill + "<br>");
printDivHTML("sparsetable2", sparseTable2);
let sparseTable3 = PrintSparseTable(batterInfos[2]);
printDivHTML("result3score", "Sparse Table - Result 3. SkillScore: " + approvedSolutions[sortedSolutionsIndices[2]].skill + "<br>");
printDivHTML("sparsetable3", sparseTable3);

let optmessage = "Ran " + iterationsToRun + " iterations. Top 3 solutions printed below.";
printDivHTML("optimizationinfo", optmessage);


/* ----------------  Print Outputs ----END----------------------*/



//};