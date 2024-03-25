export type Pedido = {
    id?: number,
    cliente: string,
    data?: string,
    loja?: string,
    qtd?: number,
    total: number,
    id_pagamento: number,
    offline: boolean,
    hora?: string,
    nota?: {
      xml?: string,
      xmlAssinado?: string,
      xmlRetorno?: string,
      cStat?: string,
      protocolo?: string,
      chave?: string,
      situacao: string,
    }
    items_pedidos?: Item[],
    pagamento: {
        value: number,
        label: string,
    }
}

export type Item = {
    id: number,
    nome: string,
    preco: number,
    qtd: number
    selected?: boolean
}

export type PedidoRequest = {
    isValid: boolean,
    result: Pedido[]
}

export type ItemsPedidoRequest = {
    isValid: boolean,
    idPedido: string,
    result: Item[]
}
