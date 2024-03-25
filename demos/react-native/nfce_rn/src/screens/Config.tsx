import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, NativeModules, TextInput, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SENHA_CERTIFICADO, CNPJ_SH, TOKEN_SH } from '@env';
const { NFCeModule } = NativeModules;
import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "nativewind";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { clearPedidos } from "../store/pedidos";
import { createConfigPix, createConfigPrinter, getConfigPix, getConfigPrinter } from "../store/config-nota";

const Config = () => {
  const navigation = useNavigation();

  const [cnpjInputValue, setCnpjInputValue] = useState('29062609000177');
  const [ufInputValue, setUfInputValue] = useState('PR');
  const [ambienteInputValue, setAmbienteInputValue] = useState('HOMOLOGACAO');
  const [idTokenInputValue, setIdTokenInputValue] = useState('000001');
  const [tokenCSCInputValue, setTokenCSCInputValue] = useState('KSXOMP7BQR9VJ6XEPRDXPAP3MKFCUOV1UKDC');
  const [versaoManualInputValue, setVersaoManualInputValue] = useState('vm60');
  const [impressoraInputValue, setImpressoraInputValue] = useState('LEOPARDO_A7');
  const [portaImpressoraInputValue, setPortaImpressoraInputValue] = useState('00:01:90:C2:D3:D4');
  const [caminhoCertificadoInputValue, setCaminhoCertificadoInputValue] = useState('/storage/emulated/0/DCIM/_certificado.pfx');
  const [automaticPix, setAutomaticPix] = useState(false);
  const [automaticPrinter, setAutomaticPrinter] = useState(false);

  const toggleSwitch = async () => {
    setAutomaticPix(previousState => {
      createConfigPix(!previousState);
      return !previousState
    });
  }

  const toggleSwitchPrinter = async () => {
    setAutomaticPrinter(previousState => {
      createConfigPrinter(!previousState);
      return !previousState
    });
  }

  useEffect(() => {
    async function getPix() {
      const pix = await getConfigPix();
      setAutomaticPix(pix.automaticPix)
    }

    async function getPrinter() {
      const printer = await getConfigPrinter();
      setAutomaticPrinter(printer.automaticPrinter)
    }

    getPix();
    getPrinter();
  }, [])

  async function configurarCertificado() {
    if (NFCeModule) {
      try {
        const content: string = await NFCeModule.certificado();
        console.log('retorno certificado: ' + content);

        if (!content.toLocaleLowerCase().includes('erro')) {
          setCaminhoCertificadoInputValue(content);

          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Sucesso',
            textBody: content,
            autoClose: 600
          });
        } else {
          Toast.show({
            type: ALERT_TYPE.WARNING,
            title: 'Erro',
            textBody: content,
            autoClose: 3000
          });
        }
      } catch (error) {
        console.log('Erro ao enviar certificado:', error);
      }
    }
  }

  const config = {
    cnpj: cnpjInputValue,
    ambiente: ambienteInputValue,
    versaoManual: versaoManualInputValue,
    uf: ufInputValue,
    idTokenCSC: idTokenInputValue,
    tokenCSC: tokenCSCInputValue,
    caminhoCertificado: caminhoCertificadoInputValue,
    senhaCertificado: SENHA_CERTIFICADO,
    modeloImpressora: impressoraInputValue,
    portaComunicacao: portaImpressoraInputValue,
    cnpjSoftwareHouse: CNPJ_SH,
    tokenSoftwareHouse: TOKEN_SH
  };

  async function loadConfig() {
    if (NFCeModule) {
      try {
        const content = await NFCeModule.loadConfig(JSON.stringify(config));
        console.log('retorno loadConfig: ' + content);

        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Sucesso',
          textBody: content,
          autoClose: 350
        });
        return content;
      } catch (error) {
        console.log('Erro ao salvar config:', error);


        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'Erro',
          textBody: 'Erro ao configurar componente: ' + error,
        });
      }
    }
  }

  return (
    <ScrollView className="flex w-full bg-emerald-700 h-full p-4 w-full">
      <Pressable
        className="absolute -left-2 flex flex-row items-center rounded-full"
        onPress={() => {
          navigation.navigate('Dashboard');
        }}
      >
        <Icon name="chevron-left" size={28} />
      </Pressable>

      <Pressable
        className="absolute right-1 flex flex-row items-center rounded-full"
        onPress={() => {
          navigation.navigate('Utility');
        }}
      >
        <Icon name="construction" size={28} />
      </Pressable>

      <View className="mt-12 flex w-full">
        <Text className="flex-none pb-3 w-full text-white">CNPJ</Text>
        <TextInput
          className="border border-white text-white placeholder-text-white rounded-lg p-2 mb-3 w-full"
          onChangeText={text => setCnpjInputValue(text)}
          value={cnpjInputValue}
        />

        <Text className="flex-none pb-3 w-full text-white">UF</Text>
        <TextInput
          className="border border-white text-white placeholder-text-white rounded-lg p-2 mb-3 w-full"
          onChangeText={text => setUfInputValue(text)}
          value={ufInputValue}
        />

        <Text className="flex-none pb-3 w-full text-white">Ambiente</Text>
        <View className="flex justify-center items-start border border-white text-white rounded-lg p-2 mb-3 w-full">
          <Picker
            selectedValue={ambienteInputValue}
            onValueChange={(itemValue, itemIndex) => setAmbienteInputValue(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Homologação" value="HOMOLOGACAO" />
            <Picker.Item label="Produção" value="PRODUCAO" />
          </Picker>
        </View>

        <Text className="flex-none pb-3 w-full text-white">Id Token</Text>
        <TextInput
          className="border border-white text-white placeholder-text-white rounded-lg p-2 mb-3 w-full"
          onChangeText={text => setIdTokenInputValue(text)}
          value={idTokenInputValue}
        />

        <Text className="flex-none pb-3 w-full text-white">Token CSC</Text>
        <TextInput
          className="border border-white text-white placeholder-text-white rounded-lg p-2 mb-3 w-full"
          onChangeText={text => setTokenCSCInputValue(text)}
          value={tokenCSCInputValue}
        />

        <Text className="flex-none pb-3 w-full text-white">Versão Manual</Text>
        <View className="flex justify-center items-start border border-white text-white rounded-lg p-2 mb-3 w-full">
          <Picker
            selectedValue={versaoManualInputValue}
            onValueChange={(itemValue, itemIndex) => setVersaoManualInputValue(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="vm60" value="vm60" />
          </Picker>
        </View>

        <Text className="flex-none pb-3 w-full text-white">Impressora</Text>
        <View className="flex justify-center items-start border border-white text-white rounded-lg p-2 mb-3 w-full">
          <Picker
            selectedValue={impressoraInputValue}
            onValueChange={(itemValue, itemIndex) => setImpressoraInputValue(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Leopardo A7" value="LEOPARDO_A7" />
            <Picker.Item label="Quiosque K2" value="QUIOSQUE_K2" />
            <Picker.Item label="Epson Bluetooth TM-P80" value="EPSON_TM_P80" />
          </Picker>
        </View>

        <Text className="flex-none pb-3 w-full text-white">Porta Impressora</Text>
        <TextInput
          className="border border-white text-white placeholder-text-white rounded-lg p-2 mb-3 w-full"
          onChangeText={text => setPortaImpressoraInputValue(text)}
          value={portaImpressoraInputValue}
        />

        <Text className="flex-none pb-3 w-full text-white">Caminho Certificado</Text>
        <TextInput
          className="border border-white text-white placeholder-text-white rounded-lg p-2 mb-3 w-full"
          onChangeText={text => setCaminhoCertificadoInputValue(text)}
          value={caminhoCertificadoInputValue}
        />

        <View className="flex flex-row items-center border border-white text-white placeholder-text-white rounded-lg p-2 mb-3 w-full">
          <Text className="text-white mr-2">Finalizar PIX automático ?</Text>
          <Switch
            trackColor={{false: '#767577', true: '#FFF'}}
            thumbColor={automaticPix ? '#022c22' : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={automaticPix}
          />
        </View>

        <View className="flex flex-row items-center border border-white text-white placeholder-text-white rounded-lg p-2 mb-3 w-full">
          <Text className="text-white mr-2">Impressão automática ?</Text>
          <Switch
            trackColor={{false: '#767577', true: '#FFF'}}
            thumbColor={automaticPrinter ? '#022c22' : '#f4f3f4'}
            onValueChange={toggleSwitchPrinter}
            value={automaticPrinter}
          />
        </View>

        <Pressable
          className=" flex flex-row items-center rounded-full p-1 bg-emerald-950 p-2 my-2"
          onPress={() => {
            configurarCertificado();
          }}
        >
          <Text className="mx-2 text-white">Enviar certificado</Text>
        </Pressable>

        <Pressable
          className=" flex flex-row items-center rounded-full p-1 bg-emerald-950 p-2 my-2"
          onPress={() => {
            navigation.navigate('ConfigNumeracao')
          }}
        >
          <Text className="mx-2 text-white">Configurar numeração nota</Text>
        </Pressable>

        <Pressable
          className=" flex flex-row items-center rounded-full p-1 bg-emerald-950 p-2 my-2"
          onPress={() => {
            navigation.navigate('ConfigSoftwareHouse')
          }}
        >
          <Text className="mx-2 text-white">Configurar software house</Text>
        </Pressable>

        <Pressable
          className=" flex flex-row items-center rounded-full p-1 bg-emerald-950 p-2 my-2"
          onPress={async () => {
            await loadConfig();
          }}
        >
          <Text className="mx-2 text-white">Configurar componente</Text>
        </Pressable>

        <Pressable
          className=" flex flex-row items-center rounded-full p-1 bg-red-400 p-2 my-2 mb-16"
          onPress={async () => {
            await clearPedidos();

            Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: 'Sucesso',
              textBody: 'Pedidos excluídos com sucesso',
              autoClose: 500
            });
          }}
        >
          <Text className="mx-2 text-white">Limpar pedidos</Text>
        </Pressable>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  picker: {
    marginLeft: -12,
    height: 30,
    width: 300,
    color: '#FFF',
  },
});

export default React.memo(Config);
