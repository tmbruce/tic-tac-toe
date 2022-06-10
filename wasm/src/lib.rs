use std::vec;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log(string: String);
}

fn check_for_winner(game_board: [char; 9]) -> (bool, Vec<usize>) {
    let win_table = vec![
        vec![0, 1, 2],
        vec![3, 4, 5],
        vec![6, 7, 8],
        vec![0, 3, 6],
        vec![1, 4, 7],
        vec![2, 5, 8],
        vec![0, 4, 8],
        vec![2, 4, 6],
    ];

    let mut winner: bool = false;
    let mut winning_vec: Vec<usize> = vec![0; 3];
    for v in win_table {
        if game_board[v[0]] == 'X' || game_board[v[0]] == 'O' {
            if game_board[v[0]] == game_board[v[1]] && game_board[v[0]] == game_board[v[2]] {
                winner = true;
                winning_vec = v;
            }
            if winner == true {
                return (winner, winning_vec);
            }
        }
    }
    return (winner, winning_vec);
}

fn input_to_array(game_board: String) -> [char; 9] {
    let mut board: [char; 9] = [' '; 9];
    let mut index = 0;
    let mut last_char = ',';
    for v in game_board.chars() {
        if index == 0 && v == ',' {
            board[index] = ' ';
            index += 1;
        } else if v == 'X' || v == 'O' {
            board[index] = v;
            index += 1;
        } else if v == ',' && last_char == ',' {
            board[index] = ' ';
            index += 1;
        }
        last_char = v;
    }
    board
}

#[wasm_bindgen]
pub fn find_move(game_board: String) -> String {
    let board: [char; 9] = input_to_array(game_board);
    let (winner, moves) = check_for_winner(board);
    if winner {
        return format!("{}-{:?}{:?}{:?}", winner, moves[0], moves[1], moves[2]);
    } else {
        return String::from('1');
    }
}
