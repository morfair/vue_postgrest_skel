<template>
    <v-container class=lds-centered>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-form v-model="valid" id="login-form" @submit.prevent="logIn">
                    <v-card class="elevation-12 ">
                        <v-card-text>
                            <v-text-field v-model="user.login" label="Пользователь" required></v-text-field>
                            <v-text-field :append-icon="show4passw ? 'visibility_off' : 'visibility'" :type="show4passw ? 'text' : 'password'" @click:append="show4passw = !show4passw" v-model="user.password" label="Пароль" required></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn type="submit" color="primary" form="login-form" :loading="loading">Войти</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    export default {
        name: 'Login',
        props: {
            msg: String
        },
        data: () => ({
            valid: false,
            user: {
                login: '',
                password: ''
            },
            loading: false,
            show4passw: false,
        }),
        methods: {

            logIn(event) {
                // console.log(this.user);
                //this.p.login_error = false;
                this.loading = true;
                this.$auth.login({
                    data: this.user,
                    // success: res => console.log(res),
                    error: error => {
                        this.loading = false;
                        //this.p.login_error = true;
                    },

                })
            },

        },


    }
</script>
