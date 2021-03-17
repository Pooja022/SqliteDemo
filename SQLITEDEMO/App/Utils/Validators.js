export const isEmpty = value => {
	return value.trim() === '';
};
export const isEmail = value => {
	const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return emailRegex.test(value);
};

export const isSpace = value => {
	let regSpace = new RegExp(/\s/);
	return regSpace.test(value);
};

export const hasNumbers = value => {
	let regex = /\d/;
	return regex.test(value);
};

export const isNameValid = value => {
	//alert(value)
	//let regex = /^[A-Za-z]+$/;
	let regex = /^([a-zA-Z ]+)$/;
	return regex.test(value);
};

export const printLog = (title, value) => {
	let isLogEnable = true;
	if (isLogEnable) {
		console.log(title, value);
	}
};

export const isPasswordValid = value => {
	// 8 to 15 , 1 small letter, 1 Capital letter
	console.log(value)
	const passRegex = /(?=^.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*/;
	return passRegex.test(value);
}
 