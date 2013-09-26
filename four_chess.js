
var Type = new Class({
    initialize: function(options){
        this.letter = options["letter"]
        this.moves = options["moves"]
        this.id = options["id"]
        this.img_pos = options["img_pos"]
        this.reward = options["reward"]
    }
})
function pawn_moves(state,col,row){
    valid_moves = []
    var piece_owner = state[col][row].owner.id
    for(var c = -1; c < 2; c++){
        for(var r = -1; r < 2; r++){
            if(c == 0 && r == 0){
                continue
            }
            var new_col = c + col
            var new_row = r + row
            if(new_col < 0 || new_row < 0 || new_col > 7 || new_row > 7){
                continue
            }
            var square = state[new_col][new_row]
            if(c == 0 || r == 0){
                //orthogonal
                if(square.type.id == 0){
                    valid_moves.push([new_col,new_row])
                }
            }else{
                //diagonal
                if(square.type.id != 0 && square.owner.id != piece_owner){
                    valid_moves.push([new_col,new_row])
                }
            }
        }
    }
    return valid_moves
}
function king_moves(state,col,row){
    var moves = []
    var piece_owner = state[col][row].owner.id
    for(var c = -1; c < 2; c++){
        for(var r = -1; r < 2; r++){
            var new_col = col + c
            var new_row = row + r
            if(new_col < 0 || new_row < 0 || new_col > 7 || new_row > 7){
                continue
            }
            var square = state[new_col][new_row] 
            if((square.type.id == 0 || square.owner.id != piece_owner) && !threatened(piece_owner,state,new_col,new_row)){
                moves.push([new_col,new_row])
            }
        }
    }
    return moves
}
function threatened(owner,state,col,row){
    //check for enemy knights
    var knight_moves = [
        [col + 2, row + 1],
        [col + 2, row - 1],
        [col - 2, row + 1],
        [col - 2, row - 1],
        [col - 1, row + 2],
        [col + 1, row + 2],
        [col - 1, row - 2],
        [col + 1, row - 2]
    ]
    var not_threatened = knight_moves.every(function(pos){
        if(pos[0] < 0  || pos[1] < 0 || pos[0] > 7 || pos[1] > 7){
            return true
        }
        var square = state[pos[0]][pos[1]]
        if(square.type.id == 3 && square.owner.id != owner ){
            return false
        }
        return true
    })
    if(!not_threatened){
        //console.log("position [" + col + ", " + row + "] threatened by knight")
        return true
    }
    //check for enemy pawns
    var pawn_attacks = [
        [col + 1, row + 1],
        [col + 1, row - 1],
        [col - 1, row + 1],
        [col - 1, row - 1]
    ]
    not_threatened = pawn_attacks.every(function(pos){
        //console.log("pawn")
        if(pos[0] < 0  || pos[1] < 0 || pos[0] > 7 || pos[1] > 7){
            return true
        }
        var square = state[pos[0]][pos[1]]
        //console.log("looking for pawn on square [" + col + ", " + row + "]")
        if(square.type.id == 1 && square.owner.id != owner){
            //console.log("found!")
            return false
        }else{
            //console.log("NOT found!")
        }
        return true
    })
    if(!not_threatened){
        //console.log("position [" + col + ", " + row + "] threatened by pawn")
        return true
    }
    //check for enemy kings
    var king_attacks = [
        [col + 1, row + 1],
        [col + 1, row - 1],
        [col - 1, row + 1],
        [col - 1, row - 1],
        [col, row + 1],
        [col, row - 1],
        [col - 1, row],
        [col + 1, row]
    ]
    not_threatened = king_attacks.every(function(pos){
        if(pos[0] < 0  || pos[1] < 0 || pos[0] > 7 || pos[1] > 7){
            return true
        }
        var square = state[pos[0]][pos[1]]
        if(square.type.id == 5 && square.owner.id != owner){
            return false
        }
        return true
    })
    if(!not_threatened){
        //console.log("position [" + col + ", " + row + "] threatened by king")
        return true
    }
    //check for enemy rooks
    var rook_dirs = [
        [ 0, 1],
        [ 0,-1],
        [-1, 0],
        [ 1, 0]
    ]
    not_threatened = rook_dirs.every(function(dir){
        var pos = [col,row]
        var blank_space = true
        while(blank_space){
            blank_space = false
            pos[0] += dir[0]
            pos[1] += dir[1]
            if(pos[0] < 0  || pos[1] < 0 || pos[0] > 7 || pos[1] > 7){
                return true
            }
            var square = state[pos[0]][pos[1]]
            if(square.type.id == 2 && square.owner.id != owner){
                return false
            }
            if(square.type.id == 0){
                blank_space = true
            }else{
                return true
            }
        }
        return true
    })
    if(!not_threatened){
        //console.log("position [" + col + ", " + row + "] threatened by rook")
        return true
    }

    //check for enemy bishops
    var bishop_dirs = [
        [ 1, 1],
        [ 1,-1],
        [-1, 1],
        [-1,-1]
    ]
    not_threatened = bishop_dirs.every(function(dir){
        var pos = [col,row]
        var blank_space = true
        while(blank_space){
            blank_space = false
            pos[0] += dir[0]
            pos[1] += dir[1]
            if(pos[0] < 0  || pos[1] < 0 || pos[0] > 7 || pos[1] > 7){
                return true
            }
            var square = state[pos[0]][pos[1]]
            if(square.type.id == 4 && square.owner.id != owner){
                return false
            }
            if(square.type.id == 0){
                blank_space = true
            }else{
                return true
            }
        }
        return true
    })
    if(!not_threatened){
        //console.log("position [" + col + ", " + row + "] threatened by bishop")
        return true
    }
    return false
}
function long_moves(state,col,row){
    var moves = []
    var piece_owner = state[col][row].owner.id
    var orthogonal = state[col][row].type.id == 2
    for(var c = -1; c < 2; c++){
        for(var r = -1; r < 2; r++){
            if(orthogonal){
                if(
                    (c == 0 && r == 0)
                    || (c != 0 && r != 0)
                ){
                    //filter diagonal, or "rest"
                    continue
                }
            }else{
                if(c == 0 || r == 0){
                    //filter orthogonal, or "rest"
                    continue
                }
            }
            var new_col = col
            var new_row = row
            var blank_squares = true
            while(blank_squares){
                new_col += c
                new_row += r
                blank_squares = false
                if(new_col < 0 || new_col > 7 || new_row < 0 || new_row > 7){
                    //filter board edges
                    continue
                }
                var square = state[new_col][new_row] 
                if(square.type.id == 0 || square.owner.id != piece_owner){
                    if(square.type.id == 0){
                        blank_squares = true
                    }
                    moves.push([new_col,new_row])
                }
            }
        }
    }
    return moves
}
function knight_moves(state,col,row){
    var potential_squares = []
    if(col > 1){
        if(row > 0){
            potential_squares.push([col-2,row-1])
        }
        if(row < 7){
            potential_squares.push([col-2,row+1])
        }
    }
    if(col < 6){
        if(row > 0){
            potential_squares.push([col+2,row-1])
        }
        if(row < 7){
            potential_squares.push([col+2,row+1])
        }
    }
    if(row > 1){
        if(col > 0){
            potential_squares.push([col-1,row-2])
        }
        if(col < 7){
            potential_squares.push([col+1,row-2])
        }
    }
    if(row < 6){
        if(col > 0){
            potential_squares.push([col-1,row+2])
        }
        if(col < 7){
            potential_squares.push([col+1,row+2])
        }
    }
    var actual_squares = []
    var owner_id = state[col][row].owner.id
    Array.each(potential_squares,function(sq_pos){
        var square = state[sq_pos[0]][sq_pos[1]]
        if(square.type.id == 0 || square.owner.id != owner_id){
            actual_squares.push(sq_pos)
        }
    })
    return actual_squares
}
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
        "code":"marn",
        "score":0,
        "score_cell":null,
        "color":"#f00"
    },
    "bruno":{
        "id":2,
        "name":"Bruno",
        "code":"bruno",
        "score":0,
        "score_cell":null,
        "color":"#0f0"
    },
    "chad":{
        "id":3,
        "name":"Chad",
        "code":"chad",
        "score":0,
        "score_cell":null,
        "color":"#00f"
    },
    "malcolm":{
        "id":4,
        "name":"Malcolm",
        "code":"malcolm",
        "score":0,
        "score_cell":null,
        "color":"#0ff"
    }
}

function make_state(type,owner,pos){
    return {
        "type":types[type],
        "owner":owners[owner],
        "pos":pos
    }
}


var Four_Chess = new Class({
    initialize: function(main_div_id,score_div_id){
        this.square_px = 50
        
        this.build_board(main_div_id)
        this.restart_game()
        this.build_score(score_div_id)
    },
    draw_board: function(state,board_div){
        board_div.getChildren().destroy()
        var square_px = this.square_px
        for(var col = 0; col < 8; col++){
            for(var row = 0; row < 8; row++){
                var id_str = "p_" + col + "_" + row
                if(state[col][row].owner.id == 0){
                    continue
                }
                //console.log(state[col][row].type.img_pos)
                Element('div',{
                    "class":"piece " + state[col][row].owner.code,
                    //"text": state[col][row].type.letter,
                    "id":id_str,
                    "styles":{
                        "left":col * square_px,
                        "top":row * square_px,
                        "background-position":state[col][row].type.img_pos
                    }
                }).inject(board_div)
            }
        }
        if(this.hilites){
            this.hilites.destroy()
        }
        var hilites = Element('div',{
            "id":"hilites",
        })
        hilites.inject(board_div)
        this.hilites = hilites
    },
    redraw_squares: function(o_col,o_row,d_col,d_row){
        //move existing element
        var o_id_str = "p_" + o_col + "_" + o_row
        var d_id_str = "p_" + d_col + "_" + d_row
        $(o_id_str).set({
            "id":d_id_str,
            "styles":{
                "left":d_col * this.square_px,
                "top":d_row * this.square_px
            }
        })
    },
    draw_moves: function(){
        var moves = this.shown_moves
        this.hilites.getChildren().destroy()
        Array.each(moves,function(move){
            Element('div',{
                "id":"h_" + move[0]+ "_" + move[1],
                "class":"hilite",
                "styles":{
                    "left":move[0] * this.square_px,
                    "top":move[1] * this.square_px,
                    "width":square_px,
                    "height":square_px
                }
            }).inject(this.hilites)
        }.bind(this))
    },
    create_piece: function(type,owner,pos){
        this.state[pos[0]][pos[1]] = make_state(type,owner,pos) 
    },
    deselect_piece: function(){
        this.shown_moves.empty()
        this.draw_moves()
        this.selected_piece = null
    },
    move_selected_piece: function(d_col,d_row){
        var piece = this.selected_piece
        var origin = piece.pos
        var o_col = origin[0]
        var o_row = origin[1]
        var o_square = this.state[o_col][o_row]
        var d_square = this.state[d_col][d_row]
        
        piece.pos = [d_col,d_row]
        
        if(d_square.owner.id != 0){
            //score the killing
            var reward = this.kill_square(d_square,o_square.owner.id)
            //console.log("giving " + reward + " points to " + piece.owner.name)
            piece.owner.score += reward
            piece.owner.score_cell.set('text',piece.owner.score)
        }
        this.state[d_col][d_row] = o_square

        this.state[o_col][o_row] = make_state("empty","none",[o_col,o_row])

        this.deselect_piece()
        var next_player_index = (this.player_order.indexOf(this.current_player)+1)%this.player_order.length
        //console.log(next_player_index)
        //console.log(this
        $(this.current_player.code).addClass('notyourmove')
        $(this.current_player.code).removeClass('yourmove')
        this.current_player = this.player_order[next_player_index]
        $(this.current_player.code).removeClass('notyourmove')
        $(this.current_player.code).addClass('yourmove')
        this.redraw_squares(o_col,o_row,d_col,d_row)
        //console.log("moving")
        //console.log(this.selected_piece)
        //console.log("to ["+ col +", "+row+"]")
        if(this.player_order.length < 2){
            this.restart_game()
        }
    },
    restart_game : function(){
        this.state = []
        for(var col = 0; col < 8; col++){
            this.state[col] = []
            for(var row = 0; row < 8; row++){
                this.state[col][row] = make_state("empty","none",[col,row])
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

        //test pieces
        if(true){
            this.create_piece("bishop","chad",[3,4])
            this.create_piece("king","chad",[2,4])
            this.create_piece("pawn","malcolm",[2,3])
            this.create_piece("rook","bruno",[4,5])
            this.create_piece("pawn","bruno",[4,2])
            this.create_piece("knight","marn",[3,5])
            //this.create_piece("king",,[,])
        }
        this.player_order = [
            owners["marn"],
            owners["bruno"],
            owners["chad"],
            owners["malcolm"]
        ]
        this.current_player = this.player_order[0]
        $$(".name").addClass('notyourmove')
        $(this.current_player.code).removeClass('notyourmove')
        $(this.current_player.code).addClass('yourmove')
        this.selected_piece = null
        this.shown_moves = []
        this.draw_board(this.state,this.board_div)
    },
    kill_square: function(square,killer_id){
        var reward = 0
        var square_type = square.type
        var square_owner = square.owner
        square.type = types["empty"]
        square.owner = owners["none"]
        if(square_type.id > 0){
            //console.log(square_type)
            reward += square_type.reward
            var d_id_str = "p_" + square.pos[0] + "_" + square.pos[1]
            var taken_piece = $(d_id_str)
            if(taken_piece){
                taken_piece.destroy()
            }
            if(square_type.id == 5){
                reward += this.kill_owner(square_owner)
            }
        }
        //square make_state("empty","none",[o_col,o_row])
        //console.log("returning "+reward)
        return reward
    },
    kill_owner: function(owner){
        var owner_index = this.player_order.indexOf(owner)
        var owner_id = owner.id
        if(owner_index > -1){
            var dead_owner = this.player_order.splice(owner_index,1)
            $(dead_owner[0].code).addClass('dead')
        }
        var kings_ransom = 0
        var s = this.state
        for(var col = 0; col < 8; col++){
            for(var row = 0; row < 8; row++){
                if(s[col][row].owner.id == owner_id){
                    kings_ransom += this.kill_square(s[col][row])
                }
            }
        }
        return kings_ransom 
    },
    build_surround: function(){
        Element('div',{
        }).inject($('main'))
    },
    build_score: function(score_div_id){
        var score = $(score_div_id)
        this.score = score
        var table = Element("table",{
            "class":"score"
        }).inject(score)
        Array.each(this.player_order,function(item){
            var row = Element('tr',{
            }).inject(score)
            Element('td',{
                "text":item.name
            }).inject(row)
            var score_cell = Element('td',{
                "id":"score_"+item.code,
                "text":item.score
            }).inject(row)
            item.score_cell = score_cell
        })
    },
    build_board: function(main_div_id){
        square_px = this.square_px
        var board = Element('div',{
            "id":"board",
            "styles":{
                "width":square_px*8,
                "height":square_px*8,
            },
            "events":{
                "click:relay(.piece)": function(my_event){
                    var id_str = my_event.target.id.split("_")
                    var col = id_str[1].toInt()
                    var row = id_str[2].toInt()
                    if(this.state[col][row].owner.id == this.current_player.id){
                        this.selected_piece = this.state[col][row]
                        this.shown_moves = this.state[col][row].type.moves(this.state,col,row)
                    }else{
                        this.deselect_piece()
                    }
                    this.draw_moves()
                }.bind(this),
                "click:relay(.hilite)": function(my_event_2){
                    var id_str = my_event_2.target.id.split("_")
                    var col = id_str[1].toInt()
                    var row = id_str[2].toInt()
                    this.move_selected_piece(col,row)
                }.bind(this)
            }
        }).inject($(main_div_id))
        this.board_div = board
        
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
                }).inject(board)
            }
        }
    }
})
