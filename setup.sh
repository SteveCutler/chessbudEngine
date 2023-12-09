#!/bin/bash

# Create a directory to store Stockfish in /app
mkdir -p /app/bin
echo "making bin..."

# Install Stockfish
echo "Downloading Stockfish..."
wget https://github.com/official-stockfish/Stockfish/releases/download/sf_16/stockfish-ubuntu-x86-64-avx2.tar

echo "Unzipping Stockfish..."
tar -xvf stockfish-ubuntu-x86-64-avx2.tar

# Move the Stockfish executable to the /app/bin directory
mv stockfish/stockfish-ubuntu-x86-64-avx2 /app/bin/stockfish

# Display the new path to Stockfish
echo "Stockfish installed in: app/bin/stockfish"

# Confirm Stockfish version
echo "Stockfish version:"
/app/bin/stockfish --version