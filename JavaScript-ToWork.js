//Author HS:3 arrays to create maintain the undo-redo fucntionality
let stuff = []; //Author HS: array to store values entered in the textbox
let undoStack = []; //Author HS: array (of arrays) to be used while undo event occurs,
let redoStack = []; //Author HS: array (of arrays) to be used while redo event occurs

function buildItemList() {
    //Author HS: on click of the "add" button a check for the previous UL element is made and deleted if already existing
    //Author HS: after deletion, a new UL is created and each new line item (ToWork item) is created as LI element
    //Author HS: and added to the newly created UL element
    let prevUl = document.getElementById("toWorkItems");
    if (prevUl !== null) {
        prevUl.remove();
    }
    //Author HS: variable for main div container
    let divCont = document.getElementById("containerToWork");
    let ulCont = document.createElement("ul"); //Author HS: create a new UL element
    ulCont.id = "toWorkItems";

    //Author HS: loop to create the HTML page depending on the number of items added in the stuff array
    for (let i = 0; i < stuff.length; i++) {
        //Author HS: create new LI element for each new ToWork item
        let toWorkItem = document.createElement("li");
        toWorkItem.className = "liToWorkItem";
        toWorkItem.id = i;

        //Author HS: create a checkbox with the event listener to check for a check/uncheck change after it is created
        let toWorkCheck = document.createElement("input");
        toWorkCheck.className = "checkbox";
        toWorkCheck.type = "checkbox";
        toWorkCheck.id = i;
        toWorkCheck.addEventListener('change', e => {
            //Author HS: identify the current checkbox that is checked/unchecked
            e = e || window.event;
            let targetCheck = e.targetCheck || e.srcElement;
            if (targetCheck.checked) {
                strikePara(parseInt(targetCheck.id)); //Author HS: call the method to strike the P element for each LI element
            }
        }, false);
        //Author HS: create a P element to use as a holder to display value entered in the textbox
        let paraItem = document.createElement("p");
        paraItem.id = i;
        paraItem.innerText = stuff[i].content;
        //Author HS: check for isComplete status and design it accordingly,
        //Author HS: meaning strikethrough if the isComplete is true else do nothing
        if (stuff[i].isComplete === true) {
            toWorkCheck.checked = stuff[i].isComplete;
            paraItem.style = "text-decoration: line-through";
        } else {
            toWorkCheck.checked = stuff[i].isComplete;
            toWorkCheck.style.removeProperty("text-decoration");
        }

        //Author HS: create a remove button for each input element
        let toWorkRemove = document.createElement("input");
        toWorkRemove.type = "button";
        toWorkRemove.id = i;
       // toWorkRemove.value = "Remove Item";
        toWorkRemove.addEventListener('click', e => {
            //Author HS: check for the remove button that is called
            e = e || window.event;
            let target = e.target || e.srcElement;
            removeItemFromList(parseInt(target.id))
        }, false);
        //Author HS: append child to LI elements
        toWorkItem.appendChild(toWorkCheck);
        toWorkItem.appendChild(paraItem);
        toWorkItem.appendChild(toWorkRemove);
        //Author HS: append toWork LI element to main UL element
        ulCont.appendChild(toWorkItem);
    }
    //Author HS: append UL to the div container
    divCont.appendChild(ulCont);
}
//Author HS: this method is invoked on every Click event of the "add ToWork Item" button
function addItemToList() {
    //Author HS: the content/value entered in the array is added to the stuff key/value array with a value of false for isComplete
    stuff.push({ content: document.getElementById("enterNewToWork").value, isComplete: false });
    redoStack = []; //Author HS: set the redoStack to null
    undoStack.push(stuff.slice()); //Author HS: create a copy of stuff array and push it in the undoStack
    document.getElementById("enterNewToWork").value =""; //Author SJ: setting the textbox to empty after getting the item
    buildItemList(); //Author HS: call this method to create elements on the HTML page
}

function removeItemFromList(i) {
    //Author HS: remove the selected item form the stuff array
    stuff.splice(i, 1);
    redoStack = []; //Author HS: set the redoStack to null
    undoStack.push(stuff.slice()); //Author HS: create a copy of stuff array and push it in the undoStack
    buildItemList(); //Author HS: call this method to update the elements on the HTML page
}
function strikePara(i) {
    //Author SJ: Strike item if checked
    undoStack.push(JSON.parse(JSON.stringify(stuff))); //Author SJ: push stuff array to undo array
    stuff[i].isComplete = true;//Author SJ: strike the checked item
    buildItemList();//Author SJ: call this method to update the elements on the HTML page
}


function KeyDown(e) {
    //Author SJ: Redo action on CTRL + Y
    if (e.ctrlKey && e.keyCode == 89) { 
        if (redoStack.length > 0) {
            stuff = redoStack.pop(); //Author SJ: deleting the topmost index value of redostack array and placing the remaing stack inside stuff array
            undoStack.push(stuff.slice()); //Author SJ: copying stuff array to undoStack array
            buildItemList(); //Author SJ: call this method to update the elements on the HTML page
        }
    }
    //Author SJ: Undo action on CTRL + Z
    if (e.ctrlKey && e.keyCode == 90) {
        redoStack.push(stuff.slice()); //Author SJ: copying stuff array to redoStack array
        stuff = undoStack.pop();//Author SJ: deleting the topmost index value of undostack array and placing the remaing stack inside stuff array
        if (stuff === undefined) stuff = [];// Author SJ: checking if stuff array is empty and if yes making stuff an empty array
        buildItemList(); //Author SJ: call this method to update the elements on the HTML page
    }
}

document.onkeydown = KeyDown;  