export interface Login {
    email: string,
    password: string
}

export interface product {
    productName: string,
    productPrice: number,
    productType: string,
    productColor: string,
    productDisc: string,
    productURL: string,
    id: number,
    productID: undefined | number,
    trending: boolean,
    rating:number
}

export interface userCartItem {
    productName: string,
    productPrice: number,
    productType: string,
    productColor: string,
    productDisc: string,
    productURL: string,
    productQuantity: number | undefined,
    id: number,
    productID: number,
    productSize: number,
    trending: boolean,
    wishlist: boolean,
    savelater: boolean,
    isloaderRemoveCart: boolean,
    isloaderSaveLater: boolean,
    userID: number | undefined
}

export interface User {
    firstname: string,
    lastname: string,
    email: string,
    password: string
}

export interface Seller {
    name: string,
    email: string,
    password: string,
    sellerID: number
}

export interface addToCart {
    productQuantity: number | undefined,
    userID: number,
    productID: number,
    productSize: number | undefined,
    savelater: boolean | undefined
}

export interface priceSummary {
    price: number,
    discount: number,
    tax: number,
    delivery: number,
    total: number
}

export interface order {
    email: string,
    address: string,
    contact: string,
    totalPrice: number,
    userId: string,
    id: number | undefined
}