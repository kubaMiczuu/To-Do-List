//Creating the lists array
let lists = JSON.parse(localStorage.getItem('lists') || '[]');

//List Class
class List {
    constructor(name) {
        this.name = name;
        this.sections = [];
        this.index = lists.length;
    }

    addSection(sectionName) {
        if(!sectionName) return;
        this.sections.push({
            name: sectionName,
            items: [],
            expanded: false
        });
    }

    addItem(sectionIndex, itemName) {
       if (sectionIndex === undefined || sectionIndex === null || !itemName) return;
        if (this.sections[sectionIndex]) {
            this.sections[sectionIndex].items.push({
                name: itemName,
                done: false
            });
        }
    }
}

//Converting lists array to List class object
lists = convertToListObjects(lists);

//Converting function from lists to List class
function convertToListObjects(storedLists) {
    return storedLists.map(listData => {
        const list = new List(listData.name);
        list.sections = listData.sections || [];
        list.index = listData.index;
        return list;
    });
}

//Function for saving lists into localStorage
function saveLists() {
    localStorage.setItem('lists', JSON.stringify(lists.map(l => ({
        name: l.name,
        sections: l.sections,
        index: l.index
    }))));
}

//Adding the list function
function addList() {
    let listName = document.getElementById('listNameInput').value;
    if (!listName) {
        alert('Please enter a list name.');
        return;
    }
    const newList = new List(listName);
    lists.push(newList);
    saveLists();

    document.getElementById('listNameInput').value = "";

    closeAddMenu('.addListMenu', 'listNameInput');
    renderLists();
}

//Rendering the Lists function
function renderLists() {
    const listsContainer = document.querySelector('.menu');
    listsContainer.querySelectorAll('.listElement').forEach(el => el.remove());

    //Creating Lists
    lists.forEach((list, i) => {
        const listElement = createSectionElement({
            baseClass: 'listElement',
            extraClass: 'mainTheme mouseHover',
            innerHTML:  `<h2>${list.name}</h2>`,
            onClick: function(){window.location.href = `sections&notes.html?id=${i}`},
        })
        listsContainer.appendChild(listElement);
    });

    //Add List Button
    const listButton = createSectionElement({
        baseClass: 'listElement mainTheme',
        extraClass: 'mainTheme mouseHover',
        innerHTML:  `<h2>+ Add New List</h2>`,
        onClick: function(){openAddMenu('.addListMenu')},
    })
    listsContainer.appendChild(listButton);
}

//Event listener for adding a list
const listAdd = document.getElementById("listMenuAdd");
listAdd.addEventListener('click', addList);

//Event listener for canceling the list add menu
const menuCancel = document.getElementById("listMenuCancel");
menuCancel.addEventListener('click', function(){closeAddMenu('.addListMenu', 'listNameInput')});

//Calling the renderLists() function at page load
document.addEventListener('DOMContentLoaded', renderLists);