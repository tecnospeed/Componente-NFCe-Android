import React, {useState, useEffect} from 'react';
import {View, Text, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FormPedido from '../components/FormPedido';
import {Pedido} from '../store/pedidos/types';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  route: {
    params: Pedido;
  };
}

const ViewPedido = ({route}: Props) => {
  const data = route.params;
  const [dataPedido, setDataPedido] = useState({} as Pedido);

  const navigation = useNavigation();
  return (
    <View className="flex items-center w-full bg-emerald-500 h-full">
      <Pressable
        className="absolute top-3 left-2 flex flex-row items-center rounded-full p-1"
        onPress={() => {
          navigation.navigate('Dashboard');
        }}>
        <Icon name="chevron-left" size={28} />
      </Pressable>
      <View className="absolute top-4">
        <Text className="text-4xl font-bold text-white">Pedido</Text>
      </View>

      <View className="w-full h-full mt-24 rounded-t-lg">
        <View className="bg-gray-100 rounded-t-full p-4 items-center">
          <Text className="font-bold text-2xl text-gray-400">Pedido</Text>
        </View>

        <View className=" flex flex-col bg-gray-100 h-full">
          {data.id && (
            <FormPedido dataPedido={data} setDataPedido={setDataPedido} />
          )}
        </View>
      </View>
    </View>
  );
};

export default React.memo(ViewPedido);
