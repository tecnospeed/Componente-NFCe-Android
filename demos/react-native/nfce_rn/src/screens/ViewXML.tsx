import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, ScrollView} from 'react-native';
import {Pedido} from '../store/pedidos/types';
import beautify from 'xml-beautifier';
import { cancelarNota, consultarNota, enviarNota, imprimirNota } from "../store/utils/nota";
import { updatePedido } from "../store/pedidos";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import moment from "moment";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";

interface Props {
  route: {
    params: Pedido;
  };
}

function formatDate() {
  const date = moment().format('YYYY-MM-DDTHH:mm:ss');
  return date;
}

const ViewXML = ({route}: Props) => {
  const navigation = useNavigation();

  const [dataPedido, setDataPedido] = useState({} as Pedido);

  useEffect(() => {
    setDataPedido(route.params);
  }, [])

  const {xml} = route.params.nota;
  const result = beautify(xml);

  return (
    <View className="flex items-center bg-emerald-300 h-full p-4">
      <Pressable
        className="absolute left-2 mt-2 flex flex-row items-center rounded-full"
        onPress={() => {
          navigation.navigate('Dashboard');
        }}
      >
        <Icon name="chevron-left" size={28} />
      </Pressable>

      <View className="w-full mb-4 mt-4 pt-2">
        <Text className="my-1"><Text className="font-bold text-base">Chave nota:</Text> {dataPedido.nota?.chave}</Text>
        <Text className="my-1"><Text className="font-bold">Situação nota:</Text> {dataPedido.nota?.situacao}</Text>

        {(dataPedido.nota?.situacao === 'Autorizada' || dataPedido.nota?.situacao === 'Offline') &&
          <Pressable
            className="items-center rounded-full p-1 bg-emerald-950 p-2 my-1"
            onPress={async () => {
              const situacao = dataPedido.nota?.situacao;
              const paramImpressao = situacao === 'Autorizada' ? dataPedido.nota?.chave : dataPedido.nota?.xmlAssinado;

              const retorno = await imprimirNota(paramImpressao!);

              Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Imprimir nota',
                textBody: `Comando de impressão enviado`,
                autoClose: 1500
              });
            }}
          >
            <Text className="mx-2 text-white">Imprimir nota</Text>
          </Pressable>
        }

        <Pressable
          className="items-center rounded-full p-1 bg-emerald-950 p-2 my-1"
          onPress={async () => {
            const retorno = await consultarNota(dataPedido.nota?.chave!);

            const cStat = retorno.match(/<cStat>(.+?)<\/cStat>/)![1] || '';
            const xMotivo = retorno.match(/<xMotivo>(.*?)<\/xMotivo>/)![1] || '';

            Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: 'Consultar nota',
              textBody: `${cStat} - ${xMotivo}`,
              autoClose: 1500
            });
          }}
        >
          <Text className="mx-2 text-white">Consultar nota</Text>
        </Pressable>

        {dataPedido.nota?.situacao !== 'Cancelada' && <Pressable
          className="items-center rounded-full p-1 bg-emerald-950 p-2 my-1"
          onPress={async () => {
            const retorno = await cancelarNota(
              dataPedido.nota?.chave!,
              dataPedido.nota?.protocolo!,
              'Emissão errada de nota fiscal, cancelar',
              formatDate(),
              '1',
              '-03:00',
              '001'
            );

            const retEvento = retorno.match(/<retEvento(.|[\r\n])*?<\/retEvento>/)![0] || '';
            const cStat = retEvento.match(/<cStat>(.+?)<\/cStat>/)![1] || '';
            const xMotivo = retEvento.match(/<xMotivo>(.*?)<\/xMotivo>/)![1] || '';

            if (['135', '136'].includes(cStat)) {
              Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Cancelar nota',
                textBody: `${cStat} - ${xMotivo}`,
                autoClose: 1500
              });

              const pedido = {
                ...dataPedido,
                nota: {
                  ...dataPedido.nota,
                  situacao: 'Cancelada'
                },
              };

              await updatePedido({
                pedido
              });

              setDataPedido(pedido);
            } else {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Cancelar nota',
                textBody: `${cStat} - ${xMotivo}`,
                autoClose: 5000
              });
            }
          }}
        >
          <Text className="mx-2 text-white">Cancelar nota</Text>
        </Pressable>}

        {(dataPedido.offline && !dataPedido.nota?.protocolo && dataPedido.nota?.situacao === 'Offline') && <Pressable
          className="items-center rounded-full p-1 bg-emerald-950 p-2 my-1"
          onPress={async () => {
            const retorno = await enviarNota(dataPedido.nota?.xmlAssinado!);

            const cStat = retorno.match(/<cStat>(.+?)<\/cStat>/)![1] || '';
            const protocolo = ['100', '104'].includes(cStat) ? retorno.match(/<nProt>(.*)<\/nProt>/)![1]: '';
            const xMotivo = retorno.match(/<xMotivo>(.*?)<\/xMotivo>/)![1] || '';


            const pedido = {
              ...dataPedido,
              nota: {
                ...dataPedido.nota,
                xmlRetorno: retorno,
                situacao: ['100', '104'].includes(cStat) ? 'Autorizada' : 'Rejeitada',
                cStat: cStat,
                protocolo,
              },
            };

            const response = await updatePedido({
              pedido
            });

            if (response.isValid) {
              setDataPedido(pedido)

              Toast.show({
                type: ['100', '104'].includes(cStat) ? ALERT_TYPE.SUCCESS : ALERT_TYPE.WARNING,
                title: 'Envio de nota',
                textBody: `${cStat} - ${xMotivo}`,
                autoClose: ['100', '104'].includes(cStat) ? 1000 : 5000
              });
            }
          }}
        >
          <Text className="mx-2 text-white">Enviar nota offline</Text>
        </Pressable>}


      </View>
      <ScrollView className="w-full mb-4 p-4 border-[1px] border-emerald-950 rounded-md">
        <Text className="font-bold text-lg">XML</Text>
          <Text>{result}</Text>
      </ScrollView>
    </View>
  );
};

export default React.memo(ViewXML);
