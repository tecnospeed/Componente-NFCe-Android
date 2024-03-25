import 'moment';
import 'moment/locale/pt-br';
import moment from 'moment-timezone';
import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {Pressable} from 'react-native';
import {Pedido} from '../store/pedidos/types';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CardPedido = ({listPedidos}: {listPedidos: Pedido[]}) => {
  const navigation = useNavigation();

  function getStatusColor(status: string) {
    switch (status) {
      case 'Autorizada':
        return 'bg-emerald-500'
      case 'Rejeitada':
        return 'bg-red-400'
      case 'Offline':
        return 'bg-gray-600'
      case 'Cancelada':
        return 'bg-red-900'
      default:
        return 'bg-slate-50'
    }
  }

  return (
    <ScrollView>
      {listPedidos.sort(function(a, b) {
        const [horaA, minutoA] = a.hora!.split(":").map(Number);
        const [horaB, minutoB] = b.hora!.split(":").map(Number);

        if (horaA !== horaB) {
          return horaB - horaA;
        } else {
          return minutoB - minutoA;
        }
      }).map((data: Pedido) => (
        <Pressable
          className="px-4 mb-4"
          key={data.id}
          onPress={() => {
            navigation.navigate('ViewPedido', data);
          }}>
          <View className="flex items-center justify-center bg-white rounded-lg w-full p-4 shadow-lg shadow-gray-600 divide-y divide-gray-300">
            <View className="flex flex-row items-center">
              <Text className="flex text-md text-gray-400">Pedido</Text>
              <Text className="font-bold mx-2">{data.id}</Text>
            </View>

            <View className="flex flex-row items-center justify-between w-full py-4">
              <View className="items-start">
                <Text className="flex text-md text-gray-400">Data</Text>
                <Text className="flex text-base font-bold py-2">
                  {moment(data.data).format('DD/MM/YYYY')}
                </Text>
              </View>

              <View className="items-start">
                <Text className="flex text-md text-gray-400">Hora</Text>
                <Text className="flex text-base font-bold py-2">
                  {data.hora ? data.hora : '00:00'}
                </Text>
              </View>

              <View className="items-start">
                <Text className="flex text-md text-gray-400">Pagamento</Text>
                <Text className="flex text-base font-bold py-2">
                  {data.pagamento.label}
                </Text>
              </View>

              {data.nota && (
                <View className="items-center">
                  <Text className="flex text-md text-gray-400">
                    Nota Fiscal
                  </Text>
                  <Pressable
                    className="flex flex-row items-center justify-center rounded-full bg-emerald-950 p-2"
                    onPress={() => {
                      navigation.navigate('ViewXML', data);
                    }}
                  >
                    <Icon name="description" size={18} color={'#FFF'} />
                  </Pressable>
                </View>
              )}
            </View>

            <View className="flex flex-row items-center justify-between w-full">
              <Text className="text-black font-bold text-xl">
                R${' '}
                {data.total.toLocaleString('pt-BT', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>

              {data.nota && (
                <View className="flex flex-row items-center">
                  <View className={
                    `rounded-full p-2 m-px ${getStatusColor(data.nota?.situacao)}`
                    }
                  />
                  <Text className="left-2">Situação: <Text className="font-bold">{data.nota?.situacao}</Text></Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default React.memo(CardPedido);
