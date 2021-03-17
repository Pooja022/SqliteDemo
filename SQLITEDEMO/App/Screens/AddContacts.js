import React, { Component } from 'react';
import { View, Image, StyleSheet, TextInput, TouchableOpacity, Text, PermissionsAndroid } from 'react-native';
import Colors from '../Utils/Colors';
import Constant from '../Utils/Constant';
import { commonStyles } from '../Utils/CommonStyles';
import Images from '../Utils/Images';
import { isContactNumberValid, isEmail, isNameValid, printLog } from '../Utils/Validator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SQLite from 'react-native-sqlite-storage';
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-picker/lib/commonjs';
import Contacts from 'react-native-contacts';

let db;

class AddContacts extends Component {

	constructor(props) {
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			contactNumber: '',
			email: '',
			category: '',
			categoryArr: [],
			profileImage: {
				name: '',
				type: 'image/jpeg',
				uri: Image.resolveAssetSource(Images.profile).uri
			},

		};

		db = SQLite.openDatabase(
			{
				name: Constant.DBNAME,
				createFromLocation: 2,
			},
			this.success, //okCallback
			this.fail, // error callback
		);
	}

	componentDidMount() {
		this.focusListener = this.props.navigation.addListener('focus', () => {
			this.getCategory();
		});
	}

	success = () => {
		db.transaction(tx => {
			tx.executeSql(
				'CREATE TABLE IF NOT EXISTS Contacts(id INTEGER PRIMARY KEY AUTOINCREMENT, firstName VARCHAR(10),lastName VARCHAR(10),email VARCHAR(20),contactNumber VARCHAR(10), category VARCHAR(10),image BLOB)',
				[],
			);
		});
		this.getCategory()

	};

	fail = error => {
		console.error(error);
	};

	requestContactPermission = async () => {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
				{
					title: "Add contacts to phone",
					message:
						"App needs access to your Contacts ",
					buttonNeutral: "Ask Me Later",
					buttonNegative: "Cancel",
					buttonPositive: "OK"
				}
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				console.log("You can use the Contacts");
				this.addContactsToPhone();
			} else {
				console.log("Contacts permission denied");

			}
		} catch (err) {
			console.warn(err);
		}
	};


	handleChange = (value, name) => {
		this.setState({
			[name]: value,
		});
	};

	saveContact = () => {
		const { firstName, lastName, contactNumber, email, profileImage } = this.state;

		if (!isNameValid(firstName) || !isNameValid(lastName)) {
			alert('Please enter valid name');
			return;
		}
		if (!isContactNumberValid(contactNumber)) {
			alert('Please enter valid Contact Number');
			return;
		} if (!isEmail(email)) {
			alert('Please enter valid email');
			return;

		} else {
			this.insertContact();
			if (Platform.OS == 'android') {
				PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS).then(response => {
					if (response) {

						this.addContactsToPhone();
					} else {

						Platform.OS == 'android' && this.requestContactPermission();
					}
				});
			} else {
				this.addContactsToPhone();
			}


		}
	}

	getCategory = () => {
		db.transaction(tx => {
			tx.executeSql('SELECT * FROM Category', [], (tx, results) => {
				// sql query to get all table data and storing it in 'results' variable
				let category = []; //creating empty array to store the rows of the sql table data
				for (let i = 0; i < results.rows.length; i++) {
					category.push(results.rows.item(i)); //looping through each row in the table and storing it as object in the 'users' array
				}
				this.setState({ categoryArr: category }); //setting the state(userlist) with users array which has all the table data
			});
		});
	}

	insertContact = () => {
		let firstName = this.state.firstName;
		let lastName = this.state.lastName;
		let contactNumber = this.state.contactNumber;
		let email = this.state.email;
		let category = this.state.category;
		let image = this.state.profileImage.uri

		db.transaction(function (tx) {
			tx.executeSql(
				'INSERT INTO Contacts (firstName,lastName,contactNumber,email,category,image) VALUES (?,?,?,?,?,?)',
				[firstName, lastName, contactNumber, email, category, image],
				(tx, results) => {
					if (results.rowsAffected > 0) {
						alert('Contact inserted Successfully');

					} else {
						alert(Constant.tryAgain)
					};
				},
			);
		});
	};

	openImagePicker = () => {

		const options = {
			title: 'Select Avatar',
			storageOptions: {
				skipBackup: true,
				path: 'images',
			},
		};

		ImagePicker.showImagePicker(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				const source = { uri: response.uri };

				// You can also display the image using data:
				// const source = { uri: 'data:image/jpeg;base64,' + response.data };

				this.setState({
					profileImage: source,
				});
			}
		});
	}

	addContactsToPhone = () => {

		const { firstName, lastName, email } = this.state;
		var newPerson = {
			emailAddresses: [{
				label: "work",
				email: email,
			}],
			familyName: lastName,
			givenName: firstName,
		}

		Contacts.addContact(newPerson);
		this.setState({
			firstName: '',
			lastName: '',
			email: '',
			contactNumber: '',
			category: ''
		})
	}

	render() {
		const { firstName, lastName, contactNumber, email, category, categoryArr, profileImage } = this.state;
		return (
			<KeyboardAwareScrollView
				style={{ flex: 1, backgroundColor: Colors.background }}
				enableOnAndroid={true}>
				<View style={styles.container}>
					<TouchableOpacity onPress={this.openImagePicker}>
						<Image defaultSource={Images.profile} style={styles.imageStyle}
							source={{ uri: profileImage.uri }} />

					</TouchableOpacity>

					<TextInput
						value={firstName}
						placeholder={'First Name'}
						maxLength={10}
						keyboardType={'default'}
						style={commonStyles.inputStyle}
						onChangeText={value => this.handleChange(value, 'firstName')}
					/>

					<TextInput
						value={lastName}
						placeholder={'Last Name'}
						maxLength={10}
						keyboardType={'default'}
						style={commonStyles.inputStyle}
						onChangeText={value => this.handleChange(value, 'lastName')}
					/>

					<TextInput
						value={contactNumber}
						placeholder={'Mobile No'}
						maxLength={10}
						keyboardType={'number-pad'}
						style={commonStyles.inputStyle}
						onChangeText={value => this.handleChange(value, 'contactNumber')}
					/>

					<TextInput
						value={email}
						placeholder={'Email'}
						maxLength={20}
						keyboardType={'email-address'}
						style={commonStyles.inputStyle}
						onChangeText={value => this.handleChange(value, 'email')}
					/>
					<View style={commonStyles.inputStyle}>
						<Picker mode={'dropdown'}
							selectedValue={category}
							onValueChange={value => { this.handleChange(value, 'category') }}>
							{categoryArr.map((item, key) => { return (<Picker.Item label={item.name} value={item.name} key={key} />) })}
						</Picker>
					</View>

					<TouchableOpacity
						style={commonStyles.button}
						onPress={this.saveContact}>
						<Text>Save</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAwareScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		//justifyContent:'space-between',
		backgroundColor: Colors.background,
		alignItems: 'center',
	},
	imageStyle: {
		height: 120,
		width: 120,
		borderRadius: 100,
		borderWidth: 1,
		borderColor: Colors.primaryColor,
		backgroundColor: Colors.black,
		marginVertical: 20
	}
});

export default AddContacts;
