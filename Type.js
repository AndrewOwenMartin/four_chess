var Type = new Class({
    initialize: function(options){
        this.letter = options["letter"]
        this.moves = options["moves"]
        this.id = options["id"]
        this.img_pos = options["img_pos"]
        this.reward = options["reward"]
    }
})
var types = {
    "empty": new Type({
        "letter":" ",
        "id":0,
    }),
    "pawn": new Type({
        "letter":"p",
        "id":1,
        "img_pos":0,
        "reward":1,
        "moves":pawn_moves
    }),
    "rook": new Type({
        "letter":"r",
        "id":2,
        "img_pos":-96,
        "reward":2,
        "moves":long_moves
    }),
    "knight": new Type({
        "letter":"n",
        "id":3,
        "img_pos":-32,
        "reward":2,
        "moves":knight_moves
    }),
    "bishop": new Type({
        "letter":"b",
        "id":4,
        "img_pos":-64,
        "reward":2,
        "moves":long_moves
    }),
    "king": new Type({
        "letter":"k",
        "id":5,
        "img_pos":-160,
        "reward":2,
        "moves":king_moves
    })
}
