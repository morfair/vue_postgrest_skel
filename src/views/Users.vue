<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>

        <material-card color="green" title="User List" text="Users, who can log in in the system">
          <v-data-table :headers="headers" :items="items" hide-actions>
            
            <template slot="headerCell" slot-scope="{ header }">
              <span
                class="subheading font-weight-light text-success text--darken-3" v-text="header.text" />
            </template>
            
            <template slot="items" slot-scope="{ item }">
              <td>{{ item.email }}</td>
              <td>{{ item.full_name }}</td>
              <td>{{ item.role }}</td>
              <td class="text-xs-right">{{ item.disabled }}</td>
            </template>

          </v-data-table>
        </material-card>

        <v-btn color="success" class="right" :to='{ name: "UserMod" }'>Add User</v-btn>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

  import API from '@/lib/API'

  export default {

    data: () => ({
      
      headers: [
        {
          sortable: false,
          text: 'E-Mail',
          value: 'email'
        },
        {
          sortable: false,
          text: 'Full Name',
          value: 'full_name'
        },
        {
          sortable: false,
          text: 'Role',
          value: 'role'
        },
        {
          sortable: false,
          text: 'Disabled',
          value: 'disabled',
          align: 'right'
        }
      ],

      items: [],

    }),

    mounted () {
      this.load();
    },

    methods: {
     
      load() {
          API.getUsers().then(
            res => {
              console.log(res.data);
              this.items = res.data;
            },
            err => console.log(err)
          );
      },

    }
 
  }

</script>
