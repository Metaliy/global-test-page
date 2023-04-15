const burgerBtn = document.querySelector('.main-nav__toggle');
const pageNav = document.querySelector('.page-header__nav-list');

burgerBtn.addEventListener('click', function() {
  burgerBtn.classList.toggle('open');
  pageNav.classList.toggle('page-header__nav-list--open');
});

document.addEventListener('click', function(event) {
  const isClickInsideElement = document.querySelector('.page-header').contains(event.target);
  if (!isClickInsideElement) {
    burgerBtn.classList.toggle('open');
    pageNav.classList.toggle('page-header__nav-list--open');
  }
});

const userListItems = document.querySelectorAll('.promo__user-list-item');

for (let i = 0; i < userListItems.length; i++) {
  userListItems[i].style.zIndex = -i
}

const inputElement = document.querySelector(".promo__input");

inputElement.addEventListener("input", function(e) {
  const forbiddenChars = "!@#$%^&*()";
  const inputValue = e.target.value;

  for (let i = 0; i < inputValue.length; i++) {
    if (forbiddenChars.indexOf(inputValue[i]) !== -1) {
      e.target.value = inputValue.slice(0, i) + inputValue.slice(i + 1);
    }
  }
});

const promoDescription = document.querySelector('.promo__description');
fetch('https://baconipsum.com/api/?type=lucky')
  .then(response => response.json())
  .then(data => {
    promoDescription.textContent = data[0];
  });

