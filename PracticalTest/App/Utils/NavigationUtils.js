import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

//Screens
import AddCategory from '../Screens/AddCategory';
import AddContacts from '../Screens/AddContacts';
import ContactList from '../Screens/ContactList';
import Colors from './Colors';

const AddContactStack = createStackNavigator();
const AddCategoryStack = createStackNavigator();
const ConatctListStack = createStackNavigator();

const Drawer = createDrawerNavigator();

const AddCategoryStackScreen = ({navigation}) => {
  return <AddCategoryStack.Navigator screenOptions={ {
    headerStyle:{
      backgroundColor:Colors.primaryColor
    }
  }}>
    <AddCategoryStack.Screen name="AddCategory" component={AddCategory} />
  </AddCategoryStack.Navigator>;
};

const AddContactStackScreen = ({navigation}) => {
 return <AddContactStack.Navigator screenOptions={ {
  headerStyle:{
    backgroundColor:Colors.primaryColor
  }
}}>
    <AddContactStack.Screen
      name="Add Contact"
      component={AddContacts}
      options={{
        tiitle: 'Add Contact',
      }}
    />
  </AddContactStack.Navigator>;
};

const ContactListStackScreen = ({navigation}) => {
  return <ConatctListStack.Navigator screenOptions={ {
    headerStyle:{
      backgroundColor:Colors.primaryColor
    }
  }}>
    <ConatctListStack.Screen
      name="Contact List"
      component={ContactList}
      options={{
        tiitle: 'Contact List',
      }}
    />
  </ConatctListStack.Navigator>;
};

const NavigationUtils = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="AddCategory">
        <Drawer.Screen name="AddCategory" component={AddCategoryStackScreen} />
        <Drawer.Screen name="AddContacts" component={AddContactStackScreen} />
        <Drawer.Screen name="ContactList" component={ContactListStackScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default NavigationUtils;
