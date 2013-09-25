
var Type = new Class({
    initialize: function(options){
        this.letter = options["letter"]
        this.moves = options["moves"]
    }
})
function pawn_moves(state,pos){
    console.log(pos)
    return "pawn"
}
function rook_moves(state,pos){
    console.log(pos)
    return "blah"
}
function knight_moves(state,pos){
    console.log(pos)
    return "blah"
}
function bishop_moves(state,pos){
    console.log(pos)
    return "blah"
}
function king_moves(state,pos){
    console.log(pos)
    return "blah"
}
var types = {
    "empty": new Type({
        "letter":" "
    }),
    "pawn": new Type({
        "letter":"p",
        "moves":pawn_moves
    }),
    "rook": new Type({
        "letter":"r",
        "moves":rook_moves
    }),
    "knight": new Type({
        "letter":"n",
        "moves":knight_moves
    }),
    "bishop": new Type({
        "letter":"b",
        "moves":bishop_moves
    }),
    "king": new Type({
        "letter":"k",
        "moves":king_moves
    })
}
var Owner = new Class({
    initialize: function(options){
        this.id = options["id"]
        this.name = options["name"]
        this.color = options["color"]
    }
})
var owners = {
    "none":{
        "id":0,
        "name":"none"
    },
    "marn":{
        "id":1,
        "name":"Marn",
        "color":"#f00"
    },
    "bruno":{
        "id":2,
        "name":"Bruno",
        "color":"#0f0"
    },
    "chad":{
        "id":3,
        "name":"Chad",
        "color":"#00f"
    },
    "malcolm":{
        "id":4,
        "name":"Malcolm",
        "color":"#0ff"
    }
}

function pawn_moves(pos, state){
    return "blah"
}

function make_state(type,owner){
    return {
        "type":types[type],
        "owner":owners[owner]
    }
}


var Four_Chess = new Class({
    initialize: function(main_div_id){
        this.square_px = 50
        this.state = []
        for(var col = 0; col < 8; col++){
            this.state[col] = []
            for(var row = 0; row < 8; row++){
                this.state[col][row] = make_state("empty","none")
            }
        }
        this.create_piece("king","marn",[0,7])
        this.create_piece("pawn","marn",[0,5])
        this.create_piece("pawn","marn",[1,5])
        this.create_piece("pawn","marn",[2,7])
        this.create_piece("pawn","marn",[2,6])
        this.create_piece("king","bruno",[0,0])
        this.create_piece("pawn","bruno",[2,0])
        this.create_piece("pawn","bruno",[2,1])
        this.create_piece("pawn","bruno",[0,2])
        this.create_piece("pawn","bruno",[1,2])
        this.create_piece("king","chad",[7,0])
        this.create_piece("pawn","chad",[5,0])
        this.create_piece("pawn","chad",[5,1])
        this.create_piece("pawn","chad",[7,2])
        this.create_piece("pawn","chad",[6,2])
        this.create_piece("king","malcolm",[7,7])
        this.create_piece("pawn","malcolm",[5,7])
        this.create_piece("pawn","malcolm",[5,6])
        this.create_piece("pawn","malcolm",[7,5])
        this.create_piece("pawn","malcolm",[6,5])
        this.create_piece("knight","marn",[1,6])
        this.create_piece("knight","bruno",[1,1])
        this.create_piece("knight","chad",[6,1])
        this.create_piece("knight","malcolm",[6,6])
        this.create_piece("rook","marn",[0,6])
        this.create_piece("rook","bruno",[1,0])
        this.create_piece("rook","chad",[7,1])
        this.create_piece("rook","malcolm",[6,7])
        this.create_piece("bishop","marn",[1,7])
        this.create_piece("bishop","bruno",[0,1])
        this.create_piece("bishop","chad",[6,0])
        this.create_piece("bishop","malcolm",[7,6])

        var board = Element('div',{
            "id":"board"
        }).inject($(main_div_id))
        this.board_div = board
        this.build_board(this.board_div)
        this.draw_board(this.state,this.board_div)
    },
    draw_board: function(state,board_div){
        var square_px = this.square_px
        for(var col = 0; col < 8; col++){
            for(var row = 0; row < 8; row++){
                if(state[col][row].owner.id == 0){
                    continue
                }
                Element('div',{
                    "class":"piece",
                    "text": state[col][row].type.letter,
                    "events":{
                        "click": function(e){
                            //console.log(state)
                            //console.log(col) 8!
                            //console.log(row) 8!
                            console.log([col,row])
                            //state[col][row].type.moves(state,[col,row])
                        }
                    },
                    "styles":{
                        "top":row * square_px,
                        "left":col * square_px,
                        "width":square_px,
                        "height":square_px,
                        "color":state[col][row].owner.color
                    }
                }).inject(board_div)
            }
        }
    },
    create_piece: function(type,owner,pos){
        this.state[pos[0]][pos[1]] = make_state(type,owner) 
    },
    build_board: function(board_div){
        square_px = this.square_px
        board_div.setStyles({
            "width":square_px*8,
            "height":square_px*8
        })
        for(var col = 0; col < 8; col++){
            for(var row = 0; row < 8; row++){
                if((col+row)%2 == 0 ){
                    var bg_col = "#fff"
                }else{
                    var bg_col = "#000"
                }
                Element('div',{
                    "class":"square",
                    "styles":{
                        "width":square_px,
                        "height":square_px,
                        "top":(row * square_px),
                        "left":(col * square_px),
                        "background-color":bg_col
                    }
                }).inject(board_div)
            }
        }
    }
})
