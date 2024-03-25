import { Produto, ProdutosRequest } from "./types"

export const getAllProdutos = async (): Promise<ProdutosRequest> => {
  try {
    const data = [
      {
        id: 1,
        nome: "Tecno Tacos",
        preco: 0.01,
        selected: false
      },
      {
        id: 2,
        nome: "Tecno Tortilla",
        preco: 0.02,
        selected: false
      }
    ] as Produto[]

    return {
      isValid: true,
      result: data
    } as ProdutosRequest
  } catch (error) {
    return { isValid: false, result: [] }
  }
}

