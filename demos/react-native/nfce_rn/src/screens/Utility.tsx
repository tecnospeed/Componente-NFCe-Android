import React, { useState } from 'react';
import { View, Text, Pressable, NativeModules, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const { NFCeModule } = NativeModules;
import Icon from 'react-native-vector-icons/MaterialIcons';

const Utility = () => {
  const navigation = useNavigation();
  const [xmlStatusServico, setXmlStatusServico] = useState('');
  const [xmlInutilizarNumeracao, setXmlInutlizarNumeracao] = useState('');

  return (
    <View className="flex w-full bg-emerald-700 h-full p-4 w-full">
      <Pressable
        className="absolute left-2 flex flex-row items-center rounded-full mt-4"
        onPress={() => {
          navigation.navigate('Config');
        }}
      >
        <Icon name="chevron-left" size={28} />
      </Pressable>

      <View className="mt-12 flex w-full">
        <Pressable
            className=" flex flex-row items-center rounded-full p-1 bg-emerald-950 p-2 my-2"
            onPress={async () => {
              if (NFCeModule) {
                try {
                  const result = await NFCeModule.statusServico();
                  setXmlStatusServico(result);
                  setXmlInutlizarNumeracao('');
                  console.log('retorno status serviço: ' + result);
                } catch (error) {
                  console.log('Erro ao consultar status do serviço:', error);
                }
              }
            }}
          >
            <Text className="mx-2 text-white">Status do Serviço</Text>
        </Pressable>

        <Pressable
            className=" flex flex-row items-center rounded-full p-1 bg-emerald-950 p-2 my-2 mb-4"
            onPress={async () => {
              if (NFCeModule) {
                try {

                  const result = await NFCeModule.inutilizar('24', '29062609000177', '65', '109', '1', '2', 'Erro durante a emissão de nota fiscal inutilizar');
                  setXmlInutlizarNumeracao(result);
                  setXmlStatusServico('');
                  console.log('retorno inutilizar numeração: ' + result);
                } catch (error) {
                  console.log('Erro ao inutilizar numeração:', error);
                }
              }
            }}
          >
            <Text className="mx-2 text-white">Inutilizar Numeração</Text>
        </Pressable>

        <View className="flex items-center w-full bg-emerald-700 h-full">
          {
            xmlStatusServico && (
              <>
                <Text className="text-white">Status Serviço</Text>
                <Text className="text-white">{xmlStatusServico}</Text>
              </>
            )
          }

          {
            xmlInutilizarNumeracao && (
              <>
                <Text>Inutlizar Numeração</Text>
                <Text>{xmlInutilizarNumeracao}</Text>
              </>
            )
          }
        </View>
      </View>
    </View>
  );
};

export default React.memo(Utility);
