#!/bin/bash

# Install Stockfish
wget https://stockfishchess.org/files/stockfish-linux.zip
unzip stockfish-linux.zip
chmod +x stockfish

# Move the Stockfish executable to a location in your PATH
mv stockfish /usr/local/bin/
