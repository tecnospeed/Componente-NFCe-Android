export type Produto = {
    id: number,
    nome: string,
    preco: number,
    selected?: boolean
}



export type ProdutosRequest = {
    isValid: boolean,
    result: Produto[]
}

