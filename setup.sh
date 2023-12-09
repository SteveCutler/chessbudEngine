#!/bin/bash

# Create a directory to store Stockfish in /app
mkdir -p /app/bin

# Install Stockfish
wget https://stockfishchess.org/files/stockfish-linux.zip
unzip stockfish-linux.zip
chmod +x stockfish

# Move the Stockfish executable to the /app/bin directory
mv stockfish /app/bin/

# Display the new path to Stockfish
echo "Stockfish installed in: /app/bin/stockfish"
