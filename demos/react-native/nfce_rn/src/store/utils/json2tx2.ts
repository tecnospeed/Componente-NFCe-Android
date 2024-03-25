const tiposComando = {
    1: "INCLUIR",
    2: "SALVAR"
};

const CRLF = '\r\n';

function criarComando(nomeComando: string, tipoComando: number): string {
    return tiposComando[tipoComando] + nomeComando.toUpperCase();
};

export function json2tx2(jsonString: string): string {
    const objeto = JSON.parse(jsonString);
    const tx2: string[] = [];

    function lerObjeto(objeto: any): void {
        Object.keys(objeto).forEach((item) => {
            if (typeof objeto[item] === 'object') {
                if (Array.isArray(objeto[item])) {
                    for (let i = 0; i < objeto[item].length; i++) {
                        tx2.push(criarComando(item, 1));
                        lerObjeto(objeto[item][i]);
                        tx2.push(criarComando(item, 2));
                    }
                }
            } else {
                tx2.push(item + '=' + objeto[item]);
            }
        })
    }

    lerObjeto(objeto);
    return tx2.join(CRLF);
}
