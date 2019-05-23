<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex xs12 md8>
        
        <material-card color="green" title="Edit Profile" text="Complete your profile">
          <v-form ref="form" v-model="valid">
            <v-container py-0>
              
              <v-layout wrap>
                
                <v-flex xs12 md4>
                  <v-text-field label="E-Mail" class="purple-input" v-model="form.email" :rules="emailRules" required />
                </v-flex>
                
                <v-flex xs12 md8>
                  <v-text-field label="Full Name" class="purple-input" v-model="form.full_name" :rules="fullnameRules" required />
                </v-flex>
                
                <v-flex xs12 md6>
                  <v-text-field label="Password" class="purple-input" type="password" v-model="form.pass" :rules="passRules" required />
                </v-flex>

                <v-flex xs12 md6>
                  <v-text-field label="Repeat Password" class="purple-input" type="password" v-model="form.pass2" :rules="pass2Rules" required />
                </v-flex>

                <v-flex xs12 md6>
                  <v-select label="Role" class="purple-input" :items="roles" v-model="form.role" required></v-select>
                </v-flex>
                

                <v-flex xs12 text-xs-right>
                  <!-- <v-btn class="mx-0 font-weight-light" color="success" :disabled="valid" @click="submit">Submit</v-btn> -->
                  <v-btn class="mx-0 font-weight-light" color="success" @click="submit">Submit</v-btn>
                </v-flex>

              </v-layout>

            </v-container>
          </v-form>
        </material-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

  import API from '@/lib/API'
  
  export default {

    data() {

      return {
        form: {},
        valid: false,
        roles: [],

        emailRules: [
          v => !!v || 'Required',
        ],
        fullnameRules: [
          v => !!v || 'Required',
        ],
        passRules: [
          v => !!v || 'Required',
        ],
        pass2Rules: [
          v => !!v || 'Required',
          v => {
            if ( v != this.form.pass ) {
              return 'Passwords do not match'
            } else {
              return true
            }
          },
        ],
      }

    },

    mounted () {
      this.load();
    },

    methods: {
     
      load() {
          API.getRoles().then(
            res => {
              // console.log(res);
              res.data.forEach((item, i) => {
                this.roles.push(item.rolname);
              });
            },
            err => console.log(err)
          );
      },

      submit() {
        if (this.$refs.form.validate()) {
          delete this.form.pass2
          console.log(this.form);
          // Native form submission is not yet supported
          // API.addUser(this.form).then(
          //   res => {
          //     this.$router.push({name: "accounts"})
          //   },
          //   err => console.log(err)
          // )
        }

      },

    }


  }
</script>
