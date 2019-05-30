<template>
	
	<v-content>
	<v-container fluid fill-height>

		<v-layout align-center justify-center>
			<v-flex xs12 sm8 md4>

				<v-card class="elevation-12">

						<v-toolbar dark color="primary">
							<v-toolbar-title>Login form</v-toolbar-title>
							<v-spacer></v-spacer>
						</v-toolbar>

						<v-card-text>
							<v-form>

								<v-text-field
									prepend-icon="person"
									name="login"
									label="Login"
									type="text"
									v-model="user.email">
								</v-text-field>

								<v-text-field
									id="password"
									prepend-icon="lock"
									name="password" label="Password"
									type="password"
									v-model="user.pass">
								</v-text-field>

							</v-form>
						</v-card-text>

						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="primary" v-on:click="logIn">Login</v-btn>
						</v-card-actions>

					</v-card>

					<v-progress-linear :indeterminate="true" v-if="p.loading"></v-progress-linear>

					<v-alert
						:value="p.login_error"
						type="error"
					>
						Ошибка входа<br />
						<small>{{ p.response }}</small>
					</v-alert>

			</v-flex>
		    </v-layout>
		</v-container>
	</v-content>
</template>


<script>

	import API from '@/lib/API'

	export default {

		data() {
			return {
				user: {},
				res: {},
				p: {
					loading: false,
					login_error: false,
				},
			}
		},

		props: {
			source: String
		},

		methods: {

			logIn(event) {
				this.p.login_error = false;
				this.p.loading = true;
				this.$auth.login({
					data: this.user,
					// success: res => console.log(res),
					error: error => {
						this.p.loading = false;
						this.p.login_error = true;
						this.p.response = `${error.response.data.message}, (code: ${error.response.data.code})`;
					},
				})
			},

		},

	};


</script>
