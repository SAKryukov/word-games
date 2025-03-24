/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

function TableStringInput(optionSet) {	
	
	var defaultOptionSet = {
		behavior: {
			selectable: true,
			editable: true,
			shiftEditPosition: false,
			RTL: false
		}, //behavior
		colors: {
			activeCell: { foreground: "yellow", background: "navy"},
			inactiveCell: { foreground: "black", background: "silver"},
			unselectedCell: { foreground: "black", background: "white"}
		}, //colors
		styles: {
			cell: "border: solid thin black; font-family: monospace; font-size:120%; font-weight:bold; padding-left: 0.4em; padding-right: 0.4em", 
			table: "border-spacing: 0; padding: 0; outline-offset: -4px",
			superscript: "font-size:70%"
		} // styles
	};

	this.optionSet = 	optionSet;	
	if (!this.optionSet)
		this.optionSet = defaultOptionSet;
	else
		populateWithDefault(this.optionSet, defaultOptionSet);

	this.currentSelection = 0;
	this.currentValue = "";
	
	this.table = document.createElement("table");
	this.table.parentControl = this;
	this.table.style.cssText = this.optionSet.styles.table;
	this.row = document.createElement("tr");
	this.table.appendChild(this.row);
	if (this.optionSet.behavior.selectable)
		this.table.tabIndex = 0;
	this.row.parentControl = this;

	this.showSelection = function(doShow) {
		var active = this.hasFocus;
		var cell = this.row.childNodes[this.currentSelection];
		if (doShow) {
			if (active) {
				cell.style.color = this.optionSet.colors.activeCell.foreground;
				cell.style.backgroundColor = this.optionSet.colors.activeCell.background;
			} else {
				cell.style.color = this.optionSet.colors.inactiveCell.foreground;
				cell.style.backgroundColor = this.optionSet.colors.inactiveCell.background;
			} //if active
		}
		if (!doShow || !this.optionSet.behavior.selectable) {
			cell.style.color = this.optionSet.colors.unselectedCell.foreground;
			cell.style.backgroundColor = this.optionSet.colors.unselectedCell.background;
		} //if
	}; //this.showSelection
	this.moveSelection = function(value) {
		this.showSelection(false);
		this.currentSelection = value;
		this.showSelection(true);			
	} //this.moveSelection

	this.table.onblur = function() { this.hasFocus = false; this.parentControl.showSelection(true); };
	this.table.onfocus = function() {
		this.hasFocus = false;
		this.parentControl.showSelection(true);
	};

	this.table.onkeydown = function(ev) {
		if (!this.parentControl.optionSet.behavior.selectable) return true;
		if ((ev.keyCode==constants.left) && (this.parentControl.currentSelection > 0))
			this.parentControl.moveSelection(this.parentControl.currentSelection - 1);
		else if ((ev.keyCode==constants.right) && (this.parentControl.currentSelection < this.parentControl.row.childNodes.length - 1))
			this.parentControl.moveSelection(this.parentControl.currentSelection + 1);
		return true;
	}; //this.table.onkeydown
	this.table.onkeypress = function(ev) {
		if (!this.parentControl.optionSet.behavior.selectable) return true;
		if (!this.parentControl.optionSet.behavior.editable) return true;
		if (ev.charCode == 0) return true;
		if (ev.ctrlKey || ev.altKey || ev.metaKey) return true;
		var char = String.fromCharCode(ev.charCode).toUpperCase();
		var originalChar = char;
		if (char == " ") char = constants.nonBreakingSpace;
		var currentCell = this.parentControl.row.childNodes[this.parentControl.currentSelection];
		currentCell.innerHTML = char;
		if (this.parentControl.onEdited)
			this.parentControl.onEdited(this.parentControl.currentSelection, originalChar);
		if (this.parentControl.optionSet.behavior.shiftEditPosition)
			if (this.parentControl.optionSet.behavior.RTL)
				this.onkeydown({keyCode:constants.left});
			else
				this.onkeydown({keyCode:constants.right});
		return true;
	}; //this.table.onkeypress

} //TableStringInput

if (!TableStringInput.prototype.add)
	TableStringInput.prototype.add = function(element) { element.appendChild(this.table); };

