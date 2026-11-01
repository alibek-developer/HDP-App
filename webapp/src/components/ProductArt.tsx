import type { ReactNode } from 'react'
import {
  Backpack, BookOpen, Calculator, Coffee, Footprints, Gem, GraduationCap,
  Headphones, Keyboard, Lamp, PenTool, Shirt, ShoppingBag, Smartphone,
  Speaker, Sun, Tablet, Watch, Zap,
} from 'lucide-react'
import type { Product } from '../data/content'

/**
 * Sovg'a rasmi — do'kon kartasi va mahsulot sahifasi bitta manbadan chizadi.
 * Haqiqiy foto yo'q: mahsulot turi bo'yicha tonlangan plitka + izolyatsiyalangan
 * piktogramma. `size` karta (128) va sahifa (bir butun kenglik) uchun.
 */

type Art = { icon: typeof Smartphone; from: string; to: string; ink: string }

const ARTS: Record<string, Art> = {
  phone: { icon: Smartphone, from: '#E7EEF9', to: '#CBD9EE', ink: '#2F4A78' },
  tablet: { icon: Tablet, from: '#F0EAF8', to: '#D8CDEC', ink: '#4A3878' },
  buds: { icon: Headphones, from: '#E6F4EA', to: '#C8E6D2', ink: '#1F5132' },
  watch: { icon: Watch, from: '#F0EAF8', to: '#DAD0EE', ink: '#4A3878' },
  power: { icon: Zap, from: '#FCF1DC', to: '#F6DFB0', ink: '#854D0E' },
  keyboard: { icon: Keyboard, from: '#EDF1F4', to: '#D3DCE4', ink: '#33455A' },
  calculator: { icon: Calculator, from: '#E6F4EA', to: '#C8E6D2', ink: '#1F5132' },
  speaker: { icon: Speaker, from: '#FBECEC', to: '#F3D6D6', ink: '#7A3232' },
  backpack: { icon: Backpack, from: '#EAF2E2', to: '#D2E4C0', ink: '#33501F' },
  tote: { icon: ShoppingBag, from: '#F4EFE4', to: '#E4DAC5', ink: '#5C4A24' },
  tee: { icon: Shirt, from: '#EAF2E2', to: '#D2E4C0', ink: '#33501F' },
  cap: { icon: Sun, from: '#FCF1DC', to: '#F6DFB0', ink: '#854D0E' },
  sneaker: { icon: Footprints, from: '#EDF1F4', to: '#D3DCE4', ink: '#33455A' },
  bookMath: { icon: BookOpen, from: '#E6F0FA', to: '#C6DDF2', ink: '#1F4368' },
  bookOlymp: { icon: GraduationCap, from: '#FCF1DC', to: '#F6DFB0', ink: '#854D0E' },
  atlas: { icon: BookOpen, from: '#EAF2E2', to: '#D2E4C0', ink: '#33501F' },
  notes: { icon: PenTool, from: '#EAF2E2', to: '#D2E4C0', ink: '#33501F' },
  pens: { icon: PenTool, from: '#FBECEC', to: '#F3D6D6', ink: '#7A3232' },
  thermo: { icon: Coffee, from: '#F0EAF8', to: '#DAD0EE', ink: '#4A3878' },
  lamp: { icon: Lamp, from: '#FCF1DC', to: '#F6DFB0', ink: '#854D0E' },
}

const FALLBACK: Art = { icon: Gem, from: '#EDF1F4', to: '#DCE4DA', ink: '#3B4A38' }

export const artOf = (product: Product): Art => ARTS[product.art] ?? FALLBACK

interface Props {
  product: Product
  /** kvadrat tomon uzunligi (px). `fill` berilsa kerak emas. */
  size?: number
  /** ikonka tomon uzunligi */
  iconSize?: number
  radius?: number
  /** ota blokka to'la, kvadrat */
  fill?: boolean
  children?: ReactNode
}

const ProductArt = ({ product, size = 140, iconSize, radius = 12, fill = false, children }: Props) => {
  const art = artOf(product)
  const Icon = art.icon
  const box = iconSize ?? Math.round(size * 0.42)

  return (
    <span
      className="relative block overflow-hidden"
      style={{
        width: fill ? '100%' : size,
        height: fill ? undefined : size,
        aspectRatio: fill ? '1 / 1' : undefined,
        borderRadius: radius,
        background: `linear-gradient(150deg, ${art.from} 0%, ${art.to} 100%)`,
      }}
    >
      {/* stol ustidagi yorug'lik */}
      <span
        className="absolute pointer-events-none"
        style={{
          width: '90%',
          height: '90%',
          left: '5%',
          top: '-35%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.55)',
          filter: 'blur(26px)',
        }}
      />
      {/* soya */}
      <span
        className="absolute pointer-events-none"
        style={{
          width: box * 1.15,
          height: box * 0.16,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, ${box * 0.62}px)`,
          borderRadius: '50%',
          background: 'rgba(30,45,25,0.16)',
          filter: `blur(${Math.round(box * 0.12)}px)`,
        }}
      />
      <span
        className="absolute inset-0 flex items-center justify-center"
        style={{ color: art.ink }}
      >
        <Icon size={box} strokeWidth={1.35} />
      </span>
      {children}
    </span>
  )
}

export default ProductArt
