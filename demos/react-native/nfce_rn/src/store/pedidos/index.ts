import { PedidoRequest, ItemsPedidoRequest, Pedido } from "./types"
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';


export const getAllPedidos = async (): Promise<PedidoRequest> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const keysPedido = keys.filter((key) => key.startsWith('PEDIDO_KEY'))

    const listPedidos = await Promise.all(
      keysPedido.map(async (pedido: string) => {
        const data = await AsyncStorage.getItem(pedido)
        if (data) return JSON.parse(data)
      })
    );

    return {
      isValid: true,
      result: listPedidos
    } as PedidoRequest
  } catch (error) {
    return { isValid: false, result: [] }
  }
}

export const createPedido = async ({ pedido }: { pedido: Pedido }): Promise<any> => {
  try {
    const dataPedido = { id: uuid.v4(), ...pedido }
    await AsyncStorage.setItem(`PEDIDO_KEY_${dataPedido.id}`, JSON.stringify(dataPedido));
    return { isValid: true, result: 0 }
  } catch (error) {
    return { isValid: false, result: 0 }
  }
}

export const updatePedido = async ({ pedido } : { pedido: Pedido}) : Promise<any> => {
  try {
    const dataPedido = {...pedido}
    await AsyncStorage.mergeItem(`PEDIDO_KEY_${dataPedido.id}`, JSON.stringify(dataPedido));
    return { isValid: true, result: 0 }
  } catch (error) {
    return { isValid: false, result: 0 }
  }
}

export const clearPedidos = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const keysPedido = keys.filter((key) => key.startsWith('PEDIDO_KEY'))

    AsyncStorage.multiRemove(keysPedido);
  } catch (error) {
    console.log('Erro ao limpar pedidos: ' + error);
  }
}
