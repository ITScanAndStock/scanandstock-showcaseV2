// Données éditoriales de la page d'accueil (textes marketing, alt, images).
// Séparées de src/pages/index.astro pour rester éditables sans toucher au
// gabarit de la page. Les images sont importées ici pour bénéficier du
// pipeline d'optimisation Astro (ImageMetadata).
import type { ImageMetadata } from "astro";

import StockPlace from "../assets/photos/carousel/stock_place.png";
import Scanner from "../assets/photos/carousel/scanner.png";
import LessStock from "../assets/photos/carousel/less_stock.png";
import ScannerApp from "../assets/photos/carousel/scanner_et_app.png";
import MyscanScan from "../assets/photos/carousel/myscanandstock_scan.png";
import MyscanStock from "../assets/photos/carousel/myscanandstock_stock.png";
import MyCoompy from "../assets/photos/carousel/mycoompy.png";

export interface CarouselCard {
  src: ImageMetadata;
  alt: string;
  title: string;
  text: string;
}

export interface CarouselImage {
  src: ImageMetadata;
  alt: string;
}

// Carrousel « promesses » : cartes titre + texte + image.
export const carouselCards: CarouselCard[] = [
  {
    src: StockPlace,
    alt: "Espace de stockage dentaire organisé avec les produits Scan&Stock",
    title: "Economisez jusqu’à 20 % sur le poste achat",
    text: "Que ce soit dans des cabinets d’omnipraticien ou de spécialités les utilisateurs de Scan & Stock ont économisé de 16 à 20 % sur leur poste achat l’année où ils l’ont mis en place. Dans les cabinets composés d’une équipe plus importante les économies liées à la mise en place de Scan & Stock sont souvent plus importantes.",
  },
  {
    src: Scanner,
    alt: "Espace de stockage dentaire organisé avec les produits Scan&Stock",
    title: "Diminuez le temps non clinique de vos assistants dentaires",
    text: "Nos assistantes dentaires sont rentables à nos côtés, en salle de soins, pas en salle de stérilisation à gérer les commandes ou à éplucher les catalogues de vépécistes pour retrouver les références d’un produit utilisé il y a 6 mois. Les chirurgiens-dentistes utilisateurs de Scan&Stock ont remarqué qu’en moyenne le temps passé par leurs équipes à gérer les stocks et les commandes est passé de plus d’1h15 par semaine à moins de 20 minutes.",
  },
  {
    src: LessStock,
    alt: "Espace de stockage dentaire organisé avec les produits Scan&Stock",
    title: "Limitez l’empreinte écologique de votre cabinet dentaire",
    text: "Le surstockage et les périmés sont les fléaux de nombreux cabinets dentaires. La peur de manquer ou encore les offres attrayantes de fabricants et fournisseurs entraînent trop souvent des commandes inutiles. Ces commandes (et donc cet argent qui dort !) se retrouvent sur nos étagères ou au fin fond de tiroir parfois jusqu’à ce que leurs dates de péremption soient dépassées ! Pensez à la planète et stoppez le surstockage !",
  },
];

// Carrousel « Nos outils » : images seules.
export const imageCarousel: CarouselImage[] = [
  { src: ScannerApp, alt: "douchette et application Scan&Stock" },
  { src: MyscanScan, alt: "application MyScan&Stock et scanner" },
  { src: MyscanStock, alt: "application MyScan&Stock et gestion de stock" },
  { src: MyCoompy, alt: "application MyCoompy" },
];
