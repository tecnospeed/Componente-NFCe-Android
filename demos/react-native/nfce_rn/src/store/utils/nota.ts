import { NativeModules } from "react-native";
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { generateTx2 } from "./generateTx2";
import { Pedido } from "../pedidos/types";
const { NFCeModule } = NativeModules;

async function converterLoteParaXml(pedido: Pedido): Promise<string> {
  const tx2 = await generateTx2(pedido);
  const schemaVersion = 'pl_009g';

  console.log('tx2: ', tx2);

  try {
    const xml = await NFCeModule.converterLoteParaXml(tx2, schemaVersion)
    console.log('XML gerado com sucesso: ' + xml);

    return xml;
  } catch (error) {
    console.log('Erro ao gerar xml por tx2:', error);
    return '';
  }
}

async function assinarXML(xml: string): Promise<string> {

  function verifyErrors(error: string): boolean {
    const errors = ['enoent', 'invalid password']
    for (const err of errors) {
        if (error.includes(err)) {
            return true;
        }
    }

    return false;
  }

  if (!xml) {
    Toast.show({
      type: ALERT_TYPE.WARNING,
      title: 'Atenção',
      textBody: 'Ainda não existe um xml, converte o lote primeiro!',
    });

    return '';
  }

  try {
    const xmlAssinado: string = await NFCeModule.assinarNota(xml)

    if (verifyErrors(xmlAssinado.toLocaleLowerCase())) {
      console.log('Erro ao assinar xml', xmlAssinado);
      return '';
    }

    console.log('XML assinado com sucesso: ' + xmlAssinado);

    return xmlAssinado;
  } catch (error) {
    console.log('Erro ao assinar xml', error);
    return '';
  }
}

export async function enviarNota(xmlSign: string): Promise<string> {
  if (!xmlSign) {
    Toast.show({
      type: ALERT_TYPE.WARNING,
      title: 'Atenção',
      textBody: 'Ainda não existe um xml assinado!',
    });

    return '';
  }

  try {
    const xmlRetorno = await NFCeModule.enviarNota('0001', xmlSign)
    console.log('Nota enviada com sucesso: ' + xmlRetorno);

    return xmlRetorno;
  } catch (error) {
    console.log('Erro ao enviar nota', error);
    return ''
  }
}

export async function consultarNota(chaveNota: string): Promise<string> {
  try {
    const xmlConsulta = await NFCeModule.consultar(chaveNota)
    console.log('Nota consultada com sucesso: ' + xmlConsulta);

    return xmlConsulta;
  } catch (error) {
    console.log('Erro ao consultar nota', error);
    return ''
  }
}

export async function imprimirNota(chaveNotaOuXmlContingencia: string): Promise<string> {
  try {
    const impressao = await NFCeModule.imprimir(chaveNotaOuXmlContingencia)
    console.log(impressao);

    return impressao;
  } catch (error) {
    console.log('Erro ao imprimir nota', error);
    return ''
  }
}

export async function cancelarNota(
  chaveNota: string,
  protocolo: string,
  justificativa: string,
  dataHoraEvento: string,
  sequenciaEvento: string,
  fusoHorario: string,
  numeroLote: string
): Promise<string> {
  try {
    const xmlCancelamento = await NFCeModule.cancelar(chaveNota, protocolo, justificativa, dataHoraEvento, sequenciaEvento, fusoHorario, numeroLote)
    console.log('Nota cancelada com sucesso: ' + xmlCancelamento);

    return xmlCancelamento;
  } catch (error) {
    console.log('Erro ao cancelar nota', error);
    return ''
  }
}

export async function emitirNota(pedido: Pedido) {
  const xml = await converterLoteParaXml(pedido);
  const xmlSign = await assinarXML(xml);

  if (xmlSign !== '') {
    const nota = pedido.offline ? xmlSign : await enviarNota(xmlSign);

    return { xml, xmlSign, nota };
  }

  return '';
}
