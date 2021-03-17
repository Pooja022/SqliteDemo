

export default class CommonFunction {

	static myInstance = null;


	/**
	 * @returns {CommonFunction}
	 */
	static getInstance() {
		if (CommonFunction.myInstance == null) {
			CommonFunction.myInstance = new CommonFunction();
		}

		return this.myInstance;
	}

	constructor() {

	}


 
}