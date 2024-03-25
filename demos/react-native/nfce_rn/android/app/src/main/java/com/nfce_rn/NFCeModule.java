package com.nfce_rn;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.tecnospeed.nfce.core.TspdNFCe;
import java.io.InputStream;

public class NFCeModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "NFCeModule";

    public NFCeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void certificado(Promise promise) {
        MainActivity main = (MainActivity) getCurrentActivity();
        TspdNFCe nfce = main.getNFCe();

        InputStream certificado = getCurrentActivity().getResources().openRawResource(R.raw.tecnospeed);

        try {
            nfce.configurarCertificado(certificado)
                    .thenAccept(result -> {
                        Log.d("NFCeModule", "Resultado configurar certificado: " + result);
                        promise.resolve(result);
                    });
        } catch (Exception e) {
            promise.reject("Erro ao enviar certificado: " + e.getMessage());
        }
    }

    @ReactMethod
    public void loadConfig(String config, Promise promise) {
        MainActivity main = (MainActivity) getCurrentActivity();
        TspdNFCe nfce = main.getNFCe();

        try {
            nfce.loadConfig(config)
                    .thenAccept(result -> {
                        Log.d("NFCeModule", "Resultado configurar componente: " + result);
                        promise.resolve("Componente configurado com sucesso!");
                    })
                    .exceptionally(error -> {
                        Log.d("NFCeModule", "Error: " + error.getCause().getMessage());
                        promise.reject("Erro ao carregar configurações: " +  error.getCause().getMessage());
                        return null;
                    });
        } catch (Exception e) {
            promise.reject("Erro ao salvar configurações: " + e.getMessage());
        }
    }

    @ReactMethod
    public void getConfig(Promise promise) {
        MainActivity main = (MainActivity) getCurrentActivity();
        TspdNFCe nfce = main.getNFCe();

        try {
            nfce.getConfig()
                    .thenAccept(result -> {
                        Log.d("NFCeModule", "Resultado buscar configurações componente: " + result);
                        promise.resolve(result);
                    })
                    .exceptionally(error -> {
                        Log.d("NFCeModule", "Error: " + error.getCause().getMessage());
                        promise.reject("Erro ao buscar configurações: " +  error.getCause().getMessage());
                        return null;
                    });
        } catch (Exception e) {
            promise.reject("Erro ao buscar configurações: " + e.getMessage());
        }
    }

    @ReactMethod
    public void converterLoteParaXml(String tx2, String versaoEsquema, Promise promise) {
        MainActivity main = (MainActivity) getCurrentActivity();
        TspdNFCe nfce = main.getNFCe();

        try {
            nfce.converterLoteParaXml(tx2, versaoEsquema)
                    .thenAccept(result -> {
                        Log.d("NFCeModule", "Converter lote para xml: " + result);
                        promise.resolve(result);
                    })
                    .exceptionally(error -> {
                        Log.d("NFCeModule", "Error: " + error.getCause().getMessage());
                        promise.reject("Erro ao converter lote: " +  error.getCause().getMessage());
                        return null;
                    });
        } catch (Exception e) {
            promise.reject("Erro ao converter lote: " + e.getMessage());
        }
    }

    @ReactMethod
    public void assinarNota(String xml, Promise promise) {
        MainActivity main = (MainActivity) getCurrentActivity();
        TspdNFCe nfce = main.getNFCe();

        try {
            nfce.assinarNota(xml)
                    .thenAccept(result -> {
                        Log.d("NFCeModule", "Assinar nota: " + result);
                        promise.resolve(result);
                    })
                    .exceptionally(error -> {
                        Log.d("NFCeModule", "Error: " + error.getCause().getMessage());
                        promise.reject("Erro ao assinar nota: " +  error.getCause().getMessage());
                        return null;
                    });
        } catch (Exception e) {
            promise.reject("Erro ao assinar nota: " + e.getMessage());
        }
    }
    
    @ReactMethod
    public void enviarNota(String numeroLote, String loteNotas, Promise promise) {
        MainActivity main = (MainActivity) getCurrentActivity();
        TspdNFCe nfce = main.getNFCe();

        try {
            nfce.enviarNota(numeroLote, loteNotas)
                    .thenAccept(result -> {
                        Log.d("NFCeModule", "Enviar nota: " + result);
                        promise.resolve(result);
                    })
                    .exceptionally(error -> {
                        Log.d("NFCeModule", "Error: " + error.getCause().getMessage());
                        promise.reject("Erro ao enviar nota: " +  error.getCause().getMessage());
                        return null;
                    });
        } catch (Exception e) {
            promise.reject("Erro ao enviar nota: " + e.getMessage());
        }
    }

    @ReactMethod
    public void configurarSoftwareHouse(String cnpjSh, String tokenSh, Promise promise) {
        MainActivity main = (MainActivity) getCurrentActivity();
        TspdNFCe nfce = main.getNFCe();

        try {
            nfce.configurarSoftwareHouse(cnpjSh, tokenSh);
            promise.resolve("");
        } catch (Exception e) {
            promise.reject("Erro ao configurar software house: " + e.getMessage());
        }
    }

    @ReactMethod
    public void statusServico(Promise promise) {
        MainActivity main = (MainActivity) getCurrentActivity();
        TspdNFCe nfce = main.getNFCe();

        try {
            nfce.statusServico().thenAccept(result -> {
                        Log.d("NFCeModule", "Status serviço: " + result);
                        promise.resolve(result);
                    })
                    .exceptionally(error -> {
                        Log.d("NFCeModule", "Error: " + error.getCause().getMessage());
                        promise.reject("Erro ao verificar status serviço: " +  error.getCause().getMessage());
                        return null;
                    });
        } catch (Exception e) {
            promise.reject("Erro ao validar status serviço: " + e.getMessage());
        }
    }

    @ReactMethod
    public void inutilizar(String ano, String cnpj, String modelo, String serie, String numeroInicial, String numeroFinal, String justificativa, Promise promise) {
        MainActivity main = (MainActivity) getCurrentActivity();
        TspdNFCe nfce = main.getNFCe();

        try {
            nfce.inutilizar(ano, cnpj, modelo, serie, numeroInicial, numeroFinal, justificativa).thenAccept(result -> {
                        Log.d("NFCeModule", "Inutlizar numeração: " + result);
                        promise.resolve(result);
                    })
                    .exceptionally(error -> {
                        Log.d("NFCeModule", "Error: " + error.getCause().getMessage());
                        promise.reject("Erro ao inutilizar numeração: " +  error.getCause().getMessage());
                        return null;
                    });
        } catch (Exception e) {
            promise.reject("Erro ao inutilizar a numeração: " + e.getMessage());
        }
    }

    @ReactMethod
    public void consultar(String chaveNota, Promise promise) {
        MainActivity main = (MainActivity) getCurrentActivity();
        TspdNFCe nfce = main.getNFCe();

        try {
            nfce.consultar(chaveNota).thenAccept(result -> {
                        Log.d("NFCeModule", "Consultar nota: " + result);
                        promise.resolve(result);
                    })
                    .exceptionally(error -> {
                        Log.d("NFCeModule", "Error: " + error.getCause().getMessage());
                        promise.reject("Erro ao consultar nota: " +  error.getCause().getMessage());
                        return null;
                    });
        } catch (Exception e) {
            promise.reject("Erro ao consultar nota: " + e.getMessage());
        }
    }

    @ReactMethod
    public void cancelar(String chaveNota, String protocolo, String justificativa, String dataHoraEvento, String sequenciaEvento, String fusoHorario, String numeroLote,Promise promise) {
        MainActivity main = (MainActivity) getCurrentActivity();
        TspdNFCe nfce = main.getNFCe();

        try {
            nfce.cancelar(chaveNota, protocolo, justificativa, dataHoraEvento, sequenciaEvento, fusoHorario, numeroLote).thenAccept(result -> {
                        Log.d("NFCeModule", "Cancelar nota: " + result);
                        promise.resolve(result);
                    })
                    .exceptionally(error -> {
                        Log.d("NFCeModule", "Error: " + error.getCause().getMessage());
                        promise.reject("Erro ao cancelar nota: " +  error.getCause().getMessage());
                        return null;
                    });
        } catch (Exception e) {
            promise.reject("Erro ao cancelar nota: " + e.getMessage());
        }
    }

    @ReactMethod
    public void imprimir(String chaveNotaOuXmlContingencia, Promise promise) {
        MainActivity main = (MainActivity) getCurrentActivity();
        TspdNFCe nfce = main.getNFCe();

        nfce.getConfig().thenAccept(result -> {
            Log.d("NFCeModule", "modeloImpressora: " + nfce.ModeloImpressora());
            Log.d("NFCeModule", "portaComunicacao: " + nfce.PortaComunicacao());

            try {
                nfce.imprimir(chaveNotaOuXmlContingencia).thenAccept(imprimir -> {
                            Log.d("NFCeModule", "Imprimir nota: " + result);
                            promise.resolve(imprimir);
                        })
                        .exceptionally(error -> {
                            Log.d("NFCeModule", "Error: " + error.getCause().getMessage());
                            promise.reject("Erro ao imprimir nota: " +  error.getCause().getMessage());
                            return null;
                        });
            } catch (Exception e) {
                promise.reject("Erro ao imprimir nota: " + e.getMessage());
            }
        });
    }
}
