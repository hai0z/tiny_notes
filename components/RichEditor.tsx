import React from 'react';
import {
  Text,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';

const handleHead = ({tintColor}: any) => (
  <Text style={{color: tintColor}}>H1</Text>
);

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const RichEditors = () => {
  const richText = React.useRef<RichEditor>(null);
  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <RichEditor
            editorStyle={{backgroundColor: 'transparent'}}
            initialHeight={300}
            placeholder="Ghi chú"
            ref={richText}
            onChange={descriptionText => {
              console.log('descriptionText:', descriptionText);
            }}
          />
        </KeyboardAvoidingView>
      </ScrollView>

      <RichToolbar
        editor={richText}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.heading1,
          actions.checkboxList,
        ]}
        iconMap={{[actions.heading1]: handleHead}}
      />
    </SafeAreaView>
  );
};

export default RichEditors;
