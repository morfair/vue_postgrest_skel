module.exports = {

	request: function (req, token) {			
		this.options.http._setHeaders.call(this, req, {Authorization: 'Bearer ' + token});
	},

	response: function (res) {
		// console.log(res);
		if ( res.data[0] ) {
			return res.data[0].token;
		}
	},
};
