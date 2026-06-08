import stockPlace from "../assets/photos/carousel/stock_place.png";
import productivity from "../assets/photos/carousel/productivity.png";
import lessStock from "../assets/photos/carousel/less_stock.png";
import mycoompy from "../assets/photos/carousel/mycoompy.png";
import scan from "../assets/photos/carousel/myscanandstock_scan.png";
import stock from "../assets/photos/carousel/myscanandstock_stock.png";
import scanner from "../assets/photos/carousel/scanner.png";
import scannerApp from "../assets/photos/carousel/scanner_et_app.png";

export type Categorie =
  | "Gestion des stocks"
  | "Gestion des commandes"
  | "Congrès"
  | "Actualité du dentaire"
  | "Nouveautés";

export interface Article {
  titre: string;
  categorie: Categorie;
  extrait: string;
  image: ImageMetadata;
  url: string;
  date: string; // ISO YYYY-MM-DD
}

// Étape A : données placeholder. En étape B, remplacer ce tableau par un
// fetch Notion renvoyant le même type `Article[]` (le reste de la page ne change pas).
export const articles: Article[] = [
  {
    titre: "Gestion manuelle ou automatisée",
    categorie: "Gestion des stocks",
    extrait:
      "Simplifiez la gestion des stocks dans votre cabinet dentaire fréquenté : économisez temps, argent et énergie !",
    image: stockPlace,
    url: "https://www.scanandstock.fr/articles/gestion-manuelle-ou-automatisee.html",
    date: "2026-05-20",
  },
  {
    titre: "Vers l'automatisation des commandes",
    categorie: "Gestion des commandes",
    extrait: "Est-il temps de commander de nouvelles fournitures dentaires ?",
    image: productivity,
    url: "https://www.scanandstock.fr/articles/automatisation-commandes.html",
    date: "2026-05-12",
  },
  {
    titre: "Changement d'habitudes",
    categorie: "Actualité du dentaire",
    extrait:
      "L'adaptation au changement dans la gestion de stock en cabinet dentaire : un voyage incontournable vers...",
    image: scannerApp,
    url: "https://www.scanandstock.fr/articles/changement-habitudes.html",
    date: "2026-05-03",
  },
  {
    titre: "Optimiser l'espace de stockage",
    categorie: "Gestion des stocks",
    extrait:
      "Quelques principes simples pour réorganiser votre réserve et retrouver vos consommables en un clin d'œil.",
    image: lessStock,
    url: "https://www.scanandstock.fr/articles/optimiser-espace-stockage.html",
    date: "2026-04-22",
  },
  {
    titre: "Scanner vos produits en quelques secondes",
    categorie: "Nouveautés",
    extrait:
      "Découvrez comment le scan de codes-barres accélère vos inventaires au quotidien.",
    image: scanner,
    url: "https://www.scanandstock.fr/articles/scan-rapide.html",
    date: "2026-04-10",
  },
  {
    titre: "Retour sur le congrès ADF",
    categorie: "Congrès",
    extrait:
      "Nos temps forts et rencontres lors du dernier congrès dentaire : innovations et échanges.",
    image: mycoompy,
    url: "https://www.scanandstock.fr/articles/congres-adf.html",
    date: "2026-03-28",
  },
  {
    titre: "Suivre ses stocks en temps réel",
    categorie: "Gestion des stocks",
    extrait:
      "Visualisez l'état de votre réserve à tout moment et anticipez les ruptures.",
    image: stock,
    url: "https://www.scanandstock.fr/articles/stocks-temps-reel.html",
    date: "2026-03-15",
  },
  {
    titre: "Commander au bon moment",
    categorie: "Gestion des commandes",
    extrait:
      "Évitez les surstocks et les ruptures grâce aux seuils de réapprovisionnement.",
    image: scan,
    url: "https://www.scanandstock.fr/articles/commander-au-bon-moment.html",
    date: "2026-03-02",
  },
  {
    titre: "Les tendances du dentaire en 2026",
    categorie: "Actualité du dentaire",
    extrait:
      "Tour d'horizon des évolutions qui transforment l'organisation des cabinets.",
    image: productivity,
    url: "https://www.scanandstock.fr/articles/tendances-2026.html",
    date: "2026-02-18",
  },
  {
    titre: "Nouvelle interface de l'application",
    categorie: "Nouveautés",
    extrait:
      "Une expérience repensée pour gérer vos stocks encore plus rapidement.",
    image: scannerApp,
    url: "https://www.scanandstock.fr/articles/nouvelle-interface.html",
    date: "2026-02-05",
  },
];
