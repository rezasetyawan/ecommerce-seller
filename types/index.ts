interface Product {
    id: number
    name: string
    sold: number
    price?: number
    category_id: number
    category?: string
    stocks?: number
    // size?: 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL'
}


interface ProductDetail {
    id: number,
    name: string
    price: number
    description: string
    category_id: number
    sold: number
    category: string
    stocks: number
    images: { id: string, url: string }[]
    variants: { id: number, value: string, price: number, stocks: number, is_default: boolean }[]
}

export type { Product, ProductDetail }