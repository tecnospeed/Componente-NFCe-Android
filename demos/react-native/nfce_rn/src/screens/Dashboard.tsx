import React, { useState, useEffect } from 'react';
import CardPedido from '../components/CardPedido';
import { View, Text, Pressable } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getAllPedidos } from '../store/pedidos';
import { Pedido } from '../store/pedidos/types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Dashboard = () => {
  const navigation = useNavigation();
  const [listPedidos, setListPedidos] = useState([] as Pedido[]);
  const isFocused = useIsFocused();

  async function findPedidos() {
    const response = await getAllPedidos();
    if (response.isValid) {
      setListPedidos(response.result);
    }
  }
  useEffect(() => {
    if (isFocused) {
      findPedidos();
    }
  }, [useIsFocused()]);

  return (
    <View className="flex items-center w-full bg-emerald-300 h-full">
      <Pressable
        className="absolute top-3 left-2 flex flex-row items-center rounded-full p-1"
        onPress={() => {
          navigation.navigate('Config');
        }}
      >
        <Icon name="settings" size={28} />
      </Pressable>

      <Pressable
        className="absolute top-3 right-2 flex flex-row items-center rounded-full p-1"
        onPress={() => {
          navigation.navigate('AddPedido');
        }}
      >
        <Icon name="add" size={32} />
      </Pressable>

      <View className="absolute top-4">
        <Text className="text-4xl font-bold text-white">Tecnospeed</Text>
      </View>

      <View className="w-full h-full mt-24 rounded-t-lg">
        <View className="bg-gray-100 rounded-t-full p-4 items-center">
          <Text className="font-bold text-2xl text-gray-400">Pedidos</Text>
        </View>
        <View className=" flex flex-col bg-gray-100 py-2 h-full mb-1">
          <View style={{ height: '85%' }}>
            <CardPedido listPedidos={listPedidos} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(Dashboard);
