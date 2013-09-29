var FourChess = new Class({
    initialize: function(main_div_id,players){
        this.main_div = $(main_div_id)
        this.build_board(this.main_div)
        this.build_names(this.main_div,players)
        this.build_score(this.main_div)
        
        this.restart_game()
        this.init_score(this.score)
    },
    build_names: function(main_div,players){
        var names_div =  Element('div',{
            "id":"names"
        }).inject(main_div)
        Array.each(players,function(player,index){
            var row = Math.floor(index / 2)
            var col = index % 2
            Element('div',{
                "id":player.code,
                "class":["name","notyourmove",player.color].join(" "),
                "html":"King<br />" + player.name,
                "styles":{
                    "left":col * this.board_size[0],
                    "top":row * (this.board_size[1] + this.name_tag_size[1]),
                    "width":this.name_tag_size[0]
                }
            }).inject(names_div)
        }.bind(this))
    },
    draw_board: function(state,board_div){
        board_div.getChildren().destroy()
        for(var col = 0; col < 8; col++){
            for(var row = 0; row < 8; row++){
                var id_str = "p_" + col + "_" + row
                if(state[col][row].player.id == 0){
                    continue
                }
                //console.log(state[col][row].type.img_pos)
                Element('div',{
                    "class":"piece " + state[col][row].player.code,
                    //"text": state[col][row].type.letter,
                    "id":id_str,
                    "styles":{
                        "left":col * this.square_px,
                        "top":row * this.square_px,
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
        var piece_el = $(o_id_str)
        piece_el.set({
            "id":d_id_str
        })
        new Fx.Morph(piece_el,{
            transition: Fx.Transitions.Quad.easeOut,
            link: 'chain',
            duration: 2000
        }).start({
            "left":d_col * this.square_px,
            "top":d_row * this.square_px
        });
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
                    "width":this.square_px,
                    "height":this.square_px
                }
            }).inject(this.hilites)
        }.bind(this))
    },
    create_piece: function(type,player,pos){
        this.state[pos[0]][pos[1]] = make_state(type,player,pos) 
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
        
        if(d_square.player.id != 0){
            //score the killing
            var reward = this.kill_square(d_square,o_square.player.id)
            piece.player.score += reward
            piece.player.score_cell.set('text',piece.player.score)
        }
        this.state[d_col][d_row] = o_square

        this.state[o_col][o_row] = make_state("empty","none",[o_col,o_row])

        this.deselect_piece()
        
        var next_player_index = (this.player_order.indexOf(this.current_player)+1)%this.player_order.length
        $(this.current_player.code).addClass('notyourmove')
        $(this.current_player.code).removeClass('yourmove')
        this.current_player = this.player_order[next_player_index]
        $(this.current_player.code).removeClass('notyourmove')
        $(this.current_player.code).addClass('yourmove')
        
        this.redraw_squares(o_col,o_row,d_col,d_row)
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
        if(false){
            this.create_piece("bishop","chad",[3,4])
            this.create_piece("king","chad",[2,4])
            this.create_piece("pawn","malcolm",[2,3])
            this.create_piece("rook","bruno",[4,5])
            this.create_piece("pawn","bruno",[4,2])
            this.create_piece("knight","marn",[3,5])
            //this.create_piece("king",,[,])
        }
        this.player_order = [
            players["marn"],
            players["bruno"],
            players["chad"],
            players["malcolm"]
        ]
        this.current_player = this.player_order[0]
        Array.each(this.player_order,function(player){
            $(player.code).removeClass('dead')
        })
        $$(".name").addClass('notyourmove')
        $(this.current_player.code).removeClass('notyourmove')
        $(this.current_player.code).addClass('yourmove')
        this.selected_piece = null
        this.shown_moves = []
        this.draw_board(this.state,this.board_squares_div)
    },
    kill_square: function(square,killer_id){
        var reward = 0
        var square_type = square.type
        var square_player = square.player
        square.type = types["empty"]
        square.player = players["none"]
        if(square_type.id > 0){
            reward += square_type.reward
            var d_id_str = "p_" + square.pos[0] + "_" + square.pos[1]
            var taken_piece = $(d_id_str)
            if(taken_piece){
                taken_piece.removeProperty("id")
                new Fx.Tween(taken_piece,{
                    duration: 2000,
                    property: "opacity"
                }).chain(function(){
                    taken_piece.destroy()
                }).start(1,0)
            }
            if(square_type.id == 5){
                reward += this.kill_player(square_player)
            }
        }
        return reward
    },
    kill_player: function(player){
        var player_index = this.player_order.indexOf(player)
        var player_id = player.id
        if(player_index > -1){
            var dead_player = this.player_order.splice(player_index,1)
            $(dead_player[0].code).addClass('dead')
        }
        var kings_ransom = 0
        var s = this.state
        for(var col = 0; col < 8; col++){
            for(var row = 0; row < 8; row++){
                if(s[col][row].player.id == player_id){
                    kings_ransom += this.kill_square(s[col][row])
                }
            }
        }
        return kings_ransom 
    },
    build_score: function(main_div){
        var score = Element('div',{
            "id":"score"
        }).inject(main_div)
        this.score = score
        var table = Element("table",{
            "class":"score"
        }).inject(score)
    },
    init_score: function(score_div){
        console.log(this.player_order)
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
    build_board: function(main_div){
        this.square_px = 50
        this.board_size = [500,500]
        this.board_edge = [50,50]
        this.name_tag_size = [162,120]
        var board_wrapper_div = Element('div',{
            "id":"board_wrapper",
            "styles":{
                "width":this.square_px * 8 + this.board_edge[0] * 2,
                "height":this.square_px * 8 + this.board_edge[1] * 2,
                "left":this.name_tag_size[0]/2,
                "top":this.name_tag_size[1]
            }
        }).inject(main_div)
        var board_squares_div = Element('div',{
            "id":"board",
            "styles":{
                "left":this.board_edge[0],
                "top":this.board_edge[1]
            },
            "events":{
                "click:relay(.piece)": function(my_event){
                    var id_str = my_event.target.id.split("_")
                    var col = id_str[1].toInt()
                    var row = id_str[2].toInt()
                    if(this.state[col][row].player.id == this.current_player.id){
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
        }).inject(board_wrapper_div)
        this.board_squares_div = board_squares_div
        
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
                        "width":this.square_px,
                        "height":this.square_px,
                        "top":(row * this.square_px),
                        "left":(col * this.square_px),
                        "background-color":bg_col
                    }
                }).inject(board)
            }
        }
    }
})
