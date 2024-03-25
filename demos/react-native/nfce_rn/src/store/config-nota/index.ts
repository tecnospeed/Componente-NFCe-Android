import AsyncStorage from '@react-native-async-storage/async-storage';

export const getInvoiceNumber = async (): Promise<any> => {
  try {
    const keys = await AsyncStorage.getAllKeys()
    const keysNumber = keys.filter((key) => key.startsWith('NUMBER_INVOICE'))

    const listNumber = await Promise.all(
      keysNumber.map(async (number: string) => {
        if (number.startsWith('NUMBER_INVOICE')) {
          const data = await AsyncStorage.getItem(number)
          if (data) return JSON.parse(data)
        }
      })
    );

    return listNumber[0];
  } catch (error) {
    return {
      numberInvoice: 0
    };
  }
}

export const createInvoiceNumber = async (numberInvoice: string): Promise<any> => {
  try {
    const dataNumberInvoice = { numberInvoice }
    await AsyncStorage.setItem(`NUMBER_INVOICE`, JSON.stringify(dataNumberInvoice));

    return dataNumberInvoice;
  } catch (error) {
    return {
      numberInvoice: 0
    };
  }
}

export const getInvoiceSerie = async (): Promise<any> => {
  try {
    const keys = await AsyncStorage.getAllKeys()

    const keysSerie = keys.filter((key) => key.startsWith('SERIE_INVOICE'))

    const listSerie = await Promise.all(
      keysSerie.map(async (serie: string) => {
        if (serie.startsWith('SERIE_INVOICE')) {
          const data = await AsyncStorage.getItem(serie)
          if (data) return JSON.parse(data)
        }
      })
    );

    return listSerie[0];
  } catch (error) {
    return {
      serieInvoice: 0
    };
  }
}

export const createInvoiceSerie = async (serieInvoice: string): Promise<any> => {
  try {
    const dataSerieInvoice = { serieInvoice }
    await AsyncStorage.setItem(`SERIE_INVOICE`, JSON.stringify(dataSerieInvoice));
    return dataSerieInvoice;
  } catch (error) {
    return {
      serieInvoice: 0
    };
  }
}

export const createConfigPix = async (automaticPix: boolean): Promise<any> => {
  try {
    const dataAutomaticPix = { automaticPix }
    await AsyncStorage.setItem(`CONFIG_PIX`, JSON.stringify(dataAutomaticPix));
    return {dataAutomaticPix};
  } catch (error) {
    return {
      automaticPix: false
    };
  }
}

export const getConfigPix = async (): Promise<any> => {
  const keys = await AsyncStorage.getAllKeys()

  const keyPix = keys.filter((key) => key.startsWith('CONFIG_PIX'))

  const listPix = await Promise.all(
    keyPix.map(async (key: string) => {
      if (key.startsWith('CONFIG_PIX')) {
        const data = await AsyncStorage.getItem(key)
        if (data) return JSON.parse(data)
      }
    })
  );

  return listPix[0];
}

export const createConfigPrinter = async (automaticPrinter: boolean): Promise<any> => {
  try {
    const dataAutomaticPrinter = { automaticPrinter }
    await AsyncStorage.setItem(`CONFIG_PRINTER`, JSON.stringify(dataAutomaticPrinter));
    return {dataAutomaticPrinter};
  } catch (error) {
    return {
      automaticPrinter: false
    };
  }
}

export const getConfigPrinter = async (): Promise<any> => {
  const keys = await AsyncStorage.getAllKeys()

  const keyPrinter = keys.filter((key) => key.startsWith('CONFIG_PRINTER'))

  const listPrinter = await Promise.all(
    keyPrinter.map(async (key: string) => {
      if (key.startsWith('CONFIG_PRINTER')) {
        const data = await AsyncStorage.getItem(key)
        if (data) return JSON.parse(data)
      }
    })
  );

  return listPrinter[0];
}
