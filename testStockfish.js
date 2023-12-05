const { spawn } = require('child_process');

const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const stockfishPath = 'stockfish'; // Replace with the actual path to Stockfish

// Spawn Stockfish process
const stockfish = spawn(stockfishPath);

// Event handler for Stockfish output
// Event handler for Stockfish output
stockfish.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
  
    // Check for analysis information in the output
    const match = output.match(/^info .+? (score (cp|mate) (-?\d+).*? pv (\w+)|bestmove (\w+))/);
    if (match) {
      const [_, __, scoreType, score, move, bestMove] = match;
      console.log('Evaluation:', scoreType === 'cp' ? parseFloat(score) : scoreType === 'mate' ? `Mate in ${score}` : null);
      console.log('Best Move:', bestMove || move || null);
  
      // Exit the Stockfish process after receiving analysis
      stockfish.kill();
    }
  });
  

// Event handler for errors
stockfish.on('error', (error) => {
  console.error('Stockfish Execution Error:', error);
});

// Send the FEN position for analysis
stockfish.stdin.write(`position fen ${fen}\ngo depth 15\n`);
