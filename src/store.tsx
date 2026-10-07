import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { CartItem } from './types'
import { products } from './data/products'
type Store = { cart: CartItem[]; wishlist: string[]; addCart:(item:CartItem)=>boolean; changeQty:(item:CartItem, amount:number)=>void; removeCart:(item:CartItem)=>void; toggleWish:(id:string)=>void; clearCart:()=>void }
const StoreContext = createContext<Store | null>(null)
const itemKey = (item: CartItem) => item.productId + '-' + item.size + '-' + item.color
const read = <T,>(k:string, fallback:T):T => { try { return JSON.parse(localStorage.getItem(k) || '') as T } catch { return fallback } }
export function StoreProvider({children}:{children:ReactNode}) {
 const [cart,setCart] = useState<CartItem[]>(()=>read('solea-cart',[]))
 const [wishlist,setWishlist] = useState<string[]>(()=>read('solea-wishlist',[]))
 useEffect(()=>localStorage.setItem('solea-cart',JSON.stringify(cart)),[cart])
 useEffect(()=>localStorage.setItem('solea-wishlist',JSON.stringify(wishlist)),[wishlist])
 const addCart=(item:CartItem)=>{const product=products.find(p=>p.id===item.productId);const stock=product?.stock[item.size]||0;const current=cart.find(x=>itemKey(x)===itemKey(item))?.quantity||0;if(!stock||current+item.quantity>stock)return false;setCart(current?cart.map(x=>itemKey(x)===itemKey(item)?{...x,quantity:x.quantity+item.quantity}:x):[...cart,item]);return true}
 const changeQty=(item:CartItem,amount:number)=>setCart(cart.flatMap(x=>{if(itemKey(x)!==itemKey(item))return[x];const stock=products.find(p=>p.id===x.productId)?.stock[x.size]||0;const quantity=Math.min(stock,x.quantity+amount);return quantity>0?[{...x,quantity}]:[]}))
 const value=useMemo(()=>({cart,wishlist,addCart,changeQty,removeCart:(item:CartItem)=>setCart(cart.filter(x=>itemKey(x)!==itemKey(item))),toggleWish:(id:string)=>setWishlist(wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id]),clearCart:()=>setCart([])}),[cart,wishlist])
 return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
export const useStore=()=>{const store=useContext(StoreContext);if(!store)throw new Error('Store unavailable');return store}
