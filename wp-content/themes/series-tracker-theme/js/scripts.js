import "../css/style.css";

// Our modules / classes
import MySeries from "./modules/MySeries";
import MobileMenu from "./modules/MobileMenu";
import HeroSlider from "./modules/HeroSlider";

// Instantiate a new object using our modules/classes
let mobileMenu = new MobileMenu();
let heroSlider = new HeroSlider();
let mySeries = new MySeries();

// Allow new JS and CSS to load in browser without a traditional page refresh
if (module.hot) module.hot.accept();
