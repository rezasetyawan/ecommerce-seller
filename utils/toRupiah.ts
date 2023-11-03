const toRupiah = (price: number) => {
    return "Rp. " + price.toLocaleString("id-ID");
};

export { toRupiah }