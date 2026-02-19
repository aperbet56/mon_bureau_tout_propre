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

/**
 * Simulateur de prix Mon Bureau Tout Propre
 * Classe principale pour gérer les calculs de tarification
 */
class PriceCalculator {
  constructor() {
    // Déclarattion des constantes de tarification
    this.baseRate = 1.5; // 1,50€ par m²
    this.tvaTaux = 0.2; // 20% TVA
    this.vitresSupplement = 0.1; // 10% supplémentaire pour les vitres

    // Éléments DOM
    this.form = document.querySelector(".form__section");
    this.errorDiv = document.querySelector(".error");
    this.resultsDiv = document.querySelector(".results");

    // Initialisation des événements
    this.initEventListeners();
  }

  /**
   * Déclaration de la fonction initListeners qui initialise tous les écouteurs d'événements
   */
  initEventListeners() {
    // Ecoute de la soumission du formulaire et appel de la fonction handleSubmit
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Calcul en temps réel
    const surface = document.querySelector("#surface");
    const frequencies = document.querySelectorAll('input[name="frequency"]');
    const windows = document.querySelector("#windows");

    // Ecoute de l'événement "input" et appel de la fonction tryRealTimeCalculation
    surface.addEventListener("input", () => this.tryRealTimeCalculation());

    frequencies.forEach((freq) => {
      // Ecoute de l'événement "change" et appel de la fonction tryRealTimeCalculation
      freq.addEventListener("change", () => this.tryRealTimeCalculation());
    });

    // Ecoute de l'événement "change" et appel de la fonction tryRealTimeCalculation
    windows.addEventListener("change", () => this.tryRealTimeCalculation());

    // Ecoute de l'événement "input" et appel de la fonction validateSurfaceInput
    surface.addEventListener("input", this.validateSurfaceInput);

    // Récupération du bouton "Réinitialiser"
    const resetBtn = document.querySelector("#reset__btn");
    if (resetBtn) {
      // Ecoute de l'événement "click" et appel de la fonction resetSimulator()
      resetBtn.addEventListener("click", () => this.resetSimulator());
    }
  }

  /**
   * Déclaration de la fonction resetSimulator qui va permettre de réinitialiser le simulateur : formulaire, résultats, erreurs
   */
  resetSimulator() {
    this.form.reset();
    this.hideError();
    this.resultsDiv.style.display = "none";

    // Réinitialise les valeurs affichées
    document.querySelector(".result__surface").textContent = "-";
    document.querySelector(".result__frequency").textContent = "-";
    document.querySelector(".result__base__price").textContent = "-";
    document.querySelector(".result__frequency__price").textContent = "-";
    document.querySelector(".result__with__windows").textContent = "-";
    document.querySelector(".result__HT").textContent = "-";
    document.querySelector(".result__TVA").textContent = "-";
    document.querySelector(".result__TTC").textContent = "-";
    document.querySelector("#windows__result").style.display = "none";

    // Récupéartion et affichage de l'illustration d'attente
    const waiting = document.querySelector(".waiting__illustration");
    if (waiting) waiting.style.display = "block";
  }

  /**
   * Déclaration de la fonction handleSbmit qui va permettre de gérer la soumission du formulaire
   * @param {Event} e - Événement de soumission
   */
  handleSubmit(e) {
    // Suppression du comportement par défaut
    e.preventDefault();
    this.hideError(); // appel de la fonction hideError()

    const formData = this.getFormData(); // fonction getFormData()

    if (!this.validateData(formData)) {
      return;
    }

    const calculation = this.calculatePrice(formData); // fonction calculatePrice(formData)
    this.displayResults(calculation, formData); // Appel de la fonction displayResults(calculation, formData)
  }

  /**
   * Déclartion de la fonction tryRealTimeCalculation qui va tenter un calcul en temps réel si tous les champs requis sont remplis
   */
  tryRealTimeCalculation() {
    const formData = this.getFormData(); // Fonction getFormData()
    if (formData.surface > 0 && formData.frequency > 0) {
      this.hideError(); // Appel de la fonction hideError
      const calculation = this.calculatePrice(formData); // fonction calculatePrice(formData)
      this.displayResults(calculation, formData); // Appel de la fonction displayResults(calculation, formData)
    }
  }

  /**
   * Déclaration de la fonction getFormData qui récupère les données du formulaire
   * @returns {Object} Données du formulaire
   */
  getFormData() {
    const surface = parseFloat(document.querySelector("#surface").value) || 0;
    const frequencyElement = document.querySelector(
      'input[name="frequency"]:checked'
    );
    const frequency = frequencyElement ? parseInt(frequencyElement.value) : 0;
    const windows = document.querySelector("#windows").checked;

    return { surface, frequency, windows };
  }

