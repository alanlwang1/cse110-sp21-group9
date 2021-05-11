//import "./DOMPurify/dist/purify.min.js";

import * as crud from "./crudFunctions.js"

/* get elements from html page */
//buttons and general writing space
let formButton = document.getElementById('addBulletBut');
let bujoSpace  = document.getElementById('bujoSpace');
let saveBtn    = document.getElementById('saveAdd');

//creation inputs
let titleInput = document.getElementById('title');
let typeInput  = document.getElementById('type');
let dateInput  = document.getElementById('time');
let descInput  = document.querySelector("[name = 'desc']");

//output of creation
let output     = document.getElementById("output");

//deletion stuff
let confirmBox = document.getElementById('deleteBullet');
let confirmBtn = document.getElementById('okConfirm');

//edit inputs
let editBullet = document.getElementById('EditBullet');
let editSave   = document.getElementById('editSaveAdd');
let editTitle  = document.getElementById('edittitle');
let editDate   = document.getElementById('editdate');
let editDesc   = document.getElementById('editdesc');
/* not implemented currently
let editType   = document.getElementById('edittype');
let editTags   = document.getElementById('edittag');
*/

crud.initCrudRuntime();
let bulletsToLoad = crud.getBulletsByDateRange("2020-06-12T19:00", "2020-06-12T20:00");
for (const bullet of bulletsToLoad)
{
  output.append(createBulletEntryElem(bullet.ID));
}

/* on click set save button to true */
saveBtn.addEventListener('click', function (){
    saveBtn.value = "true";
});

/* on click show new blog box */
formButton.addEventListener('click', function () {
  bujoSpace.showModal();
});

/* on click set edit save to true */
editSave.addEventListener('click', function (){
    editSave.value = "true";
});

/* on click set confirm button to true */
confirmBtn.addEventListener('click', function (){
    confirmBtn.value = "true";
});

/* opens the delete dialog box */
function openDeleteDialog(elemEntry){
  confirmBox.onclose = () => {deleteBulletEntry(elemEntry);};
  confirmBox.showModal();
}

/* companion function to openDeleteDialog, removes the event listener and deletes the entry if ok was clicked */
function deleteBulletEntry(elemEntry)
{
  confirmBox.onclose = null;
  if (confirmBtn.value == "false") return;
  confirmBtn.value = false;
  crud.deleteBulletById(elemEntry.id);
  elemEntry.remove();
}

/* opens edit dialog box and saves eddits if esave is true */
function openEditDialog(elemEntry)
{
  let entryBullet = crud.getBulletById(elemEntry.id);

  editTitle.value = entryBullet.data.title;
  editDate.value  = entryBullet.date;
  editDesc.value  = entryBullet.data.note;

  editBullet.onclose = () => {editBulletEntry(elemEntry);};
  editBullet.showModal();
}

function editBulletEntry(elemEntry)
{
  if (editSave.value == "false") return;
  editSave.value = false;

  crud.setBulletAttributes(elemEntry.id, {
      title: editTitle.value, 
      note: editDesc.value
    }, null, editDate.value);

  elemEntry.parentNode.replaceChild(createBulletEntryElem(elemEntry.id), elemEntry);

  editBullet.onclose = null;
}

//helper function to add text to bullet entry
function appendTextNode(strTitle, strText, elemParent)
{
  let elemBold = document.createElement('b');

  elemBold.append(document.createTextNode(strTitle));
  elemParent.append(elemBold);
  elemParent.append(document.createTextNode(strText));
}

//helper function to add buttons to bullet entry
function appendButton(strDisp, strStyle, strClass, elemParent)
{
  let elemButton = document.createElement("BUTTON");
  let elemText = document.createTextNode(strDisp);

  elemButton.style = strStyle;
  elemButton.className = strClass;
  elemButton.appendChild(elemText);
  elemParent.append(elemButton);

  return elemButton;
}

/* create a bullet entry element */
function createBulletEntryElem(intBulletID){
  let newEntry = document.createElement('li');
  let div = document.createElement("div");
  let bullet = crud.getBulletById(intBulletID);

  newEntry.id = intBulletID;
  div.style = "margin: 10px; padding: 5px; border: 5px solid black"

  newEntry.append(div);

  //create and append title of bullet
  appendTextNode("Title: ", bullet.data.title, div);

  //create and append date and time bullet was created
  appendTextNode(" Date: ", bullet.date, div);

  //create and append description for bullet
  appendTextNode(" Note: ", bullet.data.note, div);

  //create and append bullet type
  appendTextNode(" Type: ", bullet.type, div);

  //create and append bullet's tags
  appendTextNode(" Tags: ", bullet.tags, div);

  //create and append edit button
  let editButton = appendButton("Edit", "", "edit", div);
  editButton.addEventListener("click", ()=>{openEditDialog(newEntry)});

  //create and append delete button
  let deleteButton = appendButton("Delete", "", "del", div);
  deleteButton.addEventListener("click", ()=>{openDeleteDialog(newEntry)});

  return newEntry;
}

/* if user confirms make new bullet and add it to page */
bujoSpace.addEventListener('close', function (){

  //make sure the user confirmed
  if(saveBtn.value=="false") return;
  saveBtn.value = false;

  //make a new bullet with the crud functions
  let newBulletID = crud.createBullet(
    {title: titleInput.value, note: descInput.value},
    "note",
    dateInput.value,
    []
  );

  //add the bullet to the DOM
  output.append(createBulletEntryElem(newBulletID));
});