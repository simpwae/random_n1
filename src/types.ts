export type Product = {
  id: string; name: string; price: number
  category: 'Sneakers' | 'Casual' | 'Formal' | 'Boots'
  gender: 'Men' | 'Women' | 'Kids' | 'Unisex'
  colors: string[]; sizes: number[]; stock: Record<number, number>
  image: string; rating: number; reviews: number
  isNew?: boolean; isFeatured?: boolean; description: string
}
export type CartItem = { productId: string; size: number; color: string; quantity: number }
