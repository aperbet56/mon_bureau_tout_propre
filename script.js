// Récupération des éléments HTML5
const navigation = document.querySelector(".header__navigation");
const menuBurger = document.querySelector(".header__burger__btn");
const navLinks = document.querySelectorAll(".header__link");
const footerYear = document.querySelector(".footer__text__year");

// Déclaration de la fonction toggleNav qui va permettre l'affichage des liens de navigation
const toggleNav = () => {
  menuBurger.classList.toggle("active");
  navigation.classList.toggle("active");
};

// Ecoute de l'événement "click" sur le bouton menuBurger et appel de la fonction toggleNav
menuBurger.addEventListener("click", toggleNav);

navLinks.forEach((link) =>
  // Ecoute de l'événement click
  link.addEventListener("click", (e) => {
    // Évite que l'évènement courant ne se propage plus loin dans les phases de capture et de déploiement.
    e.stopPropagation();
    // Appel de la fonction toggleNav
    toggleNav();
  })
);

// Déclaration de la fonction getCurrentYear qui va permettre l'affichage dynamique de l'année
const getCurrentYear = () => {
  // Récupération de la date actuelle stockée dans la constante date
  const date = new Date();

  // Récupération de l'année stockée dans la constante year
  const year = date.getFullYear();

  // Affichage dynamique de l'année en cours
  footerYear.textContent = `${year}`;
};
// Appel de la fonction getCurrentYear()
getCurrentYear();