if (!TableStringInput.prototype.showString) TableStringInput.prototype.showString = function(value, characterRepertoire) {
	var index = 0;
	var characterSet = value;
	if (characterRepertoire) {
		characterSet = [];
		var classificationGroups = [];
		classificationGroups[0] = characterRepertoire.vowels;
		classificationGroups[1] = characterRepertoire.consonants;
		classificationGroups[2] = characterRepertoire.diacritic;
		classificationGroups[3] = characterRepertoire.punctuation;
		classificationGroups[4] = characterRepertoire.blankSpace;
		var classificationResult = dictionary.classifyWord(value, classificationGroups);
		var classification = classificationResult.classification;
		if (classificationResult.unclassified && classificationResult.unclassified.length > 0) 
			throw "Word '{0}' contains characters outside of the dictionary character repertoire: '{1}'".format(value, classificationResult.unclassified);
		for (var groupIndex in classification) {
			var group = classification[groupIndex];
			for (var elementIndex in group) {
				var element = group[elementIndex];
				var character = element.character;
				if (character == " ")
					character = constants.nonBreakingSpace;
				else
					character = character.toUpperCase();				
				characterSet.push('{0}<sup style="{1}">{2}</sup>'.format(character, this.optionSet.styles.superscript, element.characterCount));
			} //loop elementIndex
		} //loop groupIndex
	} //if characterRepertoire
	this.row.innerHTML = "";
	for(var key in characterSet) {
		var cell = document.createElement("td");
		cell.index = index; ++index;	
		var char = characterSet[key];
		if (!characterRepertoire) {
			char = char.toUpperCase();
			if (char == " ")
				char = constants.nonBreakingSpace;
		} //if
		cell.style.cssText = this.optionSet.styles.cell;
		cell.style.color = this.optionSet.colors.unselectedCell.foreground;
		cell.style.backgroundColor = this.optionSet.colors.unselectedCell.background;
		cell.innerHTML = char;
		cell.parentControl = this;
		cell.onclick = function() {
			this.parentControl.table.focus();
			this.parentControl.moveSelection(this.index);
		}; //cell.onclick
		this.row.appendChild(cell);
	} //loop
	if (this.optionSet.behavior.RTL)
		this.currentSelection = value.length - 1;
	else
		this.currentSelection = 0;
	this.showSelection(true);
	this.currentValue = value;
}; //TableStringInput.prototype.showString

if (!TableStringInput.prototype.focus) TableStringInput.prototype.focus = function(value, characterRepertoire) {
	if (!this.optionSet.behavior.selectable) return;
	this.table.focus();
	this.showSelection(true);
} //TableStringInput.prototype.focus

if (!TableStringInput.prototype.value) {
	Object.defineProperty(TableStringInput.prototype, "value", {
		get: function() {
			return this.currentValue;
		}, //get isSelectable
		set: function(valueValue) {
			this.showString(valueValue);
		} //set isSelectable
	}); //Object.defineProperty
} //TableStringInput.prototype.value

if (!TableStringInput.prototype.isSelectable) {
	Object.defineProperty(TableStringInput.prototype, "isSelectable", {
		get: function() {
			return this.optionSet.behavior.selectable;
		}, //get isSelectable
		set: function(value) {
			if (this.optionSet.behavior.selectable === value) return;
			if (value)
				this.table.tabIndex = 0;
			else
				this.table.tabIndex = -1;
			this.optionSet.behavior.selectable = value;	
			this.showSelection(true);
		} //set isSelectable
	}); //Object.defineProperty
} //TableStringInput.prototype.isSelectable

if (!TableStringInput.prototype.colorSet) {
	Object.defineProperty(TableStringInput.prototype, "colorSet", {
		get: function() {
			return this.optionSet.colors;
		}, //get isSelectable
		set: function(value) {
			if (!value) return;
			for (var key in this.optionSet.colors)
				if (value[key]) {
					if (value[key].foreground)
						this.optionSet.colors[key].foreground = value[key].foreground;
					if (value[key].background)
						this.optionSet.colors[key].background = value[key].background;
				} //if
			for (var index = 0; index < this.row.childNodes.length; ++index) {
				var cell = this.row.childNodes[index];
				if (this.optionSet.behavior.selectable && index == this.currentSelection) continue;
				cell.style.color = this.optionSet.colors.unselectedCell.foreground;
				cell.style.backgroundColor = this.optionSet.colors.unselectedCell.background;
			} //loop
			this.showSelection(true);
		} //set isSelectable
	}); //Object.defineProperty
} //TableStringInput.prototype.value