  /**
   * Déclaration de la fonction validateData qui valide les données du formulaire
   * @param {Object} data - Données à valider
   * @returns {boolean} True si les données sont valides
   */
  validateData(data) {
    if (data.surface <= 0) {
      this.showError("Veuillez saisir une surface valide (supérieure à 0 m²).");
      return false;
    }

    if (data.surface > 10000) {
      this.showError("La surface ne peut pas dépasser 10 000 m².");
      return false;
    }

    if (data.frequency === 0) {
      this.showError("Veuillez sélectionner une fréquence de nettoyage.");
      return false;
    }

    return true;
  }

  /**
   * Déclaration de la focntion calculatePrice qui va permettre de calculer le prix selon les règles définies
   * @param {Object} data - Données pour le calcul
   * @returns {Object} Résultat des calculs
   */
  calculatePrice(data) {
    // Étape 1: Tarif de base (Surface × 1,50€)
    const basePrice = data.surface * this.baseRate;

    // Étape 2: Application de la fréquence
    const frequencyPrice = basePrice * data.frequency;

    // Étape 3: Options supplémentaires (vitres +10%)
    const withWindows = data.windows
      ? frequencyPrice * (1 + this.vitresSupplement)
      : frequencyPrice;

    // Étape 4: Calculs finaux
    const montantHT = withWindows;
    const tva = montantHT * this.tvaTaux;
    const montantTTC = montantHT + tva;

    return {
      basePrice,
      frequencyPrice,
      withWindows: data.windows ? withWindows : null,
      montantHT,
      tva,
      montantTTC,
    };
  }

  /**
   * Déclaration de la fonction displayResults qui va permettre l'affichage des résultats du calcul
   * @param {Object} calculation - Résultats des calculs
   * @param {Object} formData - Données du formulaire
   */
  displayResults(calculation, formData) {
    // Mise à jour des détails
    document.querySelector(
      ".result__surface"
    ).textContent = `${formData.surface} m²`;

    // Texte de fréquence
    const frequencyText = {
      1: "1 fois par semaine",
      2: "2 fois par semaine",
      5: "5 fois par semaine",
    };
    document.querySelector(".result__frequency").textContent =
      frequencyText[formData.frequency];

    // Tarifs calculés
    document.querySelector(".result__base__price").textContent =
      this.formatPrice(calculation.basePrice);
    document.querySelector(".result__frequency__price").textContent =
      this.formatPrice(calculation.frequencyPrice);

    // Gestion de l'affichage des vitres
    const windowsResult = document.querySelector("#windows__result");
    if (formData.windows && calculation.withWindows) {
      windowsResult.style.display = "flex";
      document.querySelector(".result__with__windows").textContent =
        this.formatPrice(calculation.withWindows);
    } else {
      windowsResult.style.display = "none";
    }

    // Montants finaux
    document.querySelector(".result__HT").textContent = this.formatPrice(
      calculation.montantHT
    );
    document.querySelector(".result__TVA").textContent = this.formatPrice(
      calculation.tva
    );
    document.querySelector(".result__TTC").textContent = this.formatPrice(
      calculation.montantTTC
    );

    // Affichage des résultats avec animation
    this.resultsDiv.style.display = "block";

    // Masque l'illustration d'attente
    const waiting = document.querySelector(".waiting__illustration");
    if (waiting) waiting.style.display = "none";

    // Scroll vers les résultats avec un léger délai pour l'animation
    setTimeout(() => {
      this.resultsDiv.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  }

  /**
   * Formate un nombre en prix français (€)
   * @param {number} price - Prix à formater
   * @returns {string} Prix formaté
   */
  formatPrice(price) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(price);
  }

  /**
   * Déclaration de la fonction showError qui va afficher un message d'erreur
   * @param {string} message - Message d'erreur à afficher
   */
  showError(message) {
    this.errorDiv.textContent = message;
    this.errorDiv.style.display = "block";
    // this.resultsDiv.style.display = "none";

    // Scroll vers l'erreur
    this.errorDiv.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  /**
   * Déclaration de la fonction hideError qui va permettre de cacher le message d'erreur
   */
  hideError() {
    this.errorDiv.style.display = "none";
  }

  /**
   * Déclaration de la fonction validateSurfaceInput qui va permettre de valider les entrées numériques de surface
   * @param {Event} e - Événement d'entrée
   */
  validateSurfaceInput(e) {
    const value = parseFloat(e.target.value);

    // Empêche les valeurs négatives
    if (value < 0) {
      e.target.value = "";
    }

    // Limite à 10000 m²
    if (value > 10000) {
      e.target.value = 10000;
    }
  }
}

// Initialisation de l'application quand le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  // Création d'une instance du calculateur de prix
  const calculator = new PriceCalculator();
});
