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
    const botaoVoltarRanking = document.getElementById('voltar-ranking');
    const botaoVoltarJogo = document.getElementById('voltar-jogo');
    const personagens = document.querySelectorAll('.personagem');
    const nomeJogador = document.getElementById('nome-jogador');
    const tabelaRanking = document.getElementById('tabela-ranking').getElementsByTagName('tbody')[0];
    const canvas = document.getElementById('canvas-jogo');
    const ctx = canvas.getContext('2d');
    const pontuacaoElement = document.getElementById('pontuacao');
    const vidasElement = document.getElementById('vidas');

    let personagemSelecionado = null;
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    let pontuacao = 0;
    let vidas = 3;
    let powerUpAtivo = false;
    let tempoPowerUp = 0;

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

    botaoVoltarRanking.addEventListener('click', () => {
        telaRanking.style.display = 'none';
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