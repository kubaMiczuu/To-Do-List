//Opening the note menu
function openNoteMenu(sectionIndex) {
    activeSectionIndex = sectionIndex;
    activeSection = sections[sectionIndex];
    openAddListMenu('.addNoteMenu');
}
function editNoteMenu(noteIndex) {
    console.log("Editing note index: " + noteIndex);
 }

//Adding Note
function addNote() {
    let note = document.getElementById('noteContentArea').value;
    if (!note) {
        alert('Please write a note...');
        return;
    }

    sections[activeSectionIndex].items.push({ name: note, done: false });
    currentList.sections = sections;
    parentLists[listId] = currentList;
    localStorage.setItem('lists', JSON.stringify(parentLists));

    document.getElementById('noteContentArea').value = "";
    closeAddListMenu('.addNoteMenu', 'noteContentArea');

    const sectionClass = `section${(sections.length - 1 - activeSectionIndex)}`;
    const sectionContainer = document.querySelector(`.${sectionClass}`);
    renderNotes(sectionContainer, activeSectionIndex, sections[activeSectionIndex]);
}

//Deleting Note
function deleteNote(sectionIndex, noteIndex) {
    if (!sections || !sections[sectionIndex]) return;
    sections[sectionIndex].items.splice(noteIndex, 1);
    currentList.sections = sections;
    parentLists[listId] = currentList;
    localStorage.setItem('lists', JSON.stringify(parentLists));

    const sectionClass = `section${(sections.length - 1 - sectionIndex)}`;
    const sectionContainer = document.querySelector(`.${sectionClass}`);
    renderNotes(sectionContainer, sectionIndex, sections[sectionIndex]);
}
//Saving Edited Note
function saveNoteEdit() {

}

//Rendering Notes inside Section function
function renderNotes(sectionContainer, sectionIndex, currentSection) {
    sectionContainer.querySelectorAll('.noteElement').forEach(el => el.remove());

    //Add Note button
    const noteButton = createElement({
        baseClass: 'noteElement',
        extraClass: 'addNote mouseHover',
        innerHTML: '<h3>+ Add New Note</h3>',
        onClick: function(){openNoteMenu(sectionIndex)}
    });
    sectionContainer.appendChild(noteButton);

    //Delete Section button
    const deleteButton = createElement({
        baseClass: 'noteElement',
        extraClass: 'deleteSection mouseHover',
        innerHTML: '<h3>- Delete Section</h3>',
        onClick: function(){deleteSection(sectionIndex)}
    });
    sectionContainer.appendChild(deleteButton);

    //Notes Container
    const notesContainer = createElement({
        baseClass: 'noteElement',
        extraClass: 'notesContainer'
    });
    sectionContainer.appendChild(notesContainer);

    //Render notes
    currentSection.items.forEach((noteObj, i) => {
        const noteHr = document.createElement('hr');
        noteHr.classList.add('noteHr');
        notesContainer.appendChild(noteHr);

        //Note Row
        const noteRow = createElement({
            baseClass: 'noteRow'
        });

        //Note Text
        const noteText = createElement({
            baseClass: 'noteElement',
            extraClass: 'noteText',
            innerHTML: `<h3>- ${noteObj.name}</h3>`
        });
        noteRow.appendChild(noteText);

        //Note Delete
        const noteDelete = createElement({
            baseClass: 'noteElement',
            extraClass: 'noteDelete mouseHover',
            innerHTML: '<h3>- Delete</h3>',
            onClick: function(){ deleteNote(sectionIndex, i); }
        });
        noteRow.appendChild(noteDelete);

        //Note Edit
        const noteEdit = createElement({
            baseClass: 'noteElement',
            extraClass: 'noteEdit mouseHover',
            innerHTML: '<h3># Edit</h3>',
            onClick: function(){ editNoteMenu(i); }
        });
        noteRow.appendChild(noteEdit);

        notesContainer.appendChild(noteRow);
    });
}

//Event listener for canceling note menu
const noteMenuCancel = document.getElementById('noteMenuCancel');
noteMenuCancel.addEventListener('click', function(){closeAddListMenu('.addNoteMenu', 'noteContentArea')});

//Event listener for canceling edit note menu
const editNoteMenuCancel = document.getElementById('noteEditCancel');
editNoteMenuCancel.addEventListener('click', function(){closeAddListMenu('.noteEditMenu', 'noteContentArea')});

//Adding note
const noteAdd = document.getElementById("noteAdd");
noteAdd.addEventListener('click', addNote)

//Save editing note
const noteEditSave = document.getElementById("noteEdit");
noteEditSave.addEventListener('click', saveNoteEdit);