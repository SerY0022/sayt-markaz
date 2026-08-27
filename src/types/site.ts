export interface Department {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

export interface Advantage {
  id: string;
  title: string;
  icon: string;
}

export interface Teacher {
  id: string;
  name: string;
  position: string;
  specialization: string;
  experience: string;
  image: string;
  telegram?: string;
  instagram?: string;
}

export interface Management {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
}

export interface Statistic {
  id: string;
  value: string;
  label: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface SocialLink {
  platform: 'telegram' | 'instagram' | 'facebook' | 'youtube';
  url: string;
}

export interface SettingsData {
  centerName: string
  description: string
  phone: string
  email: string
  address: string
  heroTitle: string
  heroDescription: string
  heroImage: string
  aboutTitle: string
  aboutDescription: string
  aboutImage: string
  logo?: string
}

