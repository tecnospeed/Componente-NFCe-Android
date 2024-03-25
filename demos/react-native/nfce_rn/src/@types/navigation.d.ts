import { Pedido } from "../store/pedidos/types"

export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            Dashboard: undefined
            AddPedido: undefined
            ViewPedido: Pedido
            ViewXML: Pedido
            Config: undefined,
            ConfigSoftwareHouse: undefined,
            ConfigNumeracao: undefined,
            Utility: undefined,
        }
    }
}

