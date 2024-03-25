import React, { useState } from 'react';
import { View, Text, Pressable, NativeModules, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
const { NFCeModule } = NativeModules;
import Icon from 'react-native-vector-icons/MaterialIcons';

const ConfigSoftwareHouse = () => {
  const navigation = useNavigation();

  const [cnpjSoftwareHouseInputValue, setCnpjSoftwareHouseInputValue] = useState('29062609000177');
  const [tokenSoftwareHouseInputValue, setTokenSoftwareHouseInputValue] = useState('1DuS5BCloe2EeZ0I9D5j19fcwF79ychg3OSkyvAL');

  return (
    <ScrollView className="flex w-full bg-emerald-700 h-full p-4 w-full">
      <Pressable
        className="absolute top-3 -left-2 flex flex-row items-center rounded-full p-1"
        onPress={() => {
          navigation.navigate('Config');
        }}
      >
        <Icon name="chevron-left" size={28} />
      </Pressable>

      <View className="mt-12 flex w-full">
        <Text className="flex-none pb-3 w-full text-white">CNPJ Software House</Text>
        <TextInput
          className="border border-white text-white placeholder-text-white rounded-lg p-2 mb-3 w-full"
          onChangeText={text => setCnpjSoftwareHouseInputValue(text)}
          value={cnpjSoftwareHouseInputValue}
        />

        <Text className="flex-none pb-3 w-full text-white">Token Software House</Text>
        <TextInput
          className="border border-white text-white placeholder-text-white rounded-lg p-2 mb-3 w-full"
          onChangeText={text => setTokenSoftwareHouseInputValue(text)}
          value={tokenSoftwareHouseInputValue}
        />

        <Pressable
          className=" flex flex-row items-center rounded-full p-1 bg-emerald-950 p-2 my-2 mb-16"
          onPress={async () => {
            if (NFCeModule) {
              try {
                await NFCeModule.configurarSoftwareHouse(cnpjSoftwareHouseInputValue, tokenSoftwareHouseInputValue)

                Toast.show({
                  type: ALERT_TYPE.SUCCESS,
                  title: 'Sucesso',
                  textBody: `Software House configurada com sucesso`,
                });
              } catch (error) {
                console.log('Erro ao configurar software house:', error);

                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Erro',
                  textBody: `Erro ao configurar software house. ${error}`,
                });
              }
            } else {
              console.warn('Modulo NFCe não encontrado');
            }
          }}
        >
          <Text className="mx-2 text-white">Configurar</Text>
        </Pressable>

      </View>


    </ScrollView>
  );
};

export default React.memo(ConfigSoftwareHouse);
