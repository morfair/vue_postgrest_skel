import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

export default {

	getRoles() {
		return axios.get('/roles');
	},

	getUsers() {
		return axios.get('/users');
	},

	addUser(data) {
		return axios.post("/users", data);
	},

	// updateAccount(account, data) {
	// 	return axios.patch(`/accounts?account=eq.${account}`, data);
	// },

}