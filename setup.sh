#!/bin/bash

# Create a directory to store Stockfish in /app
mkdir -p app/bin

# Install Stockfish
echo "Downloading Stockfish..."
wget https://stockfishchess.org/files/stockfish-linux.zip

echo "Unzipping Stockfish..."
unzip stockfish-linux.zip

echo "Setting execute permissions for Stockfish..."
chmod +x stockfish

# Move the Stockfish executable to the /app/bin directory
mv stockfish app/bin/

# Display the new path to Stockfish
echo "Stockfish installed in: app/bin/stockfish"

# Confirm Stockfish version
echo "Stockfish version:"
/app/bin/stockfish -v
