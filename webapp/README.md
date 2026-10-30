# HDP Math Telegram WebApp

Matematikani o'rganish uchun Telegram WebApp - DTM, IMO va maktab matematikasi.

## 🚀 Xususiyatlar

- **Kundalik masalalar** - Har kuni yangi matematik masalalar
- **Formulalar to'plami** - 140+ matematik formulalar
- **Video darslar** - 500+ video tushuntirishlar
- **Blitz duellari** - Tezkor matematika duellari
- **Progress kuzatish** - Shaxsiy progress tahlili
- **Coin tizimi** - Masalalarni yechib coin to'plang
- **Pro obuna** - Barcha imtiyozlarni oching

## 🛠️ Texnologiyalar

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Telegram Integration**: Telegram WebApp API

## 📋 Talablar

- Node.js 18+
- npm veya yarn

## 📦 O'rnatish

1. Repositoryni klonlang:
```bash
git clone <repository-url>
cd HDP-App/webapp
```

2. O'zgaruvchilarni sozlang:
```bash
cp .env.example .env
```

`.env` faylida quyidagilarni o'zgartiring:
```
BOT_TOKEN=your_bot_token_here
WEBAPP_URL=https://your-webapp-url.com
```

3. O'zgaruvchilarni o'rnating:
```bash
npm install
```

## 🏃 Ishga tushirish

### Development mode:
```bash
npm run dev
```

### Production build:
```bash
npm run build
npm run preview
```

### Telegram botni ishga tushirish:
```bash
cd ../bot
npm install
npm start
```

## 📁 Proyekt tuzilishi

```
webapp/
├── src/
│   ├── components/     # Qayta ishlatiladigan komponentlar
│   ├── screens/        # Ekranlar
│   ├── lib/           # Telegram integratsiyasi
│   ├── store/         # Zustand store
│   ├── types/         # TypeScript interfeyslari
│   ├── data/          # Mock ma'lumotlar
│   ├── App.tsx        # Asosiy komponent
│   └── main.tsx       # Kirish fayli
├── bot/               # Telegram bot
├── index.html         # HTML fayli
└── package.json       # O'zgaruvchilar
```

## 🎨 Dizayn tizimi

### Ranglar
- **Primary**: `#6366F1` (Indigo)
- **Primary Dark**: `#4338CA`
- **Primary Light**: `#E0E7FF`
- **Surface**: `#FFFFFF`
- **Surface Card**: `#F8FAFC`
- **Surface Low**: `#F1F5F9`
- **Text Primary**: `#1E293B`
- **Text Secondary**: `#64748B`
- **Text Muted**: `#94A3B8`
- **Coin**: `#F59E0B`
- **XP**: `#8B5CF6`

### Shrift
- **Family**: Manrope
- **Sizes**: 12px - 32px

### Border Radius
- **Small**: 8px
- **Medium**: 12px
- **Large**: 16px
- **XL**: 24px

## 📱 Ekranlar

- **SplashScreen** - Yuklash ekrani
- **LoginScreen** - Kirish ekrani
- **HomeScreen** - Bosh sahifa
- **FormulasScreen** - Formulalar
- **ProfileScreen** - Profil
- **CoursesScreen** - Kurslar
- **VideoScreen** - Video darslar
- **SolveScreen** - Masala yechish
- **ShopScreen** - Do'kon
- **ProScreen** - Pro obuna
- **BlitzScreen** - Blitz duel

## 🔧 Skriptlar

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## 📄 Litsenziya

MIT
