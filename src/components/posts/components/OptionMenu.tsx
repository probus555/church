import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface OptionsMenuProps {
  onDelete: () => void;
  onEdit:()=>void;
}

export const OptionsMenu: React.FC<OptionsMenuProps> = ({onDelete,onEdit,}) => (
  <View style={styles.modalContainer}>
    {
      <View style={styles.modalView}>
        {/* Your edit, delete, report options here */}
        <TouchableOpacity
          style={styles.optionsContainer}

          onPress={onEdit}>
          <Icon name="edit" size={20} color="#000" style={styles.modalIcon} />
          <Text style={styles.optionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionsContainer} onPress={onDelete}>
          <Icon name="trash" size={20} color="#000" style={styles.modalIcon} />
          <Text style={styles.optionText}>Delete</Text>
        </TouchableOpacity>
        
        {/* <TouchableOpacity
          style={styles.optionsContainer}
          onPress={() => console.log('Report')}>
          <Icon
            name="exclamation-circle"
            size={20}
            color="#000"
            style={styles.modalIcon}
          />
          <Text style={styles.optionText}>Report</Text>
        </TouchableOpacity> */}
      </View>
    }
  </View>
);

const styles = StyleSheet.create({
  // Styles for OptionsMenu
  modalContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 4,
    width: 120, // Adjust width as needed
    marginTop: 50, // Adjust marginTop as needed
    gap: 10,
  },
  optionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  optionsContainer: {flexDirection: 'row', gap: 5},
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
});
