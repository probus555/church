import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {View} from 'react-native';
import Notices from '../notices';
import Events from '../events';
import News from '../news';

type Props = {};

const PostTabs = (props: Props) => {
  const Tab = createMaterialTopTabNavigator();
  const Dummy = () => <></>;
  return (
    <Tab.Navigator>
      <Tab.Screen name="Notices" component={Notices} />
      <Tab.Screen name="Events" component={Events} />
      {/* <Tab.Screen name="News" component={News} /> */}
    </Tab.Navigator>
  );
};

export default PostTabs;
