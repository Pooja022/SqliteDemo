import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	FlatList,
	Image,
	Alert
} from 'react-native';
import Colors from '../Utils/Colors';
import Constant from '../Utils/Constant';
import SQLite from 'react-native-sqlite-storage';
import Images from '../Utils/Images';
import { commonStyles } from '../Utils/CommonStyles';
import { printLog } from '../Utils/Validator';

let db;

class AddCategory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			category: [],
			categoryName: '',
			btnTitle: 'Save',
			updateItemId: '',
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

	success = () => {
		try {
			db.transaction(tx => {
				tx.executeSql(
					'CREATE TABLE IF NOT EXISTS Category(cid INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20))',
					[],
				);
			});

			this.showCategory();
		} catch (error) {
			alert(error)
		}

	};

	fail = error => {
		console.error(error);
		alert(' '); // logging out error if there is one
	};

	onSaveCategory = () => {
		const { categoryName, btnTitle } = this.state;
		if (categoryName == '') {
			alert('Please enter Name of Category');
		} else if (btnTitle == 'Save') {
			this.insertCategory();
			this.showCategory();
		} else if (btnTitle == 'Update') {
			let name = this.state.categoryName;
			let cid = this.state.updateItemId;

			db.transaction(tx => {
				tx.executeSql(
					'UPDATE Category set name=? where cid=?',
					[name, cid],
					(tx, results) => {
						console.log('Results', results.rowsAffected);
						if (results.rowsAffected > 0) {
							alert('Category updated successfully');
							this.setState({
								btnTitle: 'Save'
							}, () => this.showCategory())
						} else alert('Updation Failed');
					},
				);
			});
		}
	};

	handleChange = (value, name) => {
		this.setState({
			[name]: value,
		});
	};



	insertCategory = () => {
		let name = this.state.categoryName;

		db.transaction(function (tx) {
			tx.executeSql(
				'INSERT INTO Category (name) VALUES (?)',
				[name],
				(tx, results) => {
					console.log('Results', results.rowsAffected);
					if (results.rowsAffected > 0) {
					} else alert(Constant.tryAgain);
				},
			);
		});
	};

	showCategory = () => {
		this.setState({
			categoryName: ''
		})
		db.transaction(tx => {
			tx.executeSql('SELECT * FROM Category', [], (tx, results) => {
				// sql query to get all table data and storing it in 'results' variable
				let category = []; //creating empty array to store the rows of the sql table data

				for (let i = 0; i < results.rows.length; i++) {
					category.push(results.rows.item(i)); //looping through each row in the table and storing it as object in the 'users' array
				}
				this.setState({ category: category }); //setting the state(userlist) with users array which has all the table data
			});
		});
	};

	onDeletePress = (itemId) => {
		Alert.alert(
			//title
			'Delete Category',
			//body
			'Are you sure you want to delete this Category ?',
			[
				{
					text: 'Yes',
					onPress: () => this.deleteCategory(itemId)
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

	deleteCategory = itemId => {
		db.transaction(tx => {
			tx.executeSql(
				'DELETE FROM  Category where cid=?',
				[itemId],
				(tx, results) => {
					console.log('Results', results.rowsAffected);
					if (results.rowsAffected > 0) {
						printLog('Category deleted successfully');
					} else {
						alert('Please insert a valid User Id');
					}
				},
			);
		});
		this.showCategory();
	};

	updateCategory = item => {
		//alert(JSON.stringify(item));
		this.setState({
			categoryName: item.name,
			btnTitle: 'Update',
			updateItemId: item.cid,
		});
	};

	render() {
		const { category, btnTitle, categoryName } = this.state;
		return (
			<View style={styles.container}>
				<View style={{ justifyContent: 'space-around', flex: 1, alignItems: 'center' }}>
					<TextInput
						value={categoryName}
						placeholder={'Add Category'}
						maxLength={10}
						style={[commonStyles.inputStyle, { width: 200 }]}
						onChangeText={value => this.handleChange(value, 'categoryName')}
					/>

					<TouchableOpacity
						style={styles.buttonStyle}
						onPress={this.onSaveCategory}>
						<Text>{btnTitle}</Text>
					</TouchableOpacity>
				</View>

				<View style={{ flex: 1 }}>
					{category.length > 0 ? (
						<FlatList
							data={category}
							contentContainerStyle={{ marginBottom: 20 }}
							keyExtractor={item => item.cid.toString()}
							renderItem={({ item }) =>
								renderCategory(item, this.updateCategory, this.onDeletePress)
							}
						/>
					) : (
						<Text>Please add category to see the list</Text>
					)}
				</View>
			</View>
		);
	}
}

const renderCategory = (item, onUpdateCategory, onDeletePress) => {
	return (
		<View>

			<View style={styles.cardContainer}>
				<Text style={styles.title}>{item.name}</Text>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						flex: 0.7,
					}}>
					<TouchableOpacity onPress={() => onUpdateCategory(item)}>
						<Image source={Images.Edit} style={styles.imageStyle} />
					</TouchableOpacity>

					<TouchableOpacity onPress={() => onDeletePress(item.cid)}>
						<Image source={Images.delete1} style={styles.imageStyle} />
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.categorySeprator} />

		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-around',
		backgroundColor: Colors.background,
		alignItems: 'center',
	},
	cardContainer: {
		justifyContent: 'center',
		paddingHorizontal: 10,
		backgroundColor: Colors.categoryBackground,
		flex: 1,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
	},
	title: {
		color: Colors.black,
		fontSize: 17,
		width: '70%',
		marginVertical: 3,
	},



	buttonStyle: {
		backgroundColor: Colors.primaryColor,
		width: 100,
		height: 40,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},

	imageStyle: {
		height: 25,
		width: 25,
	},
	categorySeprator: {
		borderColor: Colors.categorySeprator,
		borderWidth: 1
	}
});

export default AddCategory;
