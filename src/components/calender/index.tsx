import React, { useState } from 'react';
import { Modal, View, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface CustomCalendarProps {
  visible: boolean;
  onClose: () => void;
  onDayPress?: (day: any) => void;
  btnLabel:string
}

const CalenderModal: React.FC<CustomCalendarProps> = ({ visible, onClose, onDayPress ,btnLabel="Close"}) => {
  const [selected, setSelected] = useState('');

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='fade'
      onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
          <Calendar
            onDayPress={day => {
              setSelected(day.dateString);
              if (onDayPress) {
                onDayPress(day);
              }
            }}
            enableSwipeMonths={true}
            markedDates={{
              [selected]: { selected: true, disableTouchEvent: true }
            }}
          />
          <Button title={btnLabel} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default CalenderModal;
