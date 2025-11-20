//Opening the note menu
function openNoteMenu(sectionIndex) {
    activeSectionIndex = sectionIndex;
    activeSection = sections[sectionIndex];
    openAddListMenu('.addNoteMenu');
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

//Rendering Notes inside Section function
function renderNotes(sectionContainer, sectionIndex, currentSection) {
    sectionContainer.querySelectorAll('.noteElement').forEach(el => el.remove());

    //Add Note button
    const noteButton = createElement({
        baseClass: 'noteElement',
        extraClass: 'addNote',
        innerHTML: '<h3>+ Add New Note</h3>',
        onClick: function(){openNoteMenu(sectionIndex)}
    });
    sectionContainer.appendChild(noteButton);

    //Delete Section button
    const deleteButton = createElement({
        baseClass: 'noteElement',
        extraClass: 'deleteSection',
        innerHTML: '<h3>- Delete Section</h3>',
        onClick: function(){deleteSection(sectionIndex)}
    });
    sectionContainer.appendChild(deleteButton);

    //Notes Container
    const notesContainer = createElement({
        baseClass: 'noteElement',
        nextClass: 'notesContainer'
    });
    sectionContainer.appendChild(notesContainer);

    //Render notes
    currentSection.items.forEach((noteObj, i) => {
        const noteElement = createElement({
            baseClass: 'noteElement',
            nextClass: 'mainTheme',
            innerHTML: `<h3>- ${noteObj.name}</h3>`
        });
        notesContainer.appendChild(noteElement);
    });
}

//Event listener for canceling note menu
const noteMenuCancel = document.getElementById('noteMenuCancel');
noteMenuCancel.addEventListener('click', function(){closeAddListMenu('.addNoteMenu', 'noteContentArea')});

//Adding note
const noteAdd = document.getElementById("noteAdd");
noteAdd.addEventListener('click', addNote)