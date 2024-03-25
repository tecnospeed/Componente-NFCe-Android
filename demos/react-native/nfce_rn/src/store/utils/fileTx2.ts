

export function fileTX2() {

    const text = `
formato=tx2
INCLUIR
Id_A03=0
versao_A02=4.00
cUF_B02=41
cNF_B03=3500
natOp_B04=60NDA MERC.ADQ.REC.TERC
mod_B06=65
serie_B07=107
nNF_B08=10
dhEmi_B09=2023-08-31T10:04:00-03:00
tpNF_B11=1
idDest_B11a=1
cMunFG_B12=4115200
tpImp_B21=4
tpEmis_B22=1
cDV_B23=0
tpAmb_B24=2
finNFe_B25=1
indFinal_B25a=1
indPres_B25b=1
procEmi_B26=0
verProc_B27=000
CRT_C21=3
CNPJ_C02=29062609000177
xNome_C03=Tecnospeed Teste
xFant_C04=fantasia
xLgr_C06=Duque de Caxias
nro_C07=101
xCpl_C08=17 andar
xBairro_C09=Centro
cMun_C10=4115200
xMun_C11=Maringa
UF_C12=PR
CEP_C13=87000000
cPais_C14=1058
xPais_C15=BRASIL
IE_C17=9098793965
IEST_C18=
indIEDest_E16a=9
vBC_W03=0.00
vICMS_W04=0.00
vICMSDeson_W04a=0.01
vBCST_W05=0.00
vST_W06=0.00
vProd_W07=1.00
vFrete_W08=0.00
vSeg_W09=0.00
vDesc_W10=0.10
vII_W11=0.00
vIPI_W12=0.00
vPIS_W13=0.00
vCOFINS_W14=0.00
vOutro_W15=0.01
vNF_W16=1.00
modFrete_X02=9
vTotTrib_W16a=0.00
vFCPUFDest_W04c=2234567891234.64
vICMSUFDest_W04e=2234567891234.64
vICMSUFRemet_W04g=3234567891234.64
INCLUIRITEM
nItem_H02=1
cEAN_I03=SEM GTIN
cProd_I02=927803
xProd_I04=NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL
NCM_I05=02032900
CFOP_I08=5101
uCom_I09=UN
qCom_I10=1.00
vUnCom_I10a=1.00
vProd_I11=1.00
cEANTrib_I12=SEM GTIN
uTrib_I13=UN
qTrib_I14=1.0000
vUnTrib_I14a=1.00
vDesc_I17=0.10
vOutro_I17a=0.01
indTot_I17b=1
orig_N11=0
CST_N12=41
cBenef_I05f=PR800000
vICMSDeson_N28a=0.01
motDesICMS_N28=9
infAdProd_V01=teste com erro, erro
cProdANVISA_K01a=ISENTO
vPMC_K06=1.50
infAdProd_V01=teste teste teste teste teste teste teste teste teste teste teste
SALVARITEM
infCpl_Z03=Para gerar o arquivo de integração utilizando| Componente DataSets ou um arquivo TX2,| é necessário seguir o Dicionário de Dados.| Este artigo mostrará como ler as colunas deste dicionário, como iniciar e concluir um arquivo e como informar os grupos que podem se repetir.
CNPJ_ZD02=08187168000160
xContato_ZD04=Nome do Contato
email_ZD05=zanatalarissamorais@gmail.com
fone_ZD06=41999999999
INCLUIRPARTE=YA
tPag_YA02=02
vPag_YA03=2.00
tpIntegra_YA04a=1
CNPJ_YA05=99999999000191
tBand_YA06=01
cAut_YA07=180003
SALVARPARTE=YA
vTroco_YA09=1.00
vFCP_W04h=0.00
vFCPST_W06a=0.00
vFCPSTRet_W06b=0.00
vIPIDevol_W12a=0.00
SALVAR
`

    const CRLF = '\r\n';
    return text
}