//Getting items from localStorage and storing them into list array
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

//Going back to the Lists Menu
function goBack() {
    window.location.href = `lists.html`;
}

//Delete current List
function deleteList() {
    parentLists.splice(listId, 1);
    localStorage.setItem('lists', JSON.stringify(parentLists));
    goBack();
}

//Adding Section
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

    closeAddListMenu('.addSectionMenu', 'sectionNameInput')
    renderSections();
}

//Delete Section
function deleteSection(sectionIndex) {
    sections.splice(sectionIndex, 1);
    localStorage.setItem('lists', JSON.stringify(parentLists));
    renderSections();
}

//Expanding Section to show Notes
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

//Rendering the Sections function
function renderSections() {
    const sectionContainer = document.querySelector('.section');
    sectionContainer.querySelectorAll('.sectionElement').forEach(el => el.remove());

    //Add Section Button
    const sectionButton = createElement({
        baseClass: 'sectionElement',
        extraClass: 'mainTheme mouseHover',
        innerHTML: '<h2>+ Add New Section</h2>',
        onClick: function(){openAddListMenu('.addSectionMenu')},
        cursor: 'pointer'
    });
    sectionContainer.appendChild(sectionButton);

    //Creating Sections
    const sectionsAmount = sections.length-1;
    sections.forEach((section, i) => {
        const currentSection = sections[sectionsAmount-i];
        const sectionClass = `section${i}`;
        const sectionElement = createElement({
            baseClass: 'sectionElement',
            extraClass: `mainTheme ${sectionClass}`,
            innerHTML: `<section class='sectionName'><span class='expandSign mouseHover'>></span><h2>${currentSection.sectionName}</h2></section>`
        });
        let expandSign = sectionElement.querySelector('.expandSign');
        expandSign.addEventListener('click', function(){expandSection(sectionsAmount-i, currentSection, sectionClass)});
        sectionContainer.appendChild(sectionElement);
    });
}

//Event listener for going back to main page
const goBackNav = document.getElementById("goBack");
goBackNav.addEventListener('click', goBack);

//Calling the renderSections() function at page load
document.addEventListener('DOMContentLoaded', renderSections);

//Event listener for deleting current list
const deleteListNav = document.getElementById("deleteList");
deleteListNav.addEventListener('click', deleteList);

//Event listener for adding a section
const sectionAdd = document.getElementById("sectionAdd");
sectionAdd.addEventListener('click', addSection);

//Event listener for canceling section menu
const sectionMenuCancel = document.getElementById("sectionMenuCancel");
sectionMenuCancel.addEventListener('click', function(){closeAddListMenu('.addSectionMenu', 'sectionNameInput')});