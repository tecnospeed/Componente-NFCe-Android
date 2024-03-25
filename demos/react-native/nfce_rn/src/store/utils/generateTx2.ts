import moment from "moment";
import { Item, Pedido } from "../pedidos/types";
import { createInvoiceNumber, getInvoiceNumber, getInvoiceSerie } from "../config-nota";

const CRLF = '\r\n';

function formatDate() {
  const date = moment().format('YYYY-MM-DDTHH:mm:ssZ');
  return date;
}

function formatNumber(value: number) {
  const formattedValue = Number(value).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formattedValue.replaceAll(',', '.');
}

export async function generateTx2(data: Pedido) {
  const tx2: string[] = [];

  const { serieInvoice } = await getInvoiceSerie() || 0;
  const { numberInvoice } = await getInvoiceNumber() || 0;

  const nextNumberInvoice = Number(numberInvoice) + 1;
  console.log('numero nota:' + nextNumberInvoice);


  await createInvoiceNumber(nextNumberInvoice.toString());

  tx2.push("formato=tx2");
  tx2.push("INCLUIR");
  tx2.push("versao_A02=4.00");
  tx2.push("cUF_B02=41"); //Config
  tx2.push("cNF_B03=3500");
  tx2.push("natOp_B04=VENDA.MERC.ADQ.REC.TERC");
  tx2.push("mod_B06=65");
  tx2.push("serie_B07=" + serieInvoice);
  tx2.push("nNF_B08=" + nextNumberInvoice);
  tx2.push("dhEmi_B09=" + formatDate()); //2022-09-19T16:26:00-03:00
  tx2.push("tpNF_B11=1");
  tx2.push("idDest_B11a=1");
  tx2.push("cMunFG_B12=4115200"); //Config
  tx2.push("tpImp_B21=4");
  tx2.push("tpAmb_B24=2"); //Config
  tx2.push("finNFe_B25=1");
  tx2.push("indFinal_B25a=1"); //CPF ou não
  tx2.push("indPres_B25b=1");
  tx2.push("procEmi_B26=0");
  tx2.push("verProc_B27=000");

  if (data.offline) {
    tx2.push("tpEmis_B22=9");
    tx2.push("dhCont_B28=" + formatDate());
    tx2.push("xJust_B29=Problemas de comunicacao com a sefaz");
  } else {
    tx2.push("tpEmis_B22=1");
  }

  //Emitente
  tx2.push("CNPJ_C02=29062609000177");
  tx2.push("xNome_C03=Tecnospeed DFe Suite");
  tx2.push("xFant_C04=Tecnospeed DFe Suite");
  tx2.push("xLgr_C06=Rua Vitorio Balani");
  tx2.push("nro_C07=1211");
  tx2.push("xCpl_C08=Casa");
  tx2.push("xBairro_C09=Zona 05");
  tx2.push("cMun_C10=4115200");
  tx2.push("xMun_C11=Maringa");
  tx2.push("UF_C12=PR");
  tx2.push("CEP_C13=87005250");
  tx2.push("cPais_C14=1058");
  tx2.push("xPais_C15=Brasil");
  tx2.push("IE_C17=9098793965");
  tx2.push("CRT_C21=3");

  //Destinatario
  tx2.push("indIEDest_E16a=9"); // sem cliente

  const items = data.items_pedidos ? data.items_pedidos : [] as Item[];

  //Itens
  for (var i = 0; i < items.length; i++) {
    tx2.push("INCLUIRITEM");
    tx2.push("nItem_H02=" + (i + 1));
    tx2.push("cProd_I02=" + items[i].id);
    tx2.push("cProd_I02=" + items[i].id);
    tx2.push("cEAN_I03=SEM GTIN");
    tx2.push("xProd_I04=NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL");
    tx2.push("NCM_I05=21069090");
    tx2.push("CFOP_I08=5101");
    tx2.push("uCom_I09=UN");
    tx2.push("qCom_I10=" + formatNumber(items[i].qtd));
    tx2.push("vUnCom_I10a=" + formatNumber(items[i].preco));
    tx2.push("vProd_I11=" + formatNumber(items[i].qtd * items[i].preco));
    tx2.push("cEANTrib_I12=SEM GTIN");
    tx2.push("uTrib_I13=UN");
    tx2.push("qTrib_I14=" + formatNumber(items[i].qtd));
    tx2.push("vUnTrib_I14a=" + formatNumber(items[i].preco));
    tx2.push("indTot_I17b=1");

    //ICMS
    tx2.push("orig_N11=0");
    tx2.push("CST_N12=41");
    tx2.push("cBenef_I05f=PR800000");
    tx2.push("SALVARITEM");
  }

  //Totais
  tx2.push("vBC_W03=0.00");
  tx2.push("vICMS_W04=0.00");
  tx2.push("vICMSDeson_W04a=0.00");
  tx2.push("vFCP_W04h=0.00");
  tx2.push("vBCST_W05=0.00");
  tx2.push("vST_W06=0.00");
  tx2.push("vFCPST_W06a=0.00");
  tx2.push("vFCPSTRet_W06b=0.00");
  tx2.push("vProd_W07=" + formatNumber(data.total));
  tx2.push("vFrete_W08=0.00");
  tx2.push("vSeg_W09=0.00");
  tx2.push("vDesc_W10=0.00");
  tx2.push("vII_W11=0.00");
  tx2.push("vIPI_W12=0.00");
  tx2.push("vIPIDevol_W12a=0.00");
  tx2.push("vPIS_W13=0.00");
  tx2.push("vCOFINS_W14=0.00");
  tx2.push("vOutro_W15=0.00");
  tx2.push("vNF_W16=" + formatNumber(data.total));
  tx2.push("vTotTrib_W16a=0.00");

  //Transporte
  tx2.push("modFrete_X02=9");

  //Pagamento
  tx2.push("INCLUIRPARTE=YA");
  tx2.push("tPag_YA02=" + data.pagamento.value.toString().padStart(2, '0'));
  tx2.push("vPag_YA03=" + formatNumber(data.total));
  if (data.pagamento.value.toString() == '17')
    tx2.push("tpIntegra_YA04a=2");
  tx2.push("SALVARPARTE=YA");

  //Responsavel Tecnico
  tx2.push("CNPJ_ZD02=29062609000177");
  tx2.push("xContato_ZD04=Nome do Contato");
  tx2.push("email_ZD05=tecnospeed@tecnopeed.com.br");
  tx2.push("fone_ZD06=41999999999");

  tx2.push("SALVAR");

  return tx2.join(CRLF);
}
