interface Product {
    id: number
    name: string
    sold: number
    price?: number
    category_id: number
    category?: string
    stocks?: number
    slug?: string
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
    variants: { id: string, value: string, price: number, stocks: number, is_default: boolean }[]
}

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image_url: string;
    variant: string
}

interface Order {
    id: string;
    created_at: string;
    total: number;
    status:
    | "PENDING"
    | "PAYMENT"
    | "ONPROCESS"
    | "SHIPPING"
    | "CANCELLED"
    | "FINISHED";
    order_items: OrderItem[];
}

export type { Product, ProductDetail, OrderItem, Order }