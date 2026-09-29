import { useState } from 'react'
import { IMG } from '../api'

const REALISTIC_FALLBACKS = {
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
  carrot: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80',
  beetroot: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=800&auto=format&fit=crop&q=80',
  spinach: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80',
  palak: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80',
  moringa: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
  murungai: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
  curry: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop&q=80',
  kariveppilai: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop&q=80',
  mint: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=800&auto=format&fit=crop&q=80',
  pudina: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=800&auto=format&fit=crop&q=80',
  coriander: 'https://images.unsplash.com/photo-1589135233689-d5612f00a588?w=800&auto=format&fit=crop&q=80',
  kothamalli: 'https://images.unsplash.com/photo-1589135233689-d5612f00a588?w=800&auto=format&fit=crop&q=80',
  methi: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&auto=format&fit=crop&q=80',
  papaya: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=800&auto=format&fit=crop&q=80',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80',
  orange: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&auto=format&fit=crop&q=80',
  pineapple: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&auto=format&fit=crop&q=80',
  amla: 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=800&auto=format&fit=crop&q=80',
  nellikai: 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=800&auto=format&fit=crop&q=80',
  guava: 'https://images.unsplash.com/photo-1536511135899-73b320d3e5aa?w=800&auto=format&fit=crop&q=80',
  pomegranate: 'https://images.unsplash.com/photo-1541344999736-83eca872f242?w=800&auto=format&fit=crop&q=80',
  watermelon: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
  lemon: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=800&auto=format&fit=crop&q=80',
  mango: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80',
  broccoli: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=80',
  ginger: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
  inji: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
  garlic: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800&auto=format&fit=crop&q=80',
  cucumber: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=800&auto=format&fit=crop&q=80',
  capsicum: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop&q=80',
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
  sweetpotato: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=800&auto=format&fit=crop&q=80',
  gourd: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800&auto=format&fit=crop&q=80',
}

const CATEGORY_DEFAULTS = {
  vegetable: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
  greens: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80',
  fruit: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&auto=format&fit=crop&q=80',
}

export function getProductPhotoUrl(product) {
  if (product?.image) {
    if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
      return product.image
    }
    return IMG + product.image
  }
  const name = (product?.name || '').toLowerCase()
  for (const [k, url] of Object.entries(REALISTIC_FALLBACKS)) {
    if (name.includes(k)) return url
  }
  return CATEGORY_DEFAULTS[product?.category] || CATEGORY_DEFAULTS.vegetable
}

export default function ProductImage({ product, className = 'h-44 w-full' }) {
  const initialUrl = getProductPhotoUrl(product)
  const [src, setSrc] = useState(initialUrl)

  const handleError = () => {
    const catFallback = CATEGORY_DEFAULTS[product?.category] || CATEGORY_DEFAULTS.vegetable
    if (src !== catFallback) {
      setSrc(catFallback)
    }
  }

  return (
    <img
      src={src}
      alt={product?.name || 'Produce'}
      loading="lazy"
      onError={handleError}
      className={`${className} bg-green-50 object-cover`}
    />
  )
}
