import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useState } from 'react';

export default function SelectInput({
  data: data,
  onChange: onChange,
  placeholder: placeholder,
  value: value,
  ...rest
}: any) {
  const [openSelect, setOpenSelect] = useState(false);

  return (
    <>
      <View className="flex flex-row justify-between bg-white w-full rounded-full px-3 py-3 border border-gray-200  placeholder-gray-500 text-gray-600  focus:border-gray-400">
        <TouchableOpacity
          onPress={() => {
            setOpenSelect(!openSelect);
          }}
        >
          <Text>{value ? value : placeholder}</Text>
          {!data.length && <ActivityIndicator color="blue" />}
        </TouchableOpacity>
      </View>

      {openSelect && data.length > 0 && (
        <View className="absolute z-40 bg-white max-h-40 w-full rounded-lg p-2 border border-gray-400">
          <FlatList
            className=""
            data={data}
            renderItem={({ item }) => (
              <View>
                {typeof item === 'object' ? (
                  <Text
                    className="p-2"
                    onPress={() => {
                      setOpenSelect(!openSelect);
                      onChange(item);
                    }}
                  >
                    {item.label}
                  </Text>
                ) : (
                  <Text
                    className="p-2"
                    onPress={() => {
                      setOpenSelect(!openSelect);
                      onChange(item);
                    }}
                  >
                    {item}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
      )}
    </>
  );
}
