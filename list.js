//Taking items from localStorage and store them into list array
const urlParams = new URLSearchParams(window.location.search);
const listId = Number(urlParams.get('id'));
const parentLists = JSON.parse(localStorage.getItem('lists')) || [];
const currentList = parentLists[listId];
const title = document.getElementById('listTitle');
const sections = currentList.sections || [];
let activeSectionIndex = null;
let activeSection = null;

//Changing the title to List Name
if(currentList) title.textContent = currentList.name;
else title.textContent = "List Not Found";

//Go back to the Lists Menu function
function goBack() {
    window.location.href = `listsMenu.html`;
}

//Deletin current List function
function deleteList() {
    parentLists.splice(listId, 1);
    localStorage.setItem('lists', JSON.stringify(parentLists));
    goBack();
}

//Rendering the Sections function
function renderSections() {
    const sectionContainer = document.querySelector('.section');
    sectionContainer.querySelectorAll('.sectionElement').forEach(el => el.remove());

    const addSectionButton = document.createElement('div');
    addSectionButton.className = 'sectionElement mainTheme';
    addSectionButton.innerHTML = `<h2>+ Add New Section</h2>`;
    addSectionButton.style.cursor = 'pointer';
    addSectionButton.onclick = function() {
        menuOptions('.addSectionMenu','hidden',0,'flex');
    };
    sectionContainer.appendChild(addSectionButton);

    const sectionsAmount = sections.length-1;
    sections.forEach((section, i) => {
        const currentSection = sections[sectionsAmount-i];
        const sectionElement = document.createElement('div');
        const sectionClass = `section${i}`;
        sectionElement.className = `sectionElement mainTheme ${sectionClass}`;
        sectionElement.innerHTML = `<div class='sectionName'><span class='expandSign'>></span><h2> ${currentSection.sectionName}</h2></div>`;
        expandSign = sectionElement.querySelector('.expandSign');
        expandSign.onclick = function() {
           expandSection(sectionsAmount-i, currentSection, sectionClass);
       };
        sectionContainer.appendChild(sectionElement);
    });
}

//Calling the renderSections() function at page load
document.addEventListener('DOMContentLoaded', renderSections);

//Adding the section function
function addSection() {
    let name = document.getElementById('sectionNameInput').value;
    if (!name) {
        alert('Please enter a section name.');
        return;
    }
    
    sections.push({ sectionName: name, items: []});
    parentLists[listId] = currentList;
    localStorage.setItem('lists', JSON.stringify(parentLists));

    document.getElementById('sectionNameInput').value = "";

    menuOptions('.addSectionMenu','auto',-10,'none');

    renderSections();
}

//Expanding Section to show Notes function
function expandSection(sectionIndex, currentSection, sectionClass) {
    const sectionContainer = document.querySelector(`.${sectionClass}`);
    const expandSign = sectionContainer.querySelector('.expandSign');
    if (currentSection.expanded) {
        currentSection.expanded = false;
        expandSign.textContent = '>';
        sectionContainer.querySelectorAll('.noteElement').forEach(el => el.remove());
    } else {
        currentSection.expanded = true;
        expandSign.textContent = 'v';
        renderNotes(sectionContainer, sectionIndex, currentSection);
    }
}

//Rendering Notes inside Section function
function renderNotes(sectionContainer, sectionIndex, currentSection) {
    sectionContainer.querySelectorAll('.noteElement').forEach(el => el.remove());

    // Add Note button
    const addNoteButton = document.createElement('div');
    addNoteButton.className = 'noteElement addNote';
    addNoteButton.innerHTML = `<h3>+ Add New Note</h3>`;
    addNoteButton.onclick = function() {
        openNoteMenu(sectionIndex);
    };
    sectionContainer.appendChild(addNoteButton);

    // Delete Section button
    const deleteSectionButton = document.createElement('div');
    deleteSectionButton.className = 'noteElement deleteSection';
    deleteSectionButton.innerHTML = `<h3>- Delete Section</h3>`;
    deleteSectionButton.onclick = function() {
        deleteSection(sectionIndex);
    };
    sectionContainer.appendChild(deleteSectionButton);

    // Notes Container
    const notesContainer = document.createElement('div');
    notesContainer.className = 'noteElement notesContainer';
    sectionContainer.appendChild(notesContainer);

    // Render notes
    currentSection.items.forEach((noteObj, i) => {
        const noteElement = document.createElement('div');
        noteElement.className = `noteElement mainTheme`;
        noteElement.innerHTML = `<h3>- ${noteObj.name}</h3>`;
        notesContainer.appendChild(noteElement);
    });
}


//Opening the note menu
function openNoteMenu(sectionIndex) {
    activeSectionIndex = sectionIndex;
    activeSection = sections[sectionIndex];
    menuOptions('.addNoteMenu', 'hidden', 0, 'flex');
}


//Deletin Section function
function deleteSection(sectionIndex) {
    sections.splice(sectionIndex, 1);
    localStorage.setItem('lists', JSON.stringify(parentLists));
    renderSections();
}

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
    menuOptions('.addNoteMenu', 'auto', -10, 'none');

    const sectionClass = `section${(sections.length - 1 - activeSectionIndex)}`;
    const sectionContainer = document.querySelector(`.${sectionClass}`);
    renderNotes(sectionContainer, activeSectionIndex, sections[activeSectionIndex]);
}
