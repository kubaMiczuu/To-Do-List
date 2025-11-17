//Opening or Closing the Menu function
function menuOptions(type, of, zindex, display) {
    const blur = document.querySelector('.wholePage');
    const menu = document.querySelector(type);
    const body = document.body;

    body.style.overflow = of;
    blur.style=`z-index: ${zindex};`;
    menu.style=`display: ${display};`;
}