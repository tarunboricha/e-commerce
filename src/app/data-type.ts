export interface signUp {
    userID:number,
    name: string,
    password: string,
    email: string
}

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
    productQuantity: number | undefined,
    id: number,
    productID: undefined | number,
    productSize: number|undefined,
    trending:boolean|undefined,
    wishlist:boolean|undefined
}

export interface User {
    name: string,
    email: string,
    password: string,
    id: number
}

export interface addToCart {
    productQuantity: number | undefined,
    userID: number,
    productID: number,
    productSize: number|undefined,
}

export interface priceSummary {
    price: number,
    discount: number,
    tax: number,
    delivery: number,
    total: number
}

export interface order {
    email:string,
    address:string,
    contact:string,
    totalPrice:number,
    userId:string,
    id:number|undefined
  }