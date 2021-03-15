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
	let regex = /^([a-zA-Z ]+)$/;
	return regex.test(value);
};

export const isContactNumberValid = value => {
	let regex  = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
	return regex.test(value);
};

export const printLog = (title, value) => {
	let isLogEnable = true;
	if (isLogEnable) {
		console.log(title, value);
	}
};

