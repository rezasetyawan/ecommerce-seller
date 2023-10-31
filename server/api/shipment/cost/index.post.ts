export default eventHandler(async (event) => {
    const body = await readBody(event)

    try {

        // const { data: shippmentCost, error } = await useFetch(
        //     "https://api.rajaongkir.com/starter/cost",
        //     {
        //       method: "POST",
        //       headers: {
        //         "Access-Control-Allow-Origin": "*",
        //         "Content-Type": "application/json",
        //         key: config.public.RAJA_ONGKIR_API_KEY,
        //       },
        //       body: {
        //         origin: "398",
        //         destination: "498",
        //         weight: 800,
        //         courier: "jne",
        //       },
        //     }
        //   );

        const cost = await $fetch("https://api.rajaongkir.com/starter/cost", {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                key: '4d4a486c92e0cdb6d13ac4a9ecf67dfb',
            },
            body: body
        })

        return cost
    } catch (error: any) {
        return { data: [] }
    }
});
