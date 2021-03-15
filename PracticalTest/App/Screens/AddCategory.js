import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import Colors from '../Utils/Colors';
import SQLite from 'react-native-sqlite-storage';
import Images from '../Utils/Images';

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
        name: 'dbTest.db',
        createFromLocation: 2,
      },
      this.success, //okCallback
      this.fail, // error callback
    );
  }

  success = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Category(cid INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20))',
        [],
      );
    });

    this.showCategory();
  };

  fail = error => {
    console.error(error);
    alert(' '); // logging out error if there is one
  };

  onSaveCategory = () => {
    const {categoryName, btnTitle} = this.state;
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
                btnTitle:'Save'
              },()=>this.showCategory())
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
            alert('Category inserted Successfully');
          } else alert('Please try again');
        },
      );
    });
  };

  showCategory = () => {
    this.setState({
      categoryName:''
    })
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Category', [], (tx, results) => {
        // sql query to get all table data and storing it in 'results' variable
        let category = []; //creating empty array to store the rows of the sql table data

        for (let i = 0; i < results.rows.length; i++) {
          category.push(results.rows.item(i)); //looping through each row in the table and storing it as object in the 'users' array
        }
        this.setState({category: category}); //setting the state(userlist) with users array which has all the table data
      });
    });
  };

  deleteCategory = itemId => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM  Category where cid=?',
        [itemId],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            alert('Category deleted successfully');
          } else {
            alert('Please insert a valid User Id');
          }
        },
      );
    });
    this.showCategory();
  };

  updateCategory = item => {
    alert(JSON.stringify(item));
    this.setState({
      categoryName: item.name,
      btnTitle: 'Update',
      updateItemId: item.cid,
    });
  };

  render() {
    const {category, btnTitle, categoryName} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <TextInput
            value={categoryName}
            placeholder={'Add Category'}
            maxLength={10}
            style={styles.inputStyle}
            onChangeText={value => this.handleChange(value, 'categoryName')}
          />

          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.onSaveCategory}>
            <Text>{btnTitle}</Text>
          </TouchableOpacity>
        </View>

        <View style={{flex: 1}}>
          {category.length > 0 ? (
            <FlatList
              data={category}
              contentContainerStyle={{marginBottom: 20}}
              keyExtractor={item => item.cid.toString()}
              renderItem={({item}) =>
                renderCategory(item, this.updateCategory, this.deleteCategory)
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

const renderCategory = (item, onUpdateCategory, onDeleteCategory) => {
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

        <TouchableOpacity onPress={() => onDeleteCategory(item.cid)}>
          <Image source={Images.delete1} style={styles.imageStyle} />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.categorySeprator}/>

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

  inputStyle: {
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    width: 200,
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
  categorySeprator:{
    borderColor:Colors.categorySeprator,
    borderWidth:1
  }
});

export default AddCategory;
