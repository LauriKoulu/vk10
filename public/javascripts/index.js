//create model
//var itemsUrl = "http://localhost:3000/api/items";
//var userUrl = "http://localhost:3000/api/users";
var url = 'https://api.mlab.com/api/1/databases/local_library/collections/items?apiKey=i0tCYutvccPPCzMneb1bq0xN2-GUdgZB';

// var Item = require('../../models/ItemsModel');
//axios.defaults.headers.post['Content-Type'] = 'application/json';

Vue.component("list", {
    props: ["items", "add", "remove"],
    template: '<ul class="collection with-header" v-if="items.length"><div class="teal-text text-darken-2"><li class="collection-header center teal teal-text text-lighten-4"><h4>Notepad</h4></li><li class="collection-item" v-for="(item, index) in items"><div class="section"> {{item.name}}  <button class="btn-small waves-effect waves-teal secondary-content" v-on:click="remove(item._id.$oid)">Remove</button></div></li></div></ul>'
})

export default {
    created: function(){
        this.getItems();
    },
    data: {
        items:[],
        itemName: '',
        max: 20,
        loading: true,
        errored: false,
        done: false,
        msg: 'default'
    },
        
    methods: {
        getItems: function(){
            // get items from database
            axios
                .get(url)
                .then(res => {
                    this.items = res.data;
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(()=> {
                    this.loading = false;
                    this.done = true;
                })
            this.setTime();
        },

        remove(index) {
            console.log(index);
            axios.delete("https://api.mlab.com/api/1/databases/local_library/collections/items/"+index+"?apiKey=i0tCYutvccPPCzMneb1bq0xN2-GUdgZB")
            .then(function (response) {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
                this.errored = true;
            })
            .finally(()=> {
                this.getItems(); // refresh items
            })
            /*this.items.splice(index, 1);
            const parsed = JSON.stringify(this.items);
            localStorage.setItem('items', parsed);*/
        },
        
        add() {
            if (!this.checkInput(this.itemName)) {
                return;
            }
            // post item to list
            axios
            .post(url, {
                name: this.itemName
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
                this.errored = true;
            })
            .finally(()=>{
                this.getItems(); // refresh items
            })
        
            this.itemName = '';
        },
        
        checkInput(itemName) {
            var re = /^[a-öA-Ö0-9., ]+$/;
            return re.test(itemName);
        },

        setTime() {
            document.getElementById("time").innerHTML = Date();
        },
        
    }
};