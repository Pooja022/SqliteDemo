import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

//Screens
import AddCategory from '../Screens/AddCategory';
import AddContacts from '../Screens/AddContacts';
import ContactList from '../Screens/ContactList';
import UpdateContact from '../Screens/UpdateContact';
import Colors from './Colors';
import { Image, TouchableOpacity, View } from 'react-native';
import Images from './Images';

const AddContactStack = createStackNavigator();
const AddCategoryStack = createStackNavigator();
const ConatctListStack = createStackNavigator();

const Drawer = createDrawerNavigator();

const AddCategoryStackScreen = ({ navigation }) => {
	return <AddCategoryStack.Navigator screenOptions={{
		headerStyle: {
			backgroundColor: Colors.primaryColor,
		}
	}}>
		<AddCategoryStack.Screen name="AddCategory" component={AddCategory}
			options={{
				title: 'Add Category',
				headerTitleAlign: 'center',
				headerTitleStyle: { color: 'white' },
				headerLeft: () => (<TouchableOpacity onPress={() => navigation.openDrawer()}><Image source={Images.menu} style={{ height: 25, width: 25 }} /></TouchableOpacity>)
			}} />
	</AddCategoryStack.Navigator>;
};

const AddContactStackScreen = ({ navigation }) => {
	return <AddContactStack.Navigator
		screenProps={navigation}

		screenOptions={{
			headerStyle: {
				backgroundColor: Colors.primaryColor
			}
		}}>
		<AddContactStack.Screen
			name="AddContacts"
			component={AddContacts}
			options={{
				title: 'Add Contact',
				headerTitleAlign: 'center',
				headerTitleStyle: { color: 'white' },
				headerLeft: () => (<TouchableOpacity onPress={() => navigation.openDrawer()}><Image source={Images.menu} style={{ height: 25, width: 25 }} /></TouchableOpacity>)
			}}
		/>
	</AddContactStack.Navigator>;
};

const ContactListStackScreen = ({ navigation }) => {
	return <ConatctListStack.Navigator
		screenProps={navigation}
		screenOptions={{
			headerStyle: {
				backgroundColor: Colors.primaryColor
			}
		}}>
		<ConatctListStack.Screen

			name="ContactList"
			component={ContactList}
			options={{
				title: 'Contact List',
				headerTitleAlign: 'center',
				headerTitleStyle: { color: 'white' },

				headerLeft: () => (<TouchableOpacity onPress={() => navigation.openDrawer()}><Image source={Images.menu} style={{ height: 25, width: 25 }} /></TouchableOpacity>)
			}}
		/>

		<ConatctListStack.Screen

			name="UpdateContact"
			component={UpdateContact}
			options={{
				title: 'Update Contact',
				headerTitleAlign: 'center',
				headerTitleStyle: { color: 'white' },

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
				<Drawer.Screen name="Contact List" component={ContactListStackScreen} />
			</Drawer.Navigator>
		</NavigationContainer>
	);
};

export default NavigationUtils;
