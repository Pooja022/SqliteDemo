import {StyleSheet} from 'react-native';
import Colors from '../Utils/Colors';


export const commonStyles = StyleSheet.create({

	inputStyle: {
		borderWidth: 1,
		borderColor: Colors.primaryColor,
		width: '80%',
		marginVertical:5
	  },

	  button:{
		backgroundColor: Colors.primaryColor,
		width: 100,
		height: 40,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical:10
	  }
});
 