export default () => {
    const getProducts = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await useFetch('/api/products')

                resolve(response)
            } catch (err) {
                reject(err)
            }
        })
    }

    return {
        getProducts
    }
}