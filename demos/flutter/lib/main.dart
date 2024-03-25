import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:file_picker/file_picker.dart';

enum MethodsAllowed {
  config,
  certificate,
  converterLoteParaXml,
  assinar,
  consultar,
  checkConfig,
  getConfig,
  enviarNota,
  statusServico,
  imprimir,
  cancelar
}

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NFCe Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Demo Flutter - Tecnospeed NFCe'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  static const platform = MethodChannel('app.channel.shared.data');

  late String _result;
  bool settingsLoaded = false;

  //region sh data
  final _cnpjSoftwareHouse  = TextEditingController(text: "@@@@@@@@@@@@@@@@");
  final _tokenSoftwareHouse = TextEditingController(text: "@@@@@@@@@@@@@@@@");
  final _senhaCertificado   = TextEditingController(text: "@@@@@@@@@@@@@@@@");
  final _tokenCSC           = TextEditingController(text: "@@@@@@@@@@@@@@@@");
  final _nomeCertificado    = TextEditingController(text: "certificado.pfx");

  @override
  void dispose() {
    _cnpjSoftwareHouse.dispose();
    _tokenSoftwareHouse.dispose();
    _senhaCertificado.dispose();
    _tokenCSC.dispose();
    _nomeCertificado.dispose();
    super.dispose();
  }

  Future nfceApiCaller(MethodsAllowed methodName, dynamic paramsChannel) async {
    final methodNameStr = methodName.toString().split('.')[1];

    Future<void> invokeMethodAndUpdateText(
        String methodName, dynamic argument) async {
      await platform
          .invokeMethod<String>(methodName, argument)
          .then((String? value) async {
        _result = value ?? "Método inválido";
      });

      if (_result.contains("sucesso")) {
        setState(() {
          settingsLoaded = true;
        });
      }
    }

    switch (methodName) {
      case MethodsAllowed.converterLoteParaXml:
      case MethodsAllowed.getConfig:
      case MethodsAllowed.checkConfig:
      case MethodsAllowed.statusServico:
        try {
          await invokeMethodAndUpdateText(methodNameStr, null);
        } on Exception catch (e) {
          _result = e.toString();
        }
        break;

      case MethodsAllowed.certificate:
      case MethodsAllowed.config:
      case MethodsAllowed.cancelar:
        await invokeMethodAndUpdateText(methodNameStr, paramsChannel);
        break;

      case MethodsAllowed.assinar:
        await invokeMethodAndUpdateText(methodNameStr, {"xml": _result});
        break;

      case MethodsAllowed.enviarNota:
        await invokeMethodAndUpdateText(methodNameStr, {"loteNotas": _result});
        break;

      case MethodsAllowed.consultar:
        await invokeMethodAndUpdateText(methodNameStr,
            {"chaveNota": "41240229062609000177651230000000101000035552"});
        break;

      case MethodsAllowed.imprimir:
        await invokeMethodAndUpdateText(methodNameStr,
            {"chaveNota": "41240229062609000177651230000000101000035552"});
        break;

      default:
        _result = "Método inválido";
    }

    await _showMyDialog(_result);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(15.0),
          child: ListView(
            children: [
              TextField(
                controller: _cnpjSoftwareHouse,
                decoration: const InputDecoration(
                  labelText: 'CNPJ Software House',
                ),
                style: const TextStyle(fontSize: 10),
              ),
              TextField(
                controller: _tokenSoftwareHouse,
                obscureText: true,
                enableSuggestions: false,
                autocorrect: false,
                decoration: const InputDecoration(
                  labelText: 'Token Software House',
                ),
                style: const TextStyle(fontSize: 10),
              ),
              TextField(
                controller: _senhaCertificado,
                obscureText: true,
                enableSuggestions: false,
                autocorrect: false,
                decoration: const InputDecoration(
                  labelText: 'Senha certificado',
                ),
                style: const TextStyle(fontSize: 10),
              ),
              TextField(
                controller: _tokenCSC,
                obscureText: true,
                enableSuggestions: false,
                autocorrect: false,
                decoration: const InputDecoration(
                  labelText: 'Token CSC',
                ),
                style: const TextStyle(fontSize: 10),
              ),
              TextField(
                controller: _nomeCertificado,
                decoration: const InputDecoration(
                  labelText: 'Nome Certificado',
                ),
                style: const TextStyle(fontSize: 10),
              ),
              ...createMenu()
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
          label: const Text('Permissões'),
          icon: const Icon(Icons.sd_storage),
          onPressed: () async {
            Map<Permission, PermissionStatus> statuses = await [
              Permission.manageExternalStorage,
              Permission.storage,
            ].request();

            print(statuses[Permission.manageExternalStorage]);
            print(statuses[Permission.storage]);
          }),
    );
  }

  List<Widget> createMenu() {
    return [
      TextButton(
        onPressed: () async {
          nfceApiCaller(MethodsAllowed.config, {
            "cnpjSoftwareHouse": _cnpjSoftwareHouse.text,
            "tokenSoftwareHouse": _tokenSoftwareHouse.text,
            "senhaCertificado": _senhaCertificado.text,
            "idTokenCSC": "000001",
            "tokenCSC": _tokenCSC.text,
            "portaComunicacao": "11:22:33:44:55:66",
          });
        },
        child: const Text('Carregar Configurações'),
      ),
      TextButton(
        onPressed: () async {
          String? selectedDirectory =
              await FilePicker.platform.getDirectoryPath();

          if (selectedDirectory != null) {
            String fullPath = '$selectedDirectory/${_nomeCertificado.text}';
            ScaffoldMessenger.of(context)
                .showSnackBar(SnackBar(content: Text('Caminho configurado:\n$fullPath')));

            await nfceApiCaller(MethodsAllowed.certificate, {
              "path": fullPath
            });
          }
        },
        child: const Text('Configurar Certificado'),
      ),
      TextButton(
        onPressed: settingsLoaded
            ? () async =>
                nfceApiCaller(MethodsAllowed.converterLoteParaXml, null)
            : null,
        child: const Text('Converter Lote XML'),
      ),
      TextButton(
        onPressed: settingsLoaded
            ? () async => nfceApiCaller(MethodsAllowed.assinar, null)
            : null,
        child: const Text('Assinar XML'),
      ),
      TextButton(
        onPressed: settingsLoaded
            ? () async => nfceApiCaller(MethodsAllowed.enviarNota, null)
            : null,
        child: const Text('Enviar Nota'),
      ),
      TextButton(
        onPressed: settingsLoaded
            ? () async => nfceApiCaller(MethodsAllowed.imprimir, null)
            : null,
        child: const Text('Imprimir'),
      ),
      TextButton(
        onPressed: settingsLoaded
            ? () async => nfceApiCaller(MethodsAllowed.consultar, null)
            : null,
        child: const Text('Consultar'),
      ),
      TextButton(
        onPressed: settingsLoaded
            ? () async {
                nfceApiCaller(MethodsAllowed.cancelar, {
                  "chaveNota": "41240229062609000177651240000000101000035559",
                  "protocolo": "141240000035079",
                  "justificativa": "CANCELAMENTO DE TESTE",
                  "dataHoraEvento": "2024-02-14T23:21:00-03:00",
                  "sequenciaEvento": "1",
                  "fusoHorario": "-03:00",
                  "numeroLote": "1",
                });
              }
            : null,
        child: const Text('Cancelar'),
      ),
      TextButton(
        onPressed: settingsLoaded
            ? () async => nfceApiCaller(MethodsAllowed.checkConfig, null)
            : null,
        child: const Text('Check Config'),
      ),
      TextButton(
        onPressed: settingsLoaded
            ? () async => nfceApiCaller(MethodsAllowed.getConfig, null)
            : null,
        child: const Text('Get Config'),
      ),
      TextButton(
        onPressed: settingsLoaded
            ? () async => nfceApiCaller(MethodsAllowed.statusServico, null)
            : null,
        child: const Text('Status Serviço'),
      ),
    ];
  }

  Future<void> _showMyDialog(String message) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (BuildContext context) {
        return AlertDialog(
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text(message),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text("Fechar"),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }
}
