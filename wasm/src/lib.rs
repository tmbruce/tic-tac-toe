use std::{cmp, vec};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log(string: String);
}

fn check_for_winner(game_board: [char; 9]) -> (bool, Vec<usize>, char) {
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
    let mut player: char = ' ';
    for v in win_table {
        if game_board[v[0]] == 'X' || game_board[v[0]] == 'O' {
            if game_board[v[0]] == game_board[v[1]] && game_board[v[0]] == game_board[v[2]] {
                winner = true;
                winning_vec = v;
                player = game_board[winning_vec[0]];
            }
            if winner == true {
                return (winner, winning_vec, player);
            }
        }
    }
    return (winner, winning_vec, player);
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

fn score(_board: [char; 9], player: char) -> i32 {
    let (winner, _, _player) = check_for_winner(_board);
    if winner && player == _player {
        return 1;
    } else if winner && player != _player {
        return -1;
    } else {
        return 0;
    }
}

fn minimax(
    _board: [char; 9],
    depth: i32,
    mut alpha: i32,
    mut beta: i32,
    maximizing: bool,
    maximizing_player: char,
) -> i32 {
    let score = score(_board, maximizing_player);
    let mut best_move = 0;
    if score != 0 {
        return score;
    } else {
        let mut board = _board.clone();
        if maximizing {
            let mut best_score = -1000;
            let mut i = 0;
            while i < board.len() {
                if board[i] == ' ' {
                    board[i] = maximizing_player;
                    let score = minimax(board, depth - 1, alpha, beta, false, maximizing_player);
                    board[i] = ' ';
                    best_move = if score > best_score { i } else { best_move };
                    best_score = cmp::max(best_score, score);
                    alpha = cmp::max(alpha, best_score);
                    if beta <= alpha {
                        break;
                    }
                }
                i += 1;
            }
        } else {
            let mut worst_score = 1000;
            let mut i = 0;
            while i < board.len() {
                if board[i] == ' ' {
                    board[i] = if maximizing_player == 'X' { 'O' } else { 'X' };
                    let score = minimax(board, depth - 1, alpha, beta, true, maximizing_player);
                    board[i] = ' ';
                    worst_score = cmp::min(score, worst_score);
                    beta = cmp::min(beta, score);
                    if beta <= alpha {
                        break;
                    }
                }
                i += 1;
            }
            return worst_score;
        }
    }
    best_move as i32
}

#[wasm_bindgen]
pub fn find_move(game_board: String) -> String {
    let mut iter = game_board.split_whitespace();
    let maximizing_player = iter.next().unwrap();
    let _board = iter.next().unwrap();
    let board: [char; 9] = input_to_array(String::from(_board));
    let (winner, moves, _) = check_for_winner(board);
    if winner {
        return format!("{}-{:?}{:?}{:?}", winner, moves[0], moves[1], moves[2]);
    } else {
        let next_move = minimax(
            board,
            9,
            -1000,
            1000,
            true,
            maximizing_player.chars().next().unwrap(),
        );
        format!("{}", next_move)
    }
}
