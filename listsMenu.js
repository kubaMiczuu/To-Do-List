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
        this.sections.push({
            name: sectionName,
            items: [],
            expanded: false
        });
    }

    addItem(sectionIndex, itemName) {
        if (this.sections[sectionIndex]) {
            this.sections[sectionIndex].items.push({
                name: itemName,
                done: false
            });
        }
    }
}

//Converting lists array to List class object
lists = convertToListObjects(JSON.parse(localStorage.getItem('lists') || '[]'));

//Converting function from lists to List class
function convertToListObjects(storedLists) {
    return storedLists.map(listData => {
        const list = new List(listData.name);
        list.sections = listData.sections || [];
        list.index = listData.index;
        return list;
    });
}

//Rendering the Lists function
function renderLists() {
    const listsContainer = document.querySelector('.menu');
    listsContainer.querySelectorAll('.listElement').forEach(el => el.remove());

    lists.forEach((list, i) => {
        const listElement = document.createElement('div');
        listElement.className = 'listElement mainTheme';
        listElement.innerHTML = `<h2>${list.name}</h2>`;
        listElement.onclick = function() {
            window.location.href = `list.html?id=${i}`;
        };
        listsContainer.appendChild(listElement);
    });

    const addListButton = document.createElement('div');
    addListButton.className = 'listElement mainTheme';
    addListButton.innerHTML = `<h2>+ Add New List</h2>`;
    addListButton.onclick = function() {
        menuOptions('.addListMenu','hidden',0,'flex');
    };
    listsContainer.appendChild(addListButton);
}

//Calling the renderLists() function at page load
document.addEventListener('DOMContentLoaded', renderLists);

//Adding the list function
function addList() {
    let listName = document.getElementById('listNameInput').value;
    if (!listName) {
        alert('Please enter a list name.');
        return;
    }
    const newList = new List(listName);
    lists.push(newList);
    localStorage.setItem('lists', JSON.stringify(lists));

    document.getElementById('listNameInput').value = "";

    menuOptions('.addListMenu','auto',-10,'none');

    renderLists();
}