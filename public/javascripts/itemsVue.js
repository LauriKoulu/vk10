var url = 'https://api.mlab.com/api/1/databases/local_library/collections/items?apiKey=i0tCYutvccPPCzMneb1bq0xN2-GUdgZB';

var component = new Vue({
    el: '#app',
    created: function(){
    },

    mounted: function(){
        this.items = getItems();
    },

    data: {
        items:{},
        msg: 'default'
    },
        
    methods: {
        getItems: function(){
            // get items from database
            axios
                .get(url)
                .then(res => {
                    return res.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
     
    }
})

module.exports = component;