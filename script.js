// Récupération des éléments HTML5
const footerYear = document.querySelector(".footer__text__year");

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
