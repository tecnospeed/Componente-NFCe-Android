import React, { useState, useEffect, Dispatch } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { Item } from '../store/pedidos/types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ListItemPedido = ({
  listProdutos,
  setListProdutos,
}: {
  listProdutos: Item[];
  setListProdutos: Dispatch<Item[]>;
}) => {
  async function addOrRemoveItem(produtoSelected: Item) {
    const data = (await listProdutos.map((produto) => {
      if (produto.id === produtoSelected.id) {
        produto.selected = !produto.selected;
      }
      return produto;
    })) as Item[];
    setListProdutos(data);
  }

  async function changeQuantidade(produtoChange: Item, qtd: string) {
    const data = (await listProdutos.map((produto) => {
      if (produto.id === produtoChange.id) {
        produto.qtd = Number(qtd);
      }
      return produto;
    })) as Item[];
    setListProdutos(data);
  }

  return (
    <View className="flex items-center justify-center bg-gray-200 p-2" style={{ height: '75%' }}>
      <ScrollView className="w-full">
        {listProdutos.map((produto) => (
          <View
            key={produto.id}
            className="flex flex-row items-center justify-center bg-white rounded-md p-2 mx-2 mb-4 shadow-lg shadow-gray-600"
          >
            <View className="flex flex-row items-center justify-between my-2 p-2 w-full">
              <Pressable
                className={`${
                  produto.selected ? 'bg-red-400' : 'bg-emerald-950'
                }  rounded-full h-10 w-10 items-center justify-center`}
                onPress={() => {
                  addOrRemoveItem(produto);
                }}
              >
                {produto.selected ? (
                  <Icon name="remove" size={28} color={'#FFF'}/>
                ) : (
                  <Icon name="add" size={28} color={'#FFF'} />
                )}
              </Pressable>

              <View className="flex flex-1 items-center justify-center">
                <Text className="font-bold text-base text-black">{produto.nome}</Text>
              </View>
              <Text className="font-bold flex flex-1 text-black">Ref: {produto.id}</Text>

              <View className=" flex flex-row flex-1 items-center justify-center">
                <TextInput
                  className="bg-white rounded-lg w-35 h-10 px-3 py-2 border border-gray-200 placeholder-gray-500 text-gray-600 focus:border-gray-400 text-center"
                  keyboardType="decimal-pad"
                  value={`${produto.qtd}`}
                  onChangeText={(text) => changeQuantidade(produto, text)}
                />
                <View className="bg-emerald-500 rounded-full p-2 mx-2">
                  <Text className="text-white font-bold ">R$ {produto.preco}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default React.memo(ListItemPedido);
