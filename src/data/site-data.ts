import { Department, Advantage, Teacher, Management, Statistic, GalleryItem, SocialLink } from '../types/site';

export const departments: Department[] = [
  {
    id: 'it',
    title: 'IT va Dasturlash',
    description: 'Zamonaviy dasturlash tillari va texnologiyalari orqali kelajak kasbini egallang.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
    features: ['Frontend dasturlash', 'Backend dasturlash', 'Grafik dizayn']
  },
  {
    id: 'languages',
    title: 'Xorijiy tillar',
    description: 'Chet tillarini samarali metodika yordamida tez va oson o\'rganing.',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format&fit=crop',
    features: ['Ingliz tili', 'Koreys tili', 'Rus tili']
  },
  {
    id: 'computer-literacy',
    title: 'Kompyuter savodxonligi',
    description: 'Zamonaviy texnologiyalardan kundalik va kasbiy maqsadlarda foydalanishni o\'rganing.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop',
    features: ['MS Office', 'Internet va Xavfsizlik', 'Kompyuter arxitekturasi']
  }
];

export const advantages: Advantage[] = [
  {
    id: 'adv-1',
    title: 'Tajribali o\'qituvchilar',
    icon: 'graduation-cap'
  },
  {
    id: 'adv-2',
    title: 'Zamonaviy o\'quv dasturlari',
    icon: 'book-open'
  },
  {
    id: 'adv-3',
    title: 'Amaliy mashg\'ulotlar',
    icon: 'briefcase'
  },
  {
    id: 'adv-4',
    title: 'Sertifikat',
    icon: 'award'
  }
];

export const teachers: Teacher[] = [
  {
    id: 't-1',
    name: 'Sardor Qodirov',
    position: 'IT Mentor',
    specialization: 'Frontend (React/Next.js)',
    experience: '5+ yil tajriba',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format&fit=crop',
    telegram: 'https://t.me',
    instagram: 'https://instagram.com'
  },
  {
    id: 't-2',
    name: 'Malika Rustamova',
    position: 'Ingliz tili o\'qituvchisi',
    specialization: 'IELTS Instructor',
    experience: '7+ yil tajriba',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    telegram: 'https://t.me',
    instagram: 'https://instagram.com'
  },
  {
    id: 't-3',
    name: 'Javohir Olimov',
    position: 'Backend Mentor',
    specialization: 'Node.js, PostgreSQL',
    experience: '4+ yil tajriba',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
    telegram: 'https://t.me',
    instagram: 'https://instagram.com'
  },
  {
    id: 't-4',
    name: 'Dilnoza Karimova',
    position: 'Rus tili o\'qituvchisi',
    specialization: 'Rus tili grammatikasi',
    experience: '6+ yil tajriba',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop',
    telegram: 'https://t.me',
    instagram: 'https://instagram.com'
  }
];

export const management: Management[] = [
  {
    id: 'm-1',
    name: 'Bahriddin To\'rayev',
    position: 'O\'quv Markaz Direktori',
    bio: 'Ta\'lim sohasida 15 yillik tajribaga ega. Maqsadimiz – sifatli ta\'lim orqali jamiyatga foyda keltirish.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'm-2',
    name: 'Aziza Mamatova',
    position: 'O\'quv ishlari bo\'yicha menejer',
    bio: 'O\'quv jarayonlarini tashkil etish va sifatini nazorat qilish bo\'yicha yetakchi mutaxassis.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop'
  }
];

export const statistics: Statistic[] = [
  {
    id: 's-1',
    value: '1000+',
    label: 'O\'quvchilar'
  },
  {
    id: 's-2',
    value: '20+',
    label: 'O\'qituvchilar'
  },
  {
    id: 's-3',
    value: '10+',
    label: 'O\'quv yo\'nalishlari'
  },
  {
    id: 's-4',
    value: '5+',
    label: 'Yillik tajriba'
  }
];

export const gallery: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Ochiq eshiklar kuni',
    description: 'Yangi o\'quvchilar bilan tanishuv',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'g-2',
    title: 'Dasturlash xonasi',
    description: 'Amaliy mashg\'ulotlar jarayoni',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'g-3',
    title: 'Bitiruvchilar',
    description: 'Sertifikat topshirish marosimi',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop'
  }
];

export const socialLinks: SocialLink[] = [
  {
    platform: 'telegram',
    url: 'https://t.me/'
  },
  {
    platform: 'instagram',
    url: 'https://instagram.com/'
  }
];
