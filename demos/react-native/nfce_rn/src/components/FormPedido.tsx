import React, { useState, useEffect, Dispatch } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import CardItem from './CardItem';
import ListItemPedido from './ListItemPedido';
import { Item, Pedido } from '../store/pedidos/types';
import { getAllProdutos } from '../store/produtos';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SelectInput from "./SelectInput";

const FormPedido = ({
  dataPedido,
  setDataPedido,
  showButtonFinishPayment,
  setShowButtonFinishPayment,
}: {
  dataPedido: Pedido;
  setDataPedido: Dispatch<Pedido>;
  showButtonFinishPayment: boolean,
  setShowButtonFinishPayment: Dispatch<boolean>;
}) => {
  const [showListProducts, setShowListProducts] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showButtonPayment, setShowButtonPayment] = useState(false);
  const [listProdutos, setListProdutos] = useState([] as Item[]);
  const [listPagamento, setListPagamento] = useState([{ value: 1, label: 'Dinheiro' }, { value: 17, label: 'Pix'}]);
  const [typePagamento, setTypePagamento] = useState({ value: 17, label: 'Pix' });
  const [listEmissao, setListEmissao] = useState([{ value: 1, label: 'Emissão normal' }, { value: 9, label: 'Contingência'}]);
  const [typeEmissao, setTypeEmissao] = useState({ value: 1, label: 'Emissão normal' });
  const [cart, setCart] = useState([] as Item[]);
  const [total, setTotal] = useState(0 as number);

  async function findProdutos() {
    const response = await getAllProdutos();
    if (response.isValid) {
      const data = response.result.map((item) => {
        return {
          ...item,
          selected: false,
          qtd: 1,
        };
      });
      setListProdutos(data);
    }
  }

  async function getTotal() {
    const amount = await listProdutos.reduce((acc, currentProduto) => {
      if (currentProduto.selected) {
        acc = Number(currentProduto.preco) * Number(currentProduto.qtd) + Number(acc);
      }
      return acc;
    }, 0);

    setTotal(amount);

    if (amount > 0 && !showButtonFinishPayment) {
      setShowButtonPayment(true)
    }
  }

  async function filterCart() {
    const produtosFiltred = await listProdutos.filter((produto) => {
      if (produto.selected === true) {
        return produto;
      }
    });
    setCart(produtosFiltred);
    setDataPedido({
      ...dataPedido,
      items_pedidos: produtosFiltred,
      total: total,
      pagamento: typePagamento,
    });
  }

  async function processPedido() {
    await getTotal();
    await filterCart();
  }

  useEffect(() => {
    if (!dataPedido.id) {
      findProdutos();
    } else {
      setCart(dataPedido.items_pedidos as Item[]);
      setTotal(dataPedido.total);
      setTypePagamento(dataPedido.pagamento);
    }
  }, []);

  useEffect(() => {
    if (!dataPedido.id) {
      processPedido();
    }
  }, [listProdutos, total, typePagamento]);

  useEffect(() => {
    dataPedido.offline = typeEmissao.value === 9
  }, [typeEmissao])

  return (
    <View>
      <View className="flex items-center w-full px-4 py-2" style={{ height: '78%' }}>
        <View className="flex flex-col w-full items-end ">
          {!dataPedido.id && (
            <Pressable
              className="items-center justify-center w-10 h-10 bg-emerald-400 rounded-full my-2"
              onPress={() => {
                setShowListProducts(true);
              }}
            >
              <Icon name="add" size={28} color={'#FFF'} />
            </Pressable>
          )}
          {cart && <CardItem cart={cart} />}
        </View>

        <View className="mt-2">
          <Text className="text-center text-3xl font-bold text-black">
            R$
            {Number(total).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <Text className="text-center text-sm text-black">Total</Text>
        </View>

        {showPayment && (
        <View className="items-start w-full z-50">
          <View className="my-2 w-full">
            <Text className="ml-3">Forma de pagamento</Text>
            <SelectInput
              placeholder={'Selecione o tipo de pagamento'}
              data={listPagamento}
              value={typePagamento.label}
              onChange={setTypePagamento}
            />
          </View>

          <View className="my-2 w-full">
            <Text className="ml-3">Tipo de emissão</Text>
            <SelectInput
              placeholder={'Selecione o tipo de emissão'}
              data={listEmissao}
              value={typeEmissao.label}
              onChange={setTypeEmissao}
            />
          </View>
        </View>
      )}

      {showButtonPayment && (
        <View className="w-full">
          <Pressable
              className="items-center rounded-full p-4 bg-emerald-950 m-6 px-10"
              onPress={() => {
                setShowPayment(true)
                setShowButtonPayment(false)
                setShowButtonFinishPayment(true)
              }}
            >
              <Text className="text-base font-bold text-white">Ir para pagamento</Text>
          </Pressable>
        </View>
      )}
      </View>

      {showListProducts && (
        <View className="w-full h-screen absolute z-40">
          <Pressable
            className="-top-10 right-3 absolute h-10 w-10 bg-red-400 rounded-full items-center justify-center z-50"
            onPress={() => {
              setShowListProducts(false);
            }}
          >
            <Icon name="close" size={28} color={'#FFF'}/>
          </Pressable>
          <View className="bg-gray-200 rounded-t-full p-4 items-center">
            <Text className="font-bold text-2xl text-gray-400">Produtos</Text>
          </View>
          <View className="h-full bg-gray-200">
            <ListItemPedido listProdutos={listProdutos} setListProdutos={setListProdutos} />
          </View>
        </View>
      )}
    </View>
  );
};

export default React.memo(FormPedido);
