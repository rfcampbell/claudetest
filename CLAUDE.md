# claudetest — Tic-Tac-Toe Web App

## What we built
A browser-based tic-tac-toe game with two modes: 2-player local and vs an unbeatable AI. Served as a Flask app behind gunicorn and nginx on the robix home server, consistent with the existing app setup on that machine.

## Stack
- **Backend**: Flask (Python), served by gunicorn
- **Frontend**: Vanilla HTML/CSS/JS — no frameworks
- **AI**: Minimax with alpha-beta pruning (client-side, in game.js)
- **Web server**: nginx reverse proxy → gunicorn on 127.0.0.1:5002
- **Process management**: systemd service (`tictactoe.service`)
- **Repo**: https://github.com/rfcampbell/claudetest

## Key decisions
- **Port 5002**: Ports 5000 (waterscribe) and 5001 (plantchap) were already in use; 5002 was next available.
- **All game logic in JS**: No server-side game state — keeps the backend trivial and the game snappy.
- **Minimax + alpha-beta**: AI is unbeatable but fast; alpha-beta pruning keeps it efficient.
- **Matched existing patterns**: systemd service, gunicorn workers, nginx virtual host, and `*.robix` hostname all follow the same conventions as waterscribe and plantchap.
- **Added to robix index**: Entry added to `/var/www/robix/index.html` alongside the other services.

## File structure
```
claudetest/
├── app.py              # Flask app, single route
├── wsgi.py             # gunicorn entrypoint
├── requirements.txt    # flask, gunicorn
├── templates/
│   └── index.html      # game UI
├── static/
│   ├── style.css       # dark theme styling
│   └── game.js         # all game logic + minimax AI
├── tictactoe.service   # systemd unit file (copied to /etc/systemd/system/)
├── tictactoe.nginx     # nginx site config (copied to /etc/nginx/sites-enabled/)
└── venv/               # Python virtualenv (not in git)
```

## Networking
- nginx virtual host: `games.robix` → `127.0.0.1:5002`
- Static files served directly by nginx from `static/`
- Accessible at http://games.robix on the local network
- Listed on the robix index page at http://robix
