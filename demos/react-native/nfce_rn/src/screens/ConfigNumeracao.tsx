import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createInvoiceNumber, createInvoiceSerie, getInvoiceNumber, getInvoiceSerie } from "../store/config-nota";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import Icon from 'react-native-vector-icons/MaterialIcons';

const ConfigNumeracao = () => {
  const navigation = useNavigation();

  const [numeroNotaInputValue, setNumeroNotaInputValue] = useState('');
  const [serieNotaInputValue, setSerieNotaInputValue] = useState('');

  useEffect(() => {
    getInvoiceNumber().then((data) => {
      if (data) {
        setNumeroNotaInputValue(data.numberInvoice);
      }
    });

    getInvoiceSerie().then((data) => {
      if (data) {
        setSerieNotaInputValue(data.serieInvoice);
      }
    });
   }, []);

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
        <Text className="flex-none pb-3 w-full text-white">Série Nota</Text>
        <TextInput
          className="border border-white text-white placeholder-text-white rounded-lg p-2 mb-3 w-full"
          onChangeText={text => setSerieNotaInputValue(text)}
          value={serieNotaInputValue}
        />

        <Text className="flex-none pb-3 w-full text-white">Número Nota</Text>
        <TextInput
          className="border border-white text-white placeholder-text-white rounded-lg p-2 mb-3 w-full"
          onChangeText={text => setNumeroNotaInputValue(text)}
          value={numeroNotaInputValue}
        />

        <Pressable
          className=" flex flex-row items-center rounded-full p-1 bg-emerald-950 p-2 my-2 mb-16"
          onPress={async () => {
            const result = await createInvoiceNumber(numeroNotaInputValue)
            const resultSerie = await createInvoiceSerie(serieNotaInputValue)

            Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: 'Sucesso',
              textBody: `Numeração configurada, Série: ${resultSerie.serieInvoice} e Número: ${result.numberInvoice}`,
              autoClose: 700
            });
          }}
        >
          <Text className="mx-2 text-white">Salvar numeração</Text>
        </Pressable>

      </View>


    </ScrollView>
  );
};

export default React.memo(ConfigNumeracao);
