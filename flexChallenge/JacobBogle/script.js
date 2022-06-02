window.addEventListener('load', displayDropDownConetent());

function displayDropDownConetent() {
    window.addEventListener('mouseup', function(event) {
        const buttonText = document.querySelector('.dropDownButton')
        const menu = document.querySelector('.dropDownButton')
        const menuContent = document.querySelector('.dropDownContent')
        if (event.target != menu && event.target != menuContent){
            menuContent.style.display = 'none'
            buttonText.innerHTML = 'Menu'
        } 
        else if (buttonText.innerHTML === 'Close' && menuContent.style.display === 'block') {
            menuContent.style.display = 'none'
            buttonText.innerHTML = 'Menu'
        } else {
            menuContent.style.display = 'block'
            buttonText.innerHTML = 'Close'
        }
        
    })
};