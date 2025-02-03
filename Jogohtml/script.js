document.addEventListener('DOMContentLoaded', () => {
    const telaInicial = document.getElementById('tela-inicial');
    const telaSelecao = document.getElementById('tela-selecao');
    const telaRanking = document.getElementById('tela-ranking');
    const telaJogo = document.getElementById('tela-jogo');
    const botaoJogar = document.getElementById('jogar');
    const botaoRanking = document.getElementById('ranking');
    const botaoSair = document.getElementById('sair');
    const botaoComecarPartida = document.getElementById('comecar-partida');
    const botaoVoltarInicio = document.getElementById('voltar-inicio');
    const botaoVoltarSelecao = document.getElementById('voltar-selecao');
    const botaoVoltarJogo = document.getElementById('voltar-jogo');
    const personagens = document.querySelectorAll('.personagem');
    const nomeJogador = document.getElementById('nome-jogador');
    const tabelaRanking = document.getElementById('tabela-ranking').getElementsByTagName('tbody')[0];
    const canvas = document.getElementById('canvas-jogo');
    const ctx = canvas.getContext('2d');
    const pontuacaoElement = document.getElementById('pontuacao');
    const vidasElement = document.getElementById('vidas');

    const tamanhoCelula = 20; // Tamanho de cada célula (20x20 pixels)
    const larguraMapa = 21; // Número de colunas
    const alturaMapa = 18; // Número de linhas

    // Matriz do mapa
    const mapa = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
        [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 1, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 1, 1, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
        [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    let personagem = { x: 10, y: 1, direcao: 'direita' }; // Spawn do jogador (linha 1, coluna 10)
    let inimigos = [];
    let moedas = [];
    let powerUps = [];
    let pontuacao = 0;
    let vidas = 3;
    let powerUpAtivo = false;
    let tempoPowerUp = 0;

    // Inicializar moedas e power-ups
    for (let y = 0; y < alturaMapa; y++) {
        for (let x = 0; x < larguraMapa; x++) {
            if (mapa[y][x] === 1) {
                moedas.push({ x, y });
            } else if (mapa[y][x] === 2) {
                powerUps.push({ x, y });
            } else if (mapa[y][x] === 3) {
                inimigos.push({ x, y, direcao: 'parado', estado: 'normal' });
            }
        }
    }

    // Função para desenhar o mapa
    function desenharMapa() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < alturaMapa; y++) {
            for (let x = 0; x < larguraMapa; x++) {
                if (mapa[y][x] === 0) {
                    ctx.fillStyle = 'blue'; // Obstáculos
                } else if (mapa[y][x] === 1 || mapa[y][x] === 4) {
                    ctx.fillStyle = 'black'; // Caminhos
                } else if (mapa[y][x] === 2) {
                    ctx.fillStyle = 'yellow'; // Power-ups
                } else if (mapa[y][x] === 3) {
                    ctx.fillStyle = 'red'; // Spawn dos inimigos
                }
                ctx.fillRect(x * tamanhoCelula, y * tamanhoCelula, tamanhoCelula, tamanhoCelula);
            }
        }
    }

    // Função para desenhar o jogador
    function desenharJogador() {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(
            personagem.x * tamanhoCelula + tamanhoCelula / 2,
            personagem.y * tamanhoCelula + tamanhoCelula / 2,
            tamanhoCelula / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    // Função para desenhar inimigos
    function desenharInimigos() {
        ctx.fillStyle = 'red';
        inimigos.forEach(inimigo => {
            ctx.fillRect(inimigo.x * tamanhoCelula, inimigo.y * tamanhoCelula, tamanhoCelula, tamanhoCelula);
        });
    }

    // Função para desenhar moedas
    function desenharMoedas() {
        ctx.fillStyle = 'white';
        moedas.forEach(moeda => {
            ctx.beginPath();
            ctx.arc(
                moeda.x * tamanhoCelula + tamanhoCelula / 2,
                moeda.y * tamanhoCelula + tamanhoCelula / 2,
                5,
                0,
                Math.PI * 2
            );
            ctx.fill();
        });
    }

    // Função para desenhar power-ups
    function desenharPowerUps() {
        ctx.fillStyle = 'yellow';
        powerUps.forEach(powerUp => {
            ctx.fillRect(powerUp.x * tamanhoCelula, powerUp.y * tamanhoCelula, tamanhoCelula, tamanhoCelula);
        });
    }
    // Navegação entre telas
    botaoJogar.addEventListener('click', () => {
        telaInicial.style.display = 'none';
        telaSelecao.style.display = 'block';
    });

    botaoRanking.addEventListener('click', () => {
        atualizarRanking();
        telaInicial.style.display = 'none';
        telaRanking.style.display = 'block';
    });

    botaoSair.addEventListener('click', () => {
        window.close();
    });

    botaoVoltarInicio.addEventListener('click', () => {
        telaRanking.style.display = 'none';
        telaInicial.style.display = 'block';
    });

    botaoVoltarSelecao.addEventListener('click', () => {
        telaSelecao.style.display = 'none';
        telaInicial.style.display = 'block';
    });

    botaoVoltarJogo.addEventListener('click', () => {
        telaJogo.style.display = 'none';
        telaInicial.style.display = 'block';
    });

    // Seleção de personagem
    personagens.forEach(personagem => {
        personagem.addEventListener('click', () => {
            personagens.forEach(p => p.classList.remove('selecionado'));
            personagem.classList.add('selecionado');
            personagemSelecionado = personagem.getAttribute('data-personagem');
            console.log(`Personagem selecionado: ${personagemSelecionado}`); // Debugging
        });
    });

    // Começar a partida
    botaoComecarPartida.addEventListener('click', () => {
        if (personagemSelecionado && nomeJogador.value.trim() !== '') {
            telaSelecao.style.display = 'none';
            telaJogo.style.display = 'block';
            iniciarJogo();
        } else {
            alert('Por favor, selecione um personagem e insira seu nome.');
        }
    });

    // Atualizar a tabela de ranking
    function atualizarRanking() {
        tabelaRanking.innerHTML = '';
        ranking.sort((a, b) => b.pontuacao - a.pontuacao).forEach(jogador => {
            const row = tabelaRanking.insertRow();
            const cellNome = row.insertCell(0);
            const cellPontuacao = row.insertCell(1);
            cellNome.textContent = jogador.nome;
            cellPontuacao.textContent = jogador.pontuacao;
        });
    }

    // Lógica do Jogo
    function iniciarJogo() {
        const tamanhoCelula = 20;
        const larguraMapa = canvas.width / tamanhoCelula;
        const alturaMapa = canvas.height / tamanhoCelula;
        let personagem = { x: 1, y: 1, direcao: 'direita' };
        const moedas = [];
        const inimigos = [];
        const blocos = [];

        // Criar blocos (colisores verdes)
        for (let i = 0; i < larguraMapa; i++) {
            for (let j = 0; j < alturaMapa; j++) {
                if (i === 0 || i === larguraMapa - 1 || j === 0 || j === alturaMapa - 1) {
                    blocos.push({ x: i, y: j }); // Bordas do mapa
                } else if (Math.random() < 0.1 && !(i === 1 && j === 1)) { // Obstáculos internos
                    blocos.push({ x: i, y: j });
                }
            }
        }

        // Criar moedas
        for (let i = 1; i < larguraMapa - 1; i++) {
            for (let j = 1; j < alturaMapa - 1; j++) {
                if (!blocos.some(bloco => bloco.x === i && bloco.y === j)) {
                    moedas.push({ x: i, y: j });
                }
            }
        }

        // Criar inimigos
        for (let i = 0; i < 4; i++) {
            inimigos.push({ x: Math.floor(Math.random() * larguraMapa), y: Math.floor(Math.random() * alturaMapa), direcao: ['cima', 'baixo', 'esquerda', 'direita'][Math.floor(Math.random() * 4)], estado: 'normal' });
        }

        // Função para desenhar o jogo
        function desenharJogo() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Desenhar blocos
            ctx.fillStyle = 'green';
            blocos.forEach(bloco => {
                ctx.fillRect(bloco.x * tamanhoCelula, bloco.y * tamanhoCelula, tamanhoCelula, tamanhoCelula);
            });

            // Desenhar moedas
            ctx.fillStyle = 'orange';
            moedas.forEach(moeda => {
                ctx.beginPath();
                ctx.arc(moeda.x * tamanhoCelula + tamanhoCelula / 2, moeda.y * tamanhoCelula + tamanhoCelula / 2, 5, 0, Math.PI * 2);
                ctx.fill();
            });

            // Desenhar personagem
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(personagem.x * tamanhoCelula + tamanhoCelula / 2, personagem.y * tamanhoCelula + tamanhoCelula / 2, 10, 0, Math.PI * 2);
            ctx.fill();

            // Desenhar inimigos
            inimigos.forEach(inimigo => {
                ctx.fillStyle = inimigo.estado === 'normal' ? 'red' : 'blue';
                ctx.fillRect(inimigo.x * tamanhoCelula, inimigo.y * tamanhoCelula, tamanhoCelula, tamanhoCelula);
            });
        }

        // Função para mover inimigos
        function moverInimigos() {
            inimigos.forEach(inimigo => {
                const direcoes = ['cima', 'baixo', 'esquerda', 'direita'];
                const novaDirecao = direcoes[Math.floor(Math.random() * 4)];
                inimigo.direcao = novaDirecao;

                let novoX = inimigo.x;
                let novoY = inimigo.y;

                if (inimigo.direcao === 'cima') novoY--;
                if (inimigo.direcao === 'baixo') novoY++;
                if (inimigo.direcao === 'esquerda') novoX--;
                if (inimigo.direcao === 'direita') novoX++;

                if (!blocos.some(bloco => bloco.x === novoX && bloco.y === novoY)) {
                    inimigo.x = novoX;
                    inimigo.y = novoY;
                }
            });
        }

        // Função para verificar colisões
        function verificarColisoes() {
            // Colisão com moedas
            moedas.forEach((moeda, index) => {
                if (moeda.x === personagem.x && moeda.y === personagem.y) {
                    moedas.splice(index, 1);
                    pontuacao += 10;
                    pontuacaoElement.textContent = `Pontuação: ${pontuacao}`;
                }
            });

            // Colisão com inimigos
            inimigos.forEach((inimigo, index) => {
                if (inimigo.x === personagem.x && inimigo.y === personagem.y) {
                    if (powerUpAtivo) {
                        inimigos.splice(index, 1);
                        pontuacao += 50;
                        pontuacaoElement.textContent = `Pontuação: ${pontuacao}`;
                    } else {
                        vidas--;
                        vidasElement.textContent = '❤️'.repeat(vidas);
                        if (vidas === 0) {
                            alert('Game Over!');
                            finalizarJogo();
                        }
                    }
                }
            });
        }

        // Função para finalizar o jogo
        function finalizarJogo() {
            ranking.push({ nome: nomeJogador.value, pontuacao });
            localStorage.setItem('ranking', JSON.stringify(ranking));
            telaJogo.style.display = 'none';
            telaInicial.style.display = 'block';
        }

        // Controles do teclado
        document.addEventListener('keydown', (e) => {
            let novoX = personagem.x;
            let novoY = personagem.y;

            if (e.key === 'ArrowUp' || e.key === 'w') novoY--;
            if (e.key === 'ArrowDown' || e.key === 's') novoY++;
            if (e.key === 'ArrowLeft' || e.key === 'a') novoX--;
            if (e.key === 'ArrowRight' || e.key === 'd') novoX++;

            if (!blocos.some(bloco => bloco.x === novoX && bloco.y === novoY)) {
                personagem.x = novoX;
                personagem.y = novoY;
            }
        });

        // Loop do jogo
        function loopJogo() {
            desenharJogo();
            moverInimigos();
            verificarColisoes();
            requestAnimationFrame(loopJogo);
        }

        loopJogo();
    }
});