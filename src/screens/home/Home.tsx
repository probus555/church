import React, {memo} from 'react';
import {View} from 'react-native';
import useSyles from './useStyles';
import Header from './components/header';
import {ScrollView} from 'react-native-gesture-handler';

type Props = {};

const Home = (props: Props) => {
  const styles = useSyles();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Header />
        <View style={styles.homeContainer}></View>
      </View>
    </ScrollView>
  );
};

export default memo(Home);
