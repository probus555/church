import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextStyle, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useStyles from './useStyles';
import {useAppTheme} from '../../theme';
import {DropdownProps} from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';

interface DropdownPropsExtended extends DropdownProps<any> {
  label?: string;
  labelStyle?: TextStyle;
}

const DropdownComponent = ({
  label = '',
  containerStyle = {},
  labelStyle = {},
  style = {},
  placeholderStyle = {},
  selectedTextStyle = {},
  iconStyle = {},
  inputSearchStyle = {},
  data = [],
  maxHeight = 300,
  labelField = 'label',
  valueField = 'value',
  placeholder = 'Select',
  searchPlaceholder = 'Search...',
  search = false,
  value = '',
  onChange = item => {},
}: DropdownPropsExtended) => {
  const [dropDownValue, setDropdownValue] = useState();

  useEffect(() => {
    setDropdownValue(value);
  }, [value]);
  const [isFocus, setIsFocus] = useState(false);
  const styles = useStyles();
  const theme = useAppTheme();
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text
          style={[
            styles.label,
            isFocus && {color: theme.colors.primary},
            labelStyle,
          ]}>
          {label}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {renderLabel()}
      <Dropdown
        selectedTextProps={{numberOfLines: 1}}
        style={[
          styles.dropdown,
          isFocus && {borderColor: theme.colors.primary, borderWidth: 2},
          style,
        ]}
        placeholderStyle={[styles.placeholderStyle, placeholderStyle]}
        selectedTextStyle={[styles.selectedTextStyle, selectedTextStyle]}
        inputSearchStyle={[styles.inputSearchStyle, inputSearchStyle]}
        iconStyle={[styles.iconStyle, iconStyle]}
        data={data}
        search={search}
        maxHeight={maxHeight}
        labelField={labelField}
        valueField={valueField}
        placeholder={!isFocus ? placeholder : ''}
        searchPlaceholder={searchPlaceholder}
        value={dropDownValue}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setDropdownValue(item.value);
          onChange(item);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default DropdownComponent;
