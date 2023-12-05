const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(express.json());

// Define the /evaluate endpoint
app.post('/evaluate', (req, res) => {
  const { fen } = req.body;

  if (!fen) {
    return res.status(400).json({ error: 'FEN string is required.' });
  }

  // Run Stockfish command to evaluate the position and get the best move
  exec(`stockfish position fen ${fen} go depth 15`, (error, stdout) => {
    console.log('Stockfish Output:', stdout); // Add this line for logging
  
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' });
    }

    // Parse Stockfish output to extract evaluation and best move
    const [evaluation, bestMove] = stdout.match(/score (cp|mate) (-?\d+).*?pv (\w+)/);

    // Return the evaluation and best move in JSON format
    res.json({
      evaluation: evaluation ? parseFloat(evaluation[2]) : null,
      bestMove: bestMove || null,
    });
  });
});

// Handle requests to the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Stockfish API. Use the /evaluate endpoint to get chess position evaluation.');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
