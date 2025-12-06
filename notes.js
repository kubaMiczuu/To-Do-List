activeNoteIndex = null;

//Opening the note menu
function openNoteMenu(sectionIndex) {
    activeSectionIndex = sectionIndex;
    openAddMenu('.addNoteMenu');
}

//Opening the edit note menu
function editNoteMenu(sectionIndex, noteIndex, text) {
    activeNoteIndex = noteIndex;
    activeSectionIndex = sectionIndex;
    const contentArea = document.getElementById('noteContentAreaEdit');
    contentArea.value = text.replace(/<br>/g, '\n');
    openAddMenu('.editNoteMenu');
}

//Adding Note
function addNote() {
    let note = document.getElementById('noteContentArea').value;
    if (!note) {
        alert('Please write a note...');
        return;
    }
    const formattedNote = note.replace(/\n/g, '<br>');

    sections[activeSectionIndex].items.push({ name: formattedNote, done: false });
    updateLocalStorage();

    document.getElementById('noteContentArea').value = "";
    closeAddMenu('.addNoteMenu', 'noteContentArea');

    const sectionClass = `section${(sections.length - 1 - activeSectionIndex)}`;
    const sectionContainer = document.querySelector(`.${sectionClass}`);
    renderNotes(sectionContainer, activeSectionIndex, sections[activeSectionIndex]);
}

//Deleting Note
function deleteNote(sectionIndex, noteIndex) {
    if (!sections || !sections[sectionIndex]) return;
    sections[sectionIndex].items.splice(noteIndex, 1);
    updateLocalStorage();

    const sectionClass = `section${(sections.length - 1 - sectionIndex)}`;
    const sectionContainer = document.querySelector(`.${sectionClass}`);
    renderNotes(sectionContainer, sectionIndex, sections[sectionIndex]);
}
//Saving Edited Note
function saveNoteEdit() {
    let editedNote = document.getElementById('noteContentAreaEdit').value;
    if (!editedNote) {
        alert('Please write a note...');
        return;
    }
    const formattedNote = editedNote.replace(/\n/g, '<br>');
    sections[activeSectionIndex].items[activeNoteIndex].name = formattedNote;
    closeAddMenu('.editNoteMenu', 'noteContentAreaEdit');
    updateLocalStorage();

    const sectionClass = `section${(sections.length - 1 - activeSectionIndex)}`;
    const sectionContainer = document.querySelector(`.${sectionClass}`);
    renderNotes(sectionContainer, activeSectionIndex, sections[activeSectionIndex]);
}

//Changing Note Status
function noteChangeStatus(sectionIndex, noteIndex) {
    let noteStatus = sections[sectionIndex].items[noteIndex].done;
    const noteClass = `.noteContent${noteIndex}`;
    const noteText = document.querySelector(noteClass);

    if (!noteStatus) change(true, 'line-through');
    else change(false, 'none');

    function change(status, decoration) {
        sections[sectionIndex].items[noteIndex].done = status;
        updateLocalStorage();
        noteText.style.textDecoration = decoration;
    }
}

//Rendering Notes inside Section function
function renderNotes(sectionContainer, sectionIndex, currentSection) {
    sectionContainer.querySelectorAll('.noteElement').forEach(el => el.remove());

    //Add Note button
    const noteButton = createSectionElement({
        baseClass: 'noteElement',
        extraClass: 'addNote mouseHover',
        innerHTML: '<h3>+ Add New Note</h3>',
        onClick: function(){openNoteMenu(sectionIndex)}
    });
    sectionContainer.appendChild(noteButton);

    //Delete Section button
    const deleteButton = createSectionElement({
        baseClass: 'noteElement',
        extraClass: 'deleteSection mouseHover',
        innerHTML: '<h3>- Delete Section</h3>',
        onClick: function(){deleteSection(sectionIndex)}
    });
    sectionContainer.appendChild(deleteButton);

    //Notes Container
    const notesContainer = createSectionElement({
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
        const noteRow = createSectionElement({
            baseClass: 'noteRow'
        });

        //Custom Note Checkbox
        const label = document.createElement('label');
        label.className = `customCheckbox checkbox${i}`;
        noteRow.appendChild(label);

        const noteCheckbox = document.createElement('input');
        noteCheckbox.type = 'checkbox';
        noteCheckbox.checked = noteObj.done;
        noteCheckbox.addEventListener('change', function(){noteChangeStatus(sectionIndex, i)});
        label.appendChild(noteCheckbox);

        const customCheckbox = document.createElement('span');
        customCheckbox.innerHTML = '✔';
        label.appendChild(customCheckbox);

        //Note Text
        const noteText = createSectionElement({
            baseClass: 'noteElement',
            extraClass: `noteText noteContent${i}`,
            innerHTML: `<span>${noteObj.name}</span>`
        });
        noteText.style.fontSize = '1.5em';
        if (noteObj.done) noteText.style.textDecoration = 'line-through';
        noteRow.appendChild(noteText);

        //Note Delete
        const noteDelete = createSectionElement({
            baseClass: 'noteElement',
            extraClass: 'noteDelete mouseHover',
            innerHTML: '<h3>- Delete</h3>',
            onClick: function(){ deleteNote(sectionIndex, i); }
        });
        noteRow.appendChild(noteDelete);

        //Note Edit
        const noteEdit = createSectionElement({
            baseClass: 'noteElement',
            extraClass: 'noteEdit mouseHover',
            innerHTML: '<h3># Edit</h3>',
            onClick: function(){ editNoteMenu(sectionIndex, i, noteObj.name); }
        });
        noteRow.appendChild(noteEdit);

        notesContainer.appendChild(noteRow);
    });
}

//Event listener for canceling note menu
const noteMenuCancel = document.getElementById('noteMenuCancel');
noteMenuCancel.addEventListener('click', function(){closeAddMenu('.addNoteMenu', 'noteContentArea')});

//Event listener for canceling edit note menu
const editNoteMenuCancel = document.getElementById('noteEditCancel');
editNoteMenuCancel.addEventListener('click', function(){closeAddMenu('.editNoteMenu', 'noteContentAreaEdit')});

//Adding note
const noteAdd = document.getElementById("noteAdd");
noteAdd.addEventListener('click', addNote)

//Save editing note
const noteEditSave = document.getElementById("noteEdit");
noteEditSave.addEventListener('click', saveNoteEdit);