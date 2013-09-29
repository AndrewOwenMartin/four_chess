function pawn_moves(state,col,row){
    valid_moves = []
    var piece_player = state[col][row].player.id
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
                if(square.type.id != 0 && square.player.id != piece_player){
                    valid_moves.push([new_col,new_row])
                }
            }
        }
    }
    return valid_moves
}
function king_moves(state,col,row){
    var moves = []
    var piece_player = state[col][row].player.id
    for(var c = -1; c < 2; c++){
        for(var r = -1; r < 2; r++){
            var new_col = col + c
            var new_row = row + r
            if(new_col < 0 || new_row < 0 || new_col > 7 || new_row > 7){
                continue
            }
            var square = state[new_col][new_row] 
            if((square.type.id == 0 || square.player.id != piece_player) && !threatened(piece_player,state,new_col,new_row)){
                moves.push([new_col,new_row])
            }
        }
    }
    return moves
}
function threatened(player,state,col,row){
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
        if(square.type.id == 3 && square.player.id != player ){
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
        if(square.type.id == 1 && square.player.id != player){
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
        if(square.type.id == 5 && square.player.id != player){
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
            if(square.type.id == 2 && square.player.id != player){
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
            if(square.type.id == 4 && square.player.id != player){
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
    var piece_player = state[col][row].player.id
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
                if(square.type.id == 0 || square.player.id != piece_player){
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
    var player_id = state[col][row].player.id
    Array.each(potential_squares,function(sq_pos){
        var square = state[sq_pos[0]][sq_pos[1]]
        if(square.type.id == 0 || square.player.id != player_id){
            actual_squares.push(sq_pos)
        }
    })
    return actual_squares
}

function make_state(type,player,pos){
    return {
        "type":types[type],
        "player":players[player],
        "pos":pos
    }
}


