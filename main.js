class TypingGame {
      constructor() {
            this.words = ['computador', 'monitor', 'mouse', 'teclado', 'notebook', 'bug', 'gambiarra', 'windows', 'linux', 'javascript', 'css', 'html', 'café', 'cereja', 'chuchu', 'uno', 'codigo', 'vim', 'vscode', 'terminal', 'cliente', 'console.log', 'for', 'if', 'while', 'get', 'água', 'boleto', 'item', 'titulo', 'convenio', 'pagamento', 'recebimento', 'pdf', 'relatorio', 'api', 'retaguarda', 'loja', 'mercado', 'width', 'height', 'telefone', 'ergonomico', 'find', 'teste', 'forEach', 'json', 'impressora', 'etiqueta', 'nota fiscal', 'financeiro', 'paz', 'minuto', 'que qui foi?', 'docinho', 'banana', 'escala', 'loading', 'programacao', 'estagiario', 'junior', 'pleno', 'senior', 'chefe', 'jclan', 'vendas', 'imposto', 'pessoas', 'empresas', 'mensalidade', 'faturamento', 'operacao', 'grupo', 'cheque', 'dinheiro', 'cartao', 'pix', 'tecnospeed', 'banco', 'credito', 'movimentacao', 'vale compta', 'estoque', 'pedido', 'balança', 'embalagem', 'gerenciador', 'fornecedor', 'colaborador', 'usuario', 'contador', 'contabilidade', 'perfil', 'liberacao', 'typescript', 'banco de dados', 'dbeaver', 'sql', 'query', 'software', 'suporte', 'mobile', 'ajuda', 'duvida', 'help', 'erro', 'error', 'warning', 'alerta']

            this.specialWords = ['hayashi', 'filipe', 'jean', 'rafael', 'fedner dabady', 'luís', 'paulo', 'andressa', 'daiana', 'alex', 'thiago', 'fauze', 'gabriel']

            this.canvas = document.getElementById('gameCanvas');
            this.ctx = this.canvas.getContext('2d');

            this.startButton = document.getElementById('start-button');
            this.timerDisplay = document.getElementById('timer-display');
            this.scoreDisplay = document.getElementById('score-display');
            this.input = document.getElementById('word-input');
            this.gameInfo = document.getElementById('game-info');

            this.resizeCanvas();
            window.addEventListener('resize', this.resizeCanvas.bind(this));

            this.startButton.addEventListener('click', this.startGame.bind(this));

            this.fallingWords = [];
            this.timer = 60;
            this.score = 0;
            this.timerInterval = null;
            this.gameStartTime = 0;
            this.currentDifficulty = 1;
      }

      resizeCanvas() {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = Math.min(window.innerHeight * 0.7, 500);
      }

      updateScore(points) {
            this.score += points;
            this.scoreDisplay.textContent = this.score;
      }

      startGame() {
            this.startButton.style.display = 'none';
            this.input.style.display = 'block';
            this.gameInfo.style.display = 'flex';
            this.fallingWords = [];
            this.currentDifficulty = 1;
            this.score = 0;
            this.updateScore(0);
            this.timer = 60;
            this.gameStartTime = Date.now();
            this.updateTimerDisplay();

            this.input.focus();
            this.input.addEventListener('keypress', this.checkWord.bind(this));

            this.timerInterval = setInterval(() => {
                  this.timer--;
                  this.updateScore(1);
                  this.updateTimerDisplay();

                  const elapsedTime = Math.floor((Date.now() - this.gameStartTime) / 1000);

                  this.currentDifficulty = Math.floor(elapsedTime / 30) + 1;

                  if (elapsedTime >= 30 && Math.random() < 0.3) {
                        this.spawnWord(true);
                  }

                  if (this.timer <= 0) {
                        this.gameOver('Time is up!');
                  }
            }, 1000);

            this.spawnWord();
            this.gameLoop();
      }

      updateTimerDisplay() {
            const minutes = Math.floor(this.timer / 60);
            const seconds = this.timer % 60;
            this.timerDisplay.textContent =
                  `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      }

      spawnWord(isSpecial = false) {
            let wordsType = isSpecial ? 'specialWords' : 'words'
            const word = this[wordsType][Math.floor(Math.random() * this[wordsType].length)];
            const x = Math.random() * (this.canvas.width - 100);
            this.fallingWords.push({
                  text: word,
                  x: x,
                  y: 0,
                  speed: Math.max(0.5, Math.random() * this.currentDifficulty),
                  isSpecial
            });

            setTimeout(() => this.spawnWord(isSpecial), Math.max(500, 2000 - (this.currentDifficulty * 200)));
      }

      gameLoop() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let i = this.fallingWords.length - 1; i >= 0; i--) {
                  const word = this.fallingWords[i];
                  word.y += word.speed;

                  this.ctx.font = '20px "Press Start 2P"';
                  this.ctx.fillStyle = word.isSpecial ? '#FF4500' : 'lime';
                  this.ctx.fillText(word.text, word.x, word.y);

                  if (word.y > this.canvas.height) {
                        const timePenalty = word.isSpecial ? 10 : 5;
                        this.createTimeIndicator(`-${timePenalty}s`, 'time-loss',
                              word.x + this.canvas.offsetLeft,
                              this.canvas.offsetTop + this.canvas.height);

                        this.fallingWords.splice(i, 1);
                        this.missWord(timePenalty);
                  }
            }

            if (this.timer > 0) {
                  requestAnimationFrame(this.gameLoop.bind(this));
            }
      }

      checkWord(event) {
            if (event.key === 'Enter') {
                  const typedWord = this.input.value;
                  for (let i = 0; i < this.fallingWords.length; i++) {
                        if (this.fallingWords[i].text === typedWord) {
                              const time = this.fallingWords[i].isSpecial ? 10 : 5;
                              this.createTimeIndicator(`+${time}s`, 'time-gain',
                                    this.fallingWords[i].x + this.canvas.offsetLeft,
                                    this.fallingWords[i].y + this.canvas.offsetTop);

                              this.fallingWords.splice(i, 1);
                              this.input.value = '';
                              this.addTime(time);
                              this.updateScore(time);
                              return;
                        }
                  }

                  this.missWord(5);
                  this.input.value = '';
            }
      }

      addTime(amount) {
            this.timer += amount;
            this.updateTimerDisplay();
      }

      missWord(amount) {
            this.timer -= amount;
            this.updateTimerDisplay();

            if (this.timer <= 0) {
                  this.gameOver('Out of time!');
            }
      }

      gameOver(message) {
            clearInterval(this.timerInterval);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.input.style.display = 'none';
            this.gameInfo.style.display = 'none';
            this.startButton.style.display = 'block';
            alert(`${message}\nFinal Score: ${this.score}`);
      }

      createTimeIndicator(message, type, x, y) {
            const indicator = document.createElement('div');
            indicator.classList.add('time-indicator', type);
            indicator.textContent = message;
            indicator.style.left = `${x}px`;
            indicator.style.top = `${y}px`;
            document.body.appendChild(indicator);
            requestAnimationFrame(() => {
                  indicator.style.opacity = '1';
                  indicator.style.transform = `translateY(-50px)`;
            });
            setTimeout(() => {
                  document.body.removeChild(indicator);
            }, 1000);
      }
}

window.onload = () => {
      const game = new TypingGame();
};