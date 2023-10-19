// import { serverSupabaseClient } from '#supabase/server'
// import { SupabaseClient } from '@supabase/supabase-js';

// interface Product {
//     id: number
//     name: string
//     price: number
//     description: string
//     category_id: number
//     selled: number
//     category: string
//     stocks: number
//     images: { id: string, url: string }[]
//     size: { id: string, value: string, price: number, stocks: number }[]
// }

// interface ProductSnapshots {
//     data: Product | {}
// }

// export default eventHandler(async (event) => {
//     const client = await serverSupabaseClient(event);
//     const productId = event.context.params?.id as string

//     try {
//         const { data, error } = await client.from('products').select('id, name, description, category_id, selled').eq('id', +productId)

//         if (error || !data.length) {
//             return { data: {} }
//         }

//         const productsData = data[0] as { id: string, name: string, description: string, category_id: string }

//         const { data: categories } = await client.from('categories').select('name').eq('id', productsData.category_id)
//         const { data: variants } = await client.from('variants').select('id, name, value, price, is_default, stocks').eq('product_id', productsData.id)
//         const { data: images } = await client.from('product_images').select('id, url').eq('product_id', productsData.id)

//         const { data: variant_names } = await client.from('variants_test').select('id, name').eq('product_id', productsData.id)

//         const variantss = await Promise.all(variant_names.map(async (variant) => {
//             const { data } = await client.from('variant_values').select('id, value, variant_id').eq('variant_id', variant.id)
//             return {
//                 variant_id: data[0].variant_id,
//                 variant_name: variant.name,
//                 variant_value: data[0].value
//             }
//         }))

//         const test_variant = {}

//         for (const row of variantss) {
//             const variantName = row.variant_name;
//             const variantValue = row.variant_value;
//             const variantId= row.variant_id

//             if (!test_variant[variantName]) {
//                 test_variant[variantName] = [];
//             }

//             test_variant[variantName].push({value: variantValue, id: variantId});
//         }

//         const {data: product_variants} = await client.from('product_variants').select('*').eq('product_id', productsData.id)

        

//         const productStocks = product_variants ? product_variants.map(v => +v.stocks) : []
//         const defaultVariant = product_variants ? product_variants.find(variant => variant.is_default === true) : null;

//         const transformedVariants: { [variantName: string]: { id: string, value: string, price: number, stocks: number }[] } = {};_

//         variants?.forEach(variant => {
//             if (!transformedVariants[variant.name]) {
//                 transformedVariants[variant.name] = [];
//             }

//             transformedVariants[variant.name].push({
//                 id: variant.id,
//                 value: variant.value,
//                 price: variant.price,
//                 stocks: variant.stocks
//             });
//         });

//         const product = {
//             ...productsData,
//             price: defaultVariant ? +defaultVariant.price : NaN,
//             category: categories ? categories[0].name : '',
//             stocks: productStocks.reduce((accumulator, currentValue) => accumulator + currentValue, 0),
//             images: images,
//             variants: test_variant,
//             product_variants: product_variants
//         }

// return product

//         // return { data: products[0] }
//     } catch (error: any) {
//         return { data: {} }
//     }
// });
