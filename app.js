const express = require('express');
const { spawn } = require('child_process');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

// Define the /evaluate endpoint
app.post('/evaluate', (req, res) => {
  const { fen } = req.body;

  if (!fen) {
    return res.status(400).json({ error: 'FEN string is required.' });
  }

  // Spawn Stockfish process
  const stockfish = spawn('/usr/local/bin/stockfish');  // Use the command without specifying the path
  let stockfishOutput = '';

  // Event handler for Stockfish output
  stockfish.stdout.on('data', (data) => {
    stockfishOutput += data.toString();

    // Check if Stockfish has finished analyzing
    if (stockfishOutput.includes('bestmove')) {
      const lines = stockfishOutput.split('\n');
      const bestMoveLine = lines.find((line) => line.includes('bestmove'));

      let evaluation = null;

      // Extract evaluation information from the entire output
      const evalMatch = stockfishOutput.match(/score (cp|mate) (-?\d+) /);
      if (evalMatch) {
        const [, scoreType, scoreValue] = evalMatch;
        const adjustedValue = (fen.includes('w') ? 1 : -1) * parseInt(scoreValue);
        const value = (scoreType === 'mate') ? `#${adjustedValue}` : adjustedValue;
        evaluation = {
          type: scoreType,
          value: parseInt(value),
        };
      }

      if (bestMoveLine && evaluation !== null) {
        const matchBestMove = bestMoveLine.match(/^bestmove (\w+)/);
        const [_, bestMove] = matchBestMove;

        // Close the Stockfish process
        stockfish.stdin.write('quit\n');
        stockfish.stdin.end();

        // Return the result in JSON format
        res.json({
          bestMove: bestMove || null,
          evaluation,
        });
      } else {
        // Handle the case where no valid output is received
        console.error('Invalid Stockfish Output:', stockfishOutput);
        res.status(500).json({ error: 'Invalid Stockfish output.' });

        // Close the Stockfish process
        stockfish.stdin.write('quit\n');
        stockfish.stdin.end();
      }
    }
  });

  // Event handler for errors
  stockfish.on('error', (error) => {
    console.error('Stockfish Execution Error:', error);
    res.status(500).json({ error: 'Internal server error.', details: error.message });
  });

  // Event handler for closing the Stockfish process
  stockfish.on('close', (code) => {});

  // Send the UCI commands for analysis
  stockfish.stdin.write('uci\n');
  stockfish.stdin.write('isready\n');
  stockfish.stdin.write(`position fen ${fen}\ngo movetime 1000\n`);
});

// Handle requests to the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Stockfish API. Use the /evaluate endpoint to get chess position evaluation.');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});
