# Odin Proejct Tic-Tac-Toe
<p align="center"><img align="center" src='https://user-images.githubusercontent.com/47762048/174463263-b3d13c54-2848-4827-b6ed-8bb43a54ac1a.png'/></p>
This is tic-tac-toe for the Odin Project javascript section. The purpose of this exercise is to explore organizational patterns in software. The primary objectives were to reduce or eliminate global variables and to use modern software patterns to organize the code in an effective manner.

## Implementation
To meet the goals of this project, the Javascript module pattern was implemented. Each module was constructed with immediately invoked function expressions. With few exceptions, each module communicates with the 'pubsub' pattern. This allows for decoupled modules with little to no dependence on any other module. The user interface was developed with typical HTML/CSS/Javascript. 

## Extras
An optional goal of implementing an AI player was included in this project. Users can select for the AI to be first (X) or second (O). Also available is an option to adjust difficulty to suit player level. At the "extreme" setting, the AI player is virtually unbeatable.
<p align="center"><img src='https://user-images.githubusercontent.com/47762048/174463781-698f5ec7-8d4a-4cbb-8eb5-9d8cffc312ac.png'/></p>

## Behind the scenes
The AI player for this example was created by using the Minimax algorithm with alpha-beta pruning. Minimax is a recursive algorithm that constructs a tree representing any possible outcome of the game based on the current state of the board. Using this representation, the algorithm passes a score up the tree  assigned to each possible outcome. Using these scores, the algorithm is able to select the outcome which will maximize the AI players possibility for success, while minimizing the opponent's potential outcome. In the case of tic-tac-toe, the computation time to eneumerate all possible outcomes is relatively trivial, but as the scope of a game expands, computation will increase exponentially. Connect four, for example, would require significant increases in computation time to capture all possible outcomes. Alpha-beta pruning can significantly increase computation speed by pruning unnecessary leaves or entire branches from the tree, eliminating the need to compute outcomes for unlikely scenarios.

## Web Assembly
In order to maintain fast computations, several key functionalities were implemented in Rust and complied to Web Assembly using the wasm-pack build tool. Both the minimax algorithm and gameboard state evaluation are implemented in Rust/WASM.

<p align="center">
<img width="200" src='https://user-images.githubusercontent.com/47762048/174461520-606ec561-3fdb-4a74-aa2c-54a70e2cbf59.png'/>
<img width="200" src='https://user-images.githubusercontent.com/47762048/174461521-d0ef97cb-4b2c-4fdb-86f9-461585f99378.png'/>
<img width="200" src='https://user-images.githubusercontent.com/47762048/174463580-255b259f-f61a-496f-985a-184a9dba5b99.png'/>
<img width="200" src='https://user-images.githubusercontent.com/47762048/174461317-0b4803de-267e-410f-9cab-61d067984b84.png'/>
</p>

