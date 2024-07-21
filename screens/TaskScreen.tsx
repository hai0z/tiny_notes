import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import TaskSchema from '../model/TaskSchema';
import {BSON, Results} from 'realm';
import {useQuery, useRealm, useUser} from '@realm/react';
import {Checkbox, RadioButton, Text, useTheme} from 'react-native-paper';

export default function TaskScreen() {
  const task = useQuery<TaskSchema>(TaskSchema).sorted('orderIndex');

  const [data, setData] = useState<TaskSchema[]>(task.map(t => t));

  const realm = useRealm();

  const user = useUser();

  const theme = useTheme();

  console.log(task);

  const onDragEnd = ({data}: {data: TaskSchema[]}) => {
    setData(data);
    realm.write(() => {
      for (let i = 0; i < data.length; i++) {
        data[i].orderIndex = i;
      }
    });
  };

  const handleComplete = (task: TaskSchema) => {
    realm.write(() => {
      task.isCompleted = !task.isCompleted;
    });
  };
  console.log('sdkfs');
  const renderItem = ({item, drag, isActive}: RenderItemParams<TaskSchema>) => {
    return (
      <ScaleDecorator activeScale={0.98}>
        <TouchableOpacity
          className="flex flex-row items-center"
          onLongPress={drag}
          disabled={isActive}
          style={{
            backgroundColor: isActive
              ? theme.colors.secondary
              : theme.colors.surfaceVariant,
            width: '100%',
            padding: 8,
            borderRadius: 8,
            marginVertical: 4,
          }}>
          <RadioButton
            value={item._id.toHexString()}
            onPress={() => handleComplete(item)}
            status={item.isCompleted ? 'checked' : 'unchecked'}
          />
          <Text>{item.title}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <ScrollView
      className="flex-1 pt-8 w-full px-4"
      style={{backgroundColor: theme.colors.background}}>
      <View className="px-2 pt-2 mb-4">
        <Text variant="headlineLarge">Việc cần làm</Text>
        <Text
          variant="bodyMedium"
          style={{color: theme.colors.onSurfaceVariant}}>
          {data.length} việc cần làm
        </Text>
      </View>
      <View>
        <DraggableFlatList
          initialNumToRender={10}
          data={data}
          onDragEnd={({data}) => onDragEnd({data})}
          keyExtractor={item => item._id.toHexString()}
          renderItem={renderItem}
        />
        <View className="px-2 pt-2 mb-4">
          <Text variant="headlineLarge">Xong</Text>
          <Text
            variant="bodyMedium"
            style={{color: theme.colors.onSurfaceVariant}}>
            {data.length} việc cần làm
          </Text>
        </View>
        <DraggableFlatList
          initialNumToRender={10}
          data={data}
          onDragEnd={({data}) => onDragEnd({data})}
          keyExtractor={item => item._id.toHexString()}
          renderItem={renderItem}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rowItem: {
    height: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
