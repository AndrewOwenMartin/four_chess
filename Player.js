var Player = new Class({
    initialize: function(options){
        this.id = options["id"]
        this.name = options["name"]
        this.color = options["color"]
    }
})
var players = {
    "none":{
        "id":0,
        "name":"none"
    },
    "marn":{
        "id":1,
        "name":"Marn",
        "code":"marn",
        "score":0,
        "score_cell":null,
        "color":"green"
    },
    "bruno":{
        "id":2,
        "name":"Bruno",
        "code":"bruno",
        "score":0,
        "score_cell":null,
        "color":"red"
    },
    "chad":{
        "id":3,
        "name":"Chad",
        "code":"chad",
        "score":0,
        "score_cell":null,
        "color":"white"
    },
    "malcolm":{
        "id":4,
        "name":"Malcolm",
        "code":"malcolm",
        "score":0,
        "score_cell":null,
        "color":"yellow"
    }
}
