package com.example.untitled;

import io.flutter.Log;
import io.flutter.embedding.android.FlutterFragmentActivity;
import io.flutter.embedding.engine.FlutterEngine;
import io.flutter.plugin.common.MethodCall;
import io.flutter.plugin.common.MethodChannel;
import io.flutter.plugins.GeneratedPluginRegistrant;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;

import android.content.Intent;
import android.os.Build;
import android.os.Environment;
import android.text.format.DateFormat;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Date;
import java.util.Objects;

import com.tecnospeed.nfce.core.TspdNFCe;
import com.tecnospeed.nfce.internal.utils.types.TspdNFCeType;

public class MainActivity extends FlutterFragmentActivity {
    private static final String CHANNEL = "app.channel.shared.data";
    private final TspdNFCe nfce = new TspdNFCe();

    @Override
    public void configureFlutterEngine(@NonNull FlutterEngine flutterEngine) {
        GeneratedPluginRegistrant.registerWith(flutterEngine);

        new MethodChannel(
                flutterEngine.getDartExecutor().getBinaryMessenger(), CHANNEL)
                .setMethodCallHandler((call, result) -> {

                    switch (call.method) {
                        case "config":
                            handleConfig(result, call);
                            break;
                        case "certificate":
                            handleCertificate(result, call.argument("path"));
                            break;
                        case "converterLoteParaXml":
                            handleConverterLoteParaXml(result);
                            break;
                        case "assinar":
                            handleAssinar(result, call.argument("xml"));
                            break;
                        case "consultar":
                            handleConsultar(result, call.argument("chaveNota"));
                            break;
                        case "imprimir":
                            handleImprimir(result, call.argument("chaveNota"));
                            break;
                        case "enviarNota":
                            handleCheckEnviarNota(result, call.argument("loteNotas"));
                            break;
                        case "checkConfig":
                            handleCheckConfig(result);
                            break;
                        case "getConfig":
                            handleGetConfig(result);
                            break;
                        case "statusServico":
                            handleStatusServico(result);
                            break;
                        case "cancelar":
                            handleCancelar(result, call);
                            break;
                        default:
                            result.notImplemented();
                            break;
                    }

                });

        ActivityResultLauncher<Intent> launcher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(), nfce::onResult);

        nfce.setLauncher(launcher);
        nfce.setAppPackageName("com.example.untitled");
    }

    private void handleStatusServico(MethodChannel.Result callback) {
        nfce.statusServico().thenAccept(result -> {
            Log.d("statusServico", result);
            callback.success(result);
        }).exceptionally(error -> {
            String errorMessage = Objects.requireNonNull(error.getCause()).getMessage();

            if (errorMessage != null) Log.d("statusServicoError", errorMessage);

            callback.error("statusServicoError", errorMessage, null);
            return null;
        });
    }

    private void handleCheckEnviarNota(MethodChannel.Result callback, String loteNotas) {
        nfce.enviarNota("001", loteNotas).thenAccept(result -> {
            Log.d("enviarNota", result);
            callback.success(result);
        }).exceptionally(error -> {
            String errorMessage = Objects.requireNonNull(error.getCause()).getMessage();

            if (errorMessage != null) Log.d("enviarNotaError", errorMessage);

            callback.error("enviarNotaError", errorMessage, null);
            return null;
        });
    }

    private void handleImprimir(MethodChannel.Result callback, String chaveNota) {
        nfce.imprimir(chaveNota).thenAccept(result -> {
            Log.d("imprimir", result);
            callback.success(result);
        }).exceptionally(error -> {
            String errorMessage = Objects.requireNonNull(error.getCause()).getMessage();

            if (errorMessage != null) Log.d("imprimirError", errorMessage);

            callback.error("imprimirError", errorMessage, null);
            return null;
        });
    }

    private void handleCancelar(MethodChannel.Result callback, MethodCall call) {
        String chaveNota = call.argument("chaveNota");
        String protocolo = call.argument("protocolo");
        String justificativa = call.argument("justificativa");
        String dataHoraEvento = call.argument("dataHoraEvento");
        String sequenciaEvento = call.argument("sequenciaEvento");
        String fusoHorario = call.argument("fusoHorario");
        String numeroLote = call.argument("numeroLote");

        nfce.cancelar(
                chaveNota,
                protocolo,
                justificativa,
                dataHoraEvento,
                sequenciaEvento,
                fusoHorario,
                numeroLote
        ).thenAccept(result -> {
            Log.d("cancelar", result);
            callback.success(result);
        }).exceptionally(error -> {
            String errorMessage = Objects.requireNonNull(error.getCause()).getMessage();

            if (errorMessage != null) Log.d("cancelarError", errorMessage);

            callback.error("cancelarError", errorMessage, null);
            return null;
        });
    }

    private void handleConfig(MethodChannel.Result callback, MethodCall call) {

        String cnpjSoftwareHouse = call.argument("cnpjSoftwareHouse");
        String tokenSoftwareHouse = call.argument("tokenSoftwareHouse");
        String senhaCertificado = call.argument("senhaCertificado");
        String idTokenCSC = call.argument("idTokenCSC");
        String tokenCSC = call.argument("tokenCSC");
        String portaComunicacao = call.argument("portaComunicacao");

        nfce.configurarSoftwareHouse(cnpjSoftwareHouse, tokenSoftwareHouse);

        nfce.CNPJ(cnpjSoftwareHouse);
        nfce.CnpjSoftwareHouse(cnpjSoftwareHouse);
        nfce.TokenSoftwareHouse(tokenSoftwareHouse);
        nfce.SenhaCertificado(senhaCertificado);
        nfce.Ambiente(TspdNFCeType.Ambiente.HOMOLOGACAO);
        nfce.VersaoManual(TspdNFCeType.VersaoManual.vm60);
        nfce.UF(TspdNFCeType.UF.PR);
        nfce.IdTokenCSC(idTokenCSC);
        nfce.TokenCSC(tokenCSC);
        nfce.ModeloImpressora(TspdNFCeType.ModeloImpressora.LEOPARDO_A7);
        nfce.PortaComunicacao(portaComunicacao);

        nfce.saveConfig().thenAccept((result) -> {
            Log.d("loadConfig", "Configurações carregadas com sucesso");
            callback.success("Configurações carregadas com sucesso");
        }).exceptionally(error -> {
            String errorMessage = Objects.requireNonNull(error.getCause()).getMessage();

            if (errorMessage != null) Log.d("loadConfigError", errorMessage);

            callback.error("loadConfigError", errorMessage, null);
            return null;
        });
    }

    private void handleCertificate(MethodChannel.Result callback, String path) {

        nfce.CaminhoCertificado(path);

        nfce.saveConfig().thenAccept((result) -> {
            Log.d("handleCertificate loadConfig", "Certificado carregado com sucesso");
            callback.success("Certificado carregado com sucesso");
        });

//        InputStream input_stream_certificado = null;
//
//        try {
//            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//                input_stream_certificado = Files.newInputStream(getFileCertificate().toPath());
//            }
//
//            Log.d("nfce", "certificado encontrado e carregado");
//        } catch (Exception e) {
//            Log.d("nfce", "ERROR: " + Objects.requireNonNull(e.getCause()).getMessage());
//        }
//
//        nfce.configurarCertificado(input_stream_certificado).thenAccept(result -> {
//            Log.d("configurarCertificado", result);
//            callback.success(result);
//        }).exceptionally(error -> {
//            String errorMessage = Objects.requireNonNull(error.getCause()).getMessage();
//
//            if (errorMessage != null) Log.d("configurarCertificadoError", errorMessage);
//
//            callback.error("configurarCertificadoError", errorMessage, null);
//            return null;
//        });
    }

    private void handleConverterLoteParaXml(MethodChannel.Result callback) {

        String tx2 =
                "formato=tx2\n" +
                        "INCLUIR\n" +
                        "Id_A03=0\n" +
                        "versao_A02=4.00\n" +
                        "cUF_B02=41\n" +
                        "cNF_B03=3555\n" +
                        "natOp_B04=60NDA MERC.ADQ.REC.TERC\n" +
                        "mod_B06=65\n" +
                        "serie_B07=125\n" + // <-------------------------- ALTERAR
                        "nNF_B08=10\n" +
                        "dhEmi_B09={{DATA_EMIS}}\n" +
                        "tpNF_B11=1\n" +
                        "idDest_B11a=1\n" +
                        "cMunFG_B12=4115200\n" +
                        "tpImp_B21=4\n" +
                        "tpEmis_B22=1\n" +
                        "cDV_B23=0\n" +
                        "tpAmb_B24=2\n" +
                        "finNFe_B25=1\n" +
                        "indFinal_B25a=1\n" +
                        "indPres_B25b=1\n" +
                        "procEmi_B26=0\n" +
                        "verProc_B27=000\n" +
                        "CRT_C21=3\n" +
                        "CNPJ_C02=29062609000177\n" + // <-------------------------- ALTERAR
                        "xNome_C03=Tecnospeed Teste\n" +
                        "xFant_C04=fantasia\n" +
                        "xLgr_C06=Duque de Caxias\n" +
                        "nro_C07=101\n" +
                        "xCpl_C08=17 andar\n" +
                        "xBairro_C09=Centro\n" +
                        "cMun_C10=4115200\n" +
                        "xMun_C11=Maringa\n" +
                        "UF_C12=PR\n" +
                        "CEP_C13=87000000\n" +
                        "cPais_C14=1058\n" +
                        "xPais_C15=BRASIL\n" +
                        "IE_C17=9098793965\n" + // <-------------------------- ALTERAR
                        "IEST_C18=\n" +
                        "indIEDest_E16a=9\n" +
                        "vBC_W03=0.00\n" +
                        "vICMS_W04=0.00\n" +
                        "vICMSDeson_W04a=0.01\n" +
                        "vBCST_W05=0.00\n" +
                        "vST_W06=0.00\n" +
                        "vProd_W07=1.00\n" +
                        "vFrete_W08=0.00\n" +
                        "vSeg_W09=0.00\n" +
                        "vDesc_W10=0.10\n" +
                        "vII_W11=0.00\n" +
                        "vIPI_W12=0.00\n" +
                        "vPIS_W13=0.00\n" +
                        "vCOFINS_W14=0.00\n" +
                        "vOutro_W15=0.01\n" +
                        "vNF_W16=1.00\n" +
                        "modFrete_X02=9\n" +
                        "vTotTrib_W16a=0.00\n" +
                        "vFCPUFDest_W04c=2234567891234.64\n" +
                        "vICMSUFDest_W04e=2234567891234.64\n" +
                        "vICMSUFRemet_W04g=3234567891234.64\n" +
                        "INCLUIRITEM\n" +
                        "nItem_H02=1\n" +
                        "cEAN_I03=SEM GTIN\n" +
                        "cProd_I02=927803\n" +
                        "xProd_I04=NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL\n" +
                        "NCM_I05=02032900\n" +
                        "CFOP_I08=5101\n" +
                        "uCom_I09=UN\n" +
                        "qCom_I10=1.00\n" +
                        "vUnCom_I10a=1.00\n" +
                        "vProd_I11=1.00\n" +
                        "cEANTrib_I12=SEM GTIN\n" +
                        "uTrib_I13=UN\n" +
                        "qTrib_I14=1.0000\n" +
                        "vUnTrib_I14a=1.00\n" +
                        "vDesc_I17=0.10\n" +
                        "vOutro_I17a=0.01\n" +
                        "indTot_I17b=1\n" +
                        "orig_N11=0\n" +
                        "CST_N12=41\n" +
                        "cBenef_I05f=PR800000\n" +
                        "vICMSDeson_N28a=0.01\n" +
                        "motDesICMS_N28=9\n" +
                        "infAdProd_V01=teste com erro, erro\n" +
                        "cProdANVISA_K01a=ISENTO\n" +
                        "vPMC_K06=1.50\n" +
                        "infAdProd_V01=teste teste teste teste teste teste teste teste teste teste teste\n" +
                        "SALVARITEM\n" +
                        "infCpl_Z03=Para gerar o arquivo de integração utilizando| Componente DataSets ou um arquivo TX2,| é necessário seguir o Dicionário de Dados.| Este artigo mostrará como ler as colunas deste dicionário, como iniciar e concluir um arquivo e como informar os grupos que podem se repetir.\n" +
                        "CNPJ_ZD02=08187168000160\n" +
                        "xContato_ZD04=Nome do Contato\n" +
                        "email_ZD05=zanatalarissamorais@gmail.com\n" +
                        "fone_ZD06=41999999999\n" +
                        "INCLUIRPARTE=YA\n" +
                        "tPag_YA02=02\n" +
                        "vPag_YA03=2.00\n" +
                        "tpIntegra_YA04a=1\n" +
                        "CNPJ_YA05=99999999000191\n" +
                        "tBand_YA06=01\n" +
                        "cAut_YA07=180003\n" +
                        "SALVARPARTE=YA\n" +
                        "vTroco_YA09=1.00\n" +
                        "vFCP_W04h=0.00\n" +
                        "vFCPST_W06a=0.00\n" +
                        "vFCPSTRet_W06b=0.00\n" +
                        "vIPIDevol_W12a=0.00\n" +
                        "SALVAR\n";


        //2024-02-09T12:29:47-03:00
        tx2 = tx2.replace(
                "{{DATA_EMIS}}",
                DateFormat.format("yyyy-MM-dd'T'HH:mm:ss", new Date()) + "-03:00"
        );

        nfce.converterLoteParaXml(tx2, "pl_009g").thenAccept(xml -> {
            Log.d("converterLoteParaXml", xml);
            callback.success(xml);
        }).exceptionally(error -> {
            String errorMessage = Objects.requireNonNull(error.getCause()).getMessage();

            if (errorMessage != null) Log.d("converterLoteParaXmlError", errorMessage);

            callback.error("converterLoteParaXmlError", errorMessage, null);
            return null;
        });
    }

    private void handleAssinar(MethodChannel.Result callback, String xml) {
        nfce.assinarNota(xml).thenAccept(result -> {
            Log.d("assinarNota", result);
            callback.success(result);
        }).exceptionally(error -> {
            String errorMessage = Objects.requireNonNull(error.getCause()).getMessage();

            if (errorMessage != null) Log.d("assinarNotaError", errorMessage);

            callback.error("assinarNotaError", errorMessage, null);
            return null;
        });
    }

    private void handleConsultar(MethodChannel.Result callback, String chaveNota) {
        nfce.consultar(chaveNota).thenAccept(result -> {
            Log.d("consultar", result);
            callback.success(result);
        }).exceptionally(error -> {
            String errorMessage = Objects.requireNonNull(error.getCause()).getMessage();

            if (errorMessage != null) Log.d("consultarError", errorMessage);

            callback.error("consultarError", errorMessage, null);
            return null;
        });
    }

    private void handleCheckConfig(MethodChannel.Result callback) {
        nfce.checkConfig().thenAccept(result -> {
            Log.d("checkConfig", String.valueOf(result));
            callback.success(String.valueOf(result));
        }).exceptionally(error -> {
            String errorMessage = Objects.requireNonNull(error.getCause()).getMessage();

            if (errorMessage != null) Log.d("checkConfigError", errorMessage);

            callback.error("checkConfigError", errorMessage, null);
            return null;
        });
    }

    private void handleGetConfig(MethodChannel.Result callback) {
        nfce.getConfig().thenAccept(result -> {
            String obfuscateResult = result.replace(nfce.SenhaCertificado(), "*********");
            Log.d("getConfig", obfuscateResult);
            callback.success(obfuscateResult);
        }).exceptionally(error -> {
            String errorMessage = Objects.requireNonNull(error.getCause()).getMessage();

            if (errorMessage != null) Log.d("getConfigError", errorMessage);

            callback.error("getConfigError", errorMessage, null);
            return null;
        });
    }

    private static File getFileCertificate() {
        String pathExternalStorage = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath().concat("/");
        return new File(pathExternalStorage, "certificado.pfx");
    }
}
