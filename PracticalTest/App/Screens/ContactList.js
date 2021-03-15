import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import Colors from '../Utils/Colors';
import Constant from '../Utils/Constant';
import SQLite from 'react-native-sqlite-storage';
import Images from '../Utils/Images';
import { printLog } from '../Utils/Validator';
import { commonStyles } from '../Utils/CommonStyles';


let db;
class ContactList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			contact: [],
			searchContact: false,
			searchText: '',
			isSearch: false


		};
		this.arrayholder = [];


		db = SQLite.openDatabase(
			{
				name: Constant.DBNAME,
				createFromLocation: 2,
			},
			this.success, //okCallback
			this.fail, // error callback
		);
	}

	success = () => {
		this.showContacts();
	};

	fail = error => {
		console.error(error);
		alert(' '); // logging out error if there is one
	};

	showContacts = () => {
		db.transaction(tx => {
			tx.executeSql('SELECT * FROM Contacts', [], (tx, results) => {
				// sql query to get all table data and storing it in 'results' variable
				let contact = []; //creating empty array to store the rows of the sql table data
				for (let i = 0; i < results.rows.length; i++) {
					contact.push(results.rows.item(i)); //looping through each row in the table and storing it as object in the 'users' array
				}
				this.arrayholder = contact;
				this.setState({ contact: this.arrayholder }); //setting the state(userlist) with users array which has all the table data
			});
		});
	};

	onDeletePress = (itemId) => {
		Alert.alert(
			//title
			'Delete Contact',
			//body
			'Are you sure you want to delete this Contact ?',
			[
				{
					text: 'Yes',
					onPress: () => this.deleteContact(itemId)
				},
				{
					text: 'No',
					onPress: () => console.log('No Pressed'), style: 'cancel'
				},
			],
			{ cancelable: false },
			//clicking out side of alert will not cancel
		);
	}

	onUpdatePress = (item) => {
		Alert.alert(
			//title
			'Delete Contact',
			//body
			'Are you sure you want to update this Contact ?',
			[
				{
					text: 'Yes',
					onPress: () => this.updateContact(item)
				},
				{
					text: 'No',
					onPress: () => console.log('No Pressed'), style: 'cancel'
				},
			],
			{ cancelable: false },
			//clicking out side of alert will not cancel
		);
	}

	componentDidMount() {

		this.focusListener = this.props.navigation.addListener('focus', () => {
			this.showContacts();
		});

		this.props.navigation.setOptions({
			headerRight: () => (
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center' }}>
					<TouchableOpacity><Image source={Images.filter} style={{ height: 25, width: 25, marginHorizontal: 10 }} /></TouchableOpacity>
					<TouchableOpacity onPress={() => this.onSearchClicked()}><Image source={Images.search} style={{ height: 25, width: 25, marginHorizontal: 10 }} /></TouchableOpacity>
				</View>
			)
		});
	}

	searchContact = () => {
		this.setState({
			isSearch: true
		})
	}

	onSearchClicked = () => {
		this.setState({
			isSearch: true
		})
	}

	onCloseClicked = () => {
		this.setState({
			isSearch: false
		})
	}

	deleteContact = itemId => {
		db.transaction(tx => {
			tx.executeSql(
				'DELETE FROM  Contacts where id=?',
				[itemId],
				(tx, results) => {
					console.log('Results', results.rowsAffected);
					if (results.rowsAffected > 0) {
						printLog('Contact deleted successfully');
					} else {
						alert(Constant.tryAgain);
					}
				},
			);
		});
		this.showContacts();
	};

	updateContact = item => {
		this.props.navigation.navigate('UpdateContact', { 'item': item });
	}

	handleChange = (value, name) => {
		this.setState({
			[name]: value,
		});
	};

	searchData(text) {
		const newData = this.arrayholder.filter(item => {

			const itemData = `${item.firstName.toUpperCase()}`;
			const textData = text.toUpperCase();
			return itemData.indexOf(textData) > -1;
		});

		this.setState({
			contact: newData,
			searchText: text,
		});
	}

	render() {
		const { contact, isSearch, searchText } = this.state;
		return (
			<View style={styles.container}>

				{isSearch &&
					<View style={{ flexDirection: 'row',alignItems:'center',justifyContent:'center',marginHorizontal:10 }}>
						<TextInput
							value={searchText}
							placeholder={'Search'}
							maxLength={10}
							style={[commonStyles.inputStyle, { width: '90%' }]}
							onChangeText={text => this.searchData(text)}
						/>
						<TouchableOpacity
						onPress={this.onCloseClicked}
						style={{flex:1,height:40,justifyContent:'center',alignItems:'center'}}>
							<Image source={Images.close} style={[styles.imageStyle,{marginStart:5}]} />
						</TouchableOpacity>
					</View>
				}
				{contact.length > 0 ? (
					<FlatList
						data={contact}
						contentContainerStyle={{ marginBottom: 20 }}
						keyExtractor={item => item.id.toString()}
						renderItem={({ item }) =>
							renderContact(item, this.onDeletePress, this.onUpdatePress)
						}
					/>
				) : (
					<Text>Please add Contact to see the list</Text>
				)}
			</View>
		);
	}
}

const renderContact = (item, onDeletePress, onUpdatePress) => {
	return (
		<View>
			<View style={styles.cardContainer}>
				<Image defaultSource={Images.profile} style={styles.profileImage} source={{ uri: item.image }} />
				<Text style={styles.title}>{item.firstName}</Text>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						width: '20%'
					}}>
					<TouchableOpacity onPress={() => onUpdatePress(item)}>
						<Image source={Images.Edit} style={styles.imageStyle} />
					</TouchableOpacity>

					<TouchableOpacity onPress={() => onDeletePress(item.id)}>
						<Image source={Images.delete1} style={styles.imageStyle} />
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.contactSeprator}></View>
		</View>

	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
		alignItems: 'center',
	},
	cardContainer: {
		height: 100,
		backgroundColor: Colors.background,
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 20,

		justifyContent: 'space-between'
	},
	title: {
		color: Colors.black,
		fontSize: 17,
		width: '50%',
		marginVertical: 3,
		marginHorizontal: 10
	},

	imageStyle: {
		height: 25,
		width: 25,
	},
	contactSeprator: {
		borderColor: Colors.contactListSeprator,
		borderWidth: 1,
	},
	profileImage: {
		height: 70,
		width: 70,
		borderRadius: 50,
		borderColor: Colors.primaryColor,
		borderWidth: 1
	}
});


export default ContactList;
