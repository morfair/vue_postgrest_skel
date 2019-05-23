
module.exports = {
  tokens: ['refresh','access'],
  request: function (req, token) {

        var tokens = token.split(';');

        if (req.url == "auth/refresh") {
          this.options.http._setHeaders.call(this, req, {Authorization: 'Bearer ' + tokens[0]});
        } else {
          this.options.http._setHeaders.call(this, req, {Authorization: 'Bearer ' + tokens[1]});
        }
  },

  response: function (res) {
    var tok = [];
    if ( res.data[0] && res.data[0].access ) {
        tok.push(res.data[0].refresh);
        tok.push(res.data[0].access);
        return tok.join(';');
    }
  }
};
