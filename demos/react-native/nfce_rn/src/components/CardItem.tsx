import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Item } from '../store/pedidos/types';

const CardItem = ({ cart }: { cart: Item[] }) => {
  return (
    <ScrollView className="w-full rounded-lg pt-2">
      {cart.map((produto) => (
        <View
          key={produto.id}
          className="flex items-center justify-center bg-white rounded-md  p-2 mx-2 mb-4 shadow-lg shadow-gray-600"
        >
          <View className="flex flex-row items-center justify-between w-full my-2 p-2 ">
            <View className="items-center justify-center flex flex-1 ">
              <Text className="font-bold text-base text-black">{produto.nome}</Text>
            </View>
            <View className="flex flex-1">
              <Text className="font-bold text-black">Ref: {produto.id}</Text>
            </View>
            <View className="flex flex-1">
              <Text className="font-bold text-black">Qtd: {produto.qtd}</Text>
            </View>
            <View className="items-center justify-center">
              <View className="bg-emerald-500 rounded-full p-2">
                <Text className="text-white font-bold text-black">
                  R${' '}
                  {(Number(produto.qtd) * Number(produto.preco)).toLocaleString('pt-BT', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default React.memo(CardItem);
