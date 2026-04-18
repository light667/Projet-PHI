export interface PortfolioMetadata {
  title: string;
  description: string;
  author: string;
  favicon?: string;
}

export interface PortfolioTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string; // ex: 'Inter', 'Roboto'
  variant: 'light' | 'dark';
}

export interface PortfolioLayout {
  navigation: 'sidebar' | 'topbar' | 'minimal';
}

// Un type flexible pour le contenu des sections
export interface SectionContent {
  [key: string]: any; // permet de stocker des images, textes, listes selon le type de section
}

export interface PortfolioSection {
  id: string;
  type: 'hero' | 'about' | 'gallery' | 'contact' | 'projects' | 'custom';
  isVisible: boolean;
  content: SectionContent;
}

export interface PortfolioData {
  id: string;
  metadata: PortfolioMetadata;
  theme: PortfolioTheme;
  layout: PortfolioLayout;
  sections: PortfolioSection[];
}
