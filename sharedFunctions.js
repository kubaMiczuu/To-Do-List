//Opening or Closing the Menu function
function menuOptions({selector, overflow, zIndex, display}) {
    const body = document.body;
    const blur = document.querySelector('.wholePage');
    const menu = document.querySelector(selector);

    body.style.overflow = overflow;
    blur.style.zIndex = zIndex;
    menu.style.display = display;
}

//Function for opening the add list Menu
function openAddListMenu(selectorName) {
    menuOptions({selector:selectorName, overflow: 'hidden', zIndex: 0, display:'flex'});
}

//Function for closing the add list Menu
function closeAddListMenu(selectorName, erase) {
    menuOptions({selector:selectorName, overflow:'auto', zIndex: -10, display: 'none'});
    document.getElementById(erase).value = "";
}

function createElement({baseClass, extraClass = '', innerHTML = '', onClick = null, cursor = null}) {
    const element = document.createElement('section');
    element.className = `${baseClass} ${extraClass}`.trim();
    if (innerHTML) element.innerHTML = innerHTML;
    if (onClick) element.addEventListener('click', onClick);
    if (cursor) element.style.cursor = cursor;
    return element;
}
