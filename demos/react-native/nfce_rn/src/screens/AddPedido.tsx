import React, { useState } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FormPedido from '../components/FormPedido';
import { Pedido } from '../store/pedidos/types';
import { createPedido } from '../store/pedidos';
import { generatePaymentPix, verifyPaymentPix } from '../store/payment';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { emitirNota, imprimirNota } from '../store/utils/nota';
import 'moment';
import 'moment/locale/pt-br';
import moment from 'moment-timezone';
import Icon from 'react-native-vector-icons/MaterialIcons';
import uuid from 'react-native-uuid';
import { getConfigPix, getConfigPrinter } from "../store/config-nota";

const AddPedido = () => {
  const navigation = useNavigation();
  const [dataPedido, setDataPedido] = useState({} as Pedido);
  const [pay, setPay] = useState({});
  const [loadPayment, setLoadPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showButtonFinishPayment, setShowButtonFinishPayment] = useState(false);

  async function savePedido() {
    const data = await emitirNota(dataPedido);

    if (!data) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Erro',
        textBody: 'Erro ao emitir nota!',
      });
    } else {
      const cStat = !dataPedido.offline ? data.nota.match(/<cStat>(.+?)<\/cStat>/)![1] : '';
      const protocolo = !dataPedido.offline ? ['100', '104'].includes(cStat) ? data.nota.match(/<nProt>(.*)<\/nProt>/)![1] : '' : '';
      const chave = new RegExp('Id="NFe([^"]*?)"', 'im').exec(data.xml)![1] || '';
      const xMotivo = !dataPedido.offline ? data.nota.match(/<xMotivo>(.*?)<\/xMotivo>/)![1] || '': '';

      const response = await createPedido({
        pedido: {
          ...dataPedido,
          paymentId: pay.id,
          paymentTransaction: pay.transactionId,
          nota: {
            xml: data.xml,
            xmlAssinado: data.xmlSign,
            xmlRetorno: data.nota,
            situacao: dataPedido.offline ? 'Offline' : ['100', '104'].includes(cStat) ? 'Autorizada' : 'Rejeitada',
            chave,
            cStat: cStat,
            protocolo,
          },
          hora: moment().format('HH:mm'),
        },
      });

      Toast.show({
        type: dataPedido.offline ? ALERT_TYPE.SUCCESS : ['100', '104'].includes(cStat) ? ALERT_TYPE.SUCCESS : ALERT_TYPE.WARNING,
        title: 'Envio de nota',
        textBody: dataPedido.offline ? 'Nota em contingência gerada com sucesso' : `${cStat} - ${xMotivo}`,
        autoClose: 1000
      });

      const printer = await getConfigPrinter();

      if (printer.automaticPrinter) {
        const situacao = dataPedido.offline ? 'Offline' : ['100', '104'].includes(cStat) ? 'Autorizada' : 'Rejeitada';
        const paramImpressao = situacao === 'Autorizada' ? chave : data.xmlSign;

        const retorno = await imprimirNota(paramImpressao!);

        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Imprimir nota',
          textBody: `Comando de impressão enviado`,
          autoClose: 1500
        });
      }

      if (response.isValid) {
        navigation.navigate('Dashboard');
      }
    }
  }

  async function paymentPedido() {
    setLoadPayment(true);

    if (dataPedido.total <= 0) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Pedido vazio',
        textBody: 'O pedido não possui produtos!',
      });
      setLoadPayment(false);
      return;
    }

    if (dataPedido.pagamento.value === 1) { //Dinheiro
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Pagamento realizado',
        textBody: 'Pagamento em dinheiro realizado com sucesso',
        autoClose: 1000
      });

      setLoadPayment(false);

      setTimeout(() => {
        setPay({
          id: uuid.v4(),
        })
        setPaymentCompleted(true);
      }, 1500)

      return;
    } else {
      const dataPayment = await generatePaymentPix(dataPedido);
      console.log('dataPayment', dataPayment);

      if (dataPayment.isValid) {
        console.log('Pagamento foi gerado', dataPayment.pix);
        setPay(dataPayment.pix);
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Erro',
          textBody: 'Não foi possível gerar o pagamento!',
        });
      }

      setTimeout(() => {
        checkPaymentPix(dataPayment.pix);
      }, 5000);

      setLoadPayment(false);
    }
  }

  async function checkPaymentPix({ id, bearer }) {
    if (paymentCompleted) return;

    const statusPayment = await verifyPaymentPix({ id, bearer });

    console.log(statusPayment);

    if (!statusPayment.isValid) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Erro',
        textBody: 'Não foi possível processar o pagamento!',
      });
    }

    const configPix = await getConfigPix();

    if (configPix.automaticPix) {
      setTimeout(() => {
        setPaymentCompleted(true);
        return;
      }, 8000)
    }

    const diff = Math.abs(new Date() - new Date(statusPayment.pix.createdAt));

    if (Math.floor(diff / 1000 / 60) >= 2) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Erro',
        textBody: 'Não foi possível processar o pagamento!',
      });
      setPay({});
      return;
    }

    if (statusPayment.pix.status.toLowerCase() === 'LIQUIDATED'.toLowerCase()) {
      setPaymentCompleted(true);
      return;
    }

    if (statusPayment.pix.status.toLowerCase() === 'REJECTED'.toLowerCase()) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Erro',
        textBody: 'Pagamento rejeitado!',
      });
      setPay({});
      return;
    }

    setTimeout(() => {
      checkPaymentPix({ id, bearer });
    }, 5000);
  }

  return (
    <View className="flex items-center w-full bg-emerald-500 h-full">
      <Pressable
        className="absolute top-3 left-2 flex flex-row items-center rounded-full p-1"
        onPress={() => {
          navigation.navigate('Dashboard');
        }}
      >
        <Icon name="chevron-left" size={28} />
      </Pressable>

      <View className="absolute top-4">
        <Text className="text-4xl font-bold text-white">Pedido</Text>
      </View>

      <View className="w-full h-full mt-24 rounded-t-lg">
        <View className="bg-gray-100 rounded-t-full p-4 items-center">
          <Text className="font-bold text-2xl text-gray-400">Adicionar pedido</Text>
        </View>

        <View className={`flex flex-col bg-gray-100 ${!showButtonFinishPayment ? 'h-full' : ''}`}>
          <FormPedido dataPedido={dataPedido} setDataPedido={setDataPedido} showButtonFinishPayment={showButtonFinishPayment} setShowButtonFinishPayment={setShowButtonFinishPayment} />
          {showButtonFinishPayment && (
            <Pressable
              className="items-center rounded-full p-4 bg-emerald-950 m-6"
              onPress={paymentPedido}
            >
              {loadPayment ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-bold text-white">Pagar</Text>
              )}
            </Pressable>
          )}
        </View>

        {pay.id && (
          <View className="w-full h-screen absolute mt-16 z-40">
            <View className="bg-gray-200 rounded-t-full p-4 items-center">
              <Text className="font-bold text-2xl text-gray-400">Pagamento</Text>
            </View>
            <View className="h-full bg-gray-200 items-center">
              {paymentCompleted && (
                <View className="items-center justify-center  w-full p-4">
                  <Text className="text-xl font-bold my-2">Pagamento efetuado com sucesso!</Text>
                  <Icon name="done" size={140} color={'green'}/>
                  <Pressable
                    className="items-center rounded-full p-4 bg-emerald-950 m-6 w-full"
                    onPress={savePedido}
                  >
                    <Text className="text-lg font-bold text-white">Finalizar Pedido</Text>
                  </Pressable>
                </View>
              )}

              {(dataPedido?.pagamento?.value === 17 && !paymentCompleted) && (
                <View className="items-center justify-center h-96 w-96 my-6">
                  <Text className="py-4 text-black">Realize seu pagamento via PIX!</Text>
                  <View className="mt-2">
                    <Text className="text-3xl font-bold text-black">
                      R$
                      {Number(dataPedido.total).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  </View>
                  <Image
                    source={{
                      uri: `https://pix.tecnospeed.com.br/api/v1/qr/${pay.id}?type=png`,
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover',
                    }}
                  />

                  <Pressable
                    className="items-center rounded-full p-4 bg-emerald-950 m-6 w-full"
                    onPress={() => {
                      setPaymentCompleted(true)
                    }}
                  >
                    <Text className="text-lg font-bold text-white">Pular QRCode</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default React.memo(AddPedido);
