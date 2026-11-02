import type { CSSProperties } from 'react'

/**
 * HDP brend belgisi — logotipning o'zi (yashil disk + oq «hdp»).
 *
 * Nima uchun rasm fayli va nega disk ko'rinishida: logotip ingichka chizgili
 * line-art, 28-38 px'da siyoh varianti deyarli ko'rinmaydi (chizig'i ~0,5 px).
 * Schomlaga botirilgan (solid) disk esa maydoncha og'irlikni saqlaydi va
 * oq/yoriq har qanday fonning ustida o'qiladi.
 */
type Props = {
  /** Diskning tomon uzunligi, px */
  size?: number
  /** Qahramon (splash / kirish) bloklari uchun kuchliroq soya va oq halqa */
  hero?: boolean
}

const BrandMark = ({ size = 38, hero = false }: Props) => {
  const box: CSSProperties = {
    width: size,
    height: size,
    borderRadius: '9999px',
    border: hero ? `${Math.max(3, Math.round(size * 0.07))}px solid rgba(255,255,255,0.9)` : undefined,
    boxShadow: hero
      ? '0 14px 30px rgba(13,86,56,0.34)'
      : `0 ${Math.round(size * 0.18)}px ${Math.round(size * 0.42)}px rgba(13,86,56,0.22)`,
  }
  return (
    <img
      src="/brand/hdp-mark-192.png"
      alt="HDP"
      className="shrink-0 block"
      style={box}
      draggable={false}
    />
  )
}

export default BrandMark
