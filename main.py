import pygame
import sys
from resources import carregar_todos_sprites

# Inicializa o pygame
pygame.init()

# Configurações da tela
LARGURA_TELA = 690
ALTURA_TELA = 600
TELA = pygame.display.set_mode((LARGURA_TELA, ALTURA_TELA))
pygame.display.set_caption("Pac-Man Customizado")

# Cores
PRETO = (0, 0, 0)
BRANCO = (255, 255, 255)
AMARELO = (255, 255, 0)
AZUL = (0, 0, 255)

# Carregar sprites
sprites = carregar_todos_sprites()
sprite_atual = sprites["direita"]  # Começa olhando para a direita

# Reduzir o tamanho do sprite
fator_redimensionamento = 0.8  # 80% do tamanho original
sprite_width = int(sprite_atual[0].get_width() * fator_redimensionamento)  # Nova largura
sprite_height = int(sprite_atual[0].get_height() * fator_redimensionamento)  # Nova altura

# Redimensionar o sprite
sprite_atual = [pygame.transform.scale(img, (sprite_width, sprite_height)) for img in sprite_atual]

# Configurações do jogador
jogador_x = (LARGURA_TELA - sprite_width) // 2
jogador_y = (ALTURA_TELA - sprite_height) // 2
velocidade = 5

# Definir layout do labirinto (1 = parede, 0 = caminho)
labirinto = [
    "11111111111111111111111",
    "10000000000000000000001",
    "10110101010101010101101",
    "10100000000000000000101",
    "10001110111011101110001",
    "10000000000000000000001",
    "10101111101010111110101",
    "10101000101010100010101",
    "10000000000000000000001",
    "10101010101010101010101",
    "10101010101010101010101",
    "10000000000000000000001",
    "10101000101010100010101",
    "10101111101010111110101",
    "10000000000000000000001",
    "10001110111011101110001",
    "10100000000000000000101",
    "10110101010101010101101",
    "10000000000000000000001",
    "11111111111111111111111"
]

# Função para desenhar o cenário e retornar os pontos coletáveis
def desenha_cenario():
    TELA.fill(PRETO)
    tamanho_bloco = 30
    pontos = []  # Lista para armazenar os pontos coletáveis
    for y, linha in enumerate(labirinto):
        for x, bloco in enumerate(linha):
            # Desenhar paredes
            if bloco == "1":
                pygame.draw.rect(TELA, AZUL, (x * tamanho_bloco, y * tamanho_bloco, tamanho_bloco, tamanho_bloco))
            # Desenhar caminho e pontos
            elif bloco == "0":
                pygame.draw.rect(TELA, BRANCO, (x * tamanho_bloco, y * tamanho_bloco, tamanho_bloco, tamanho_bloco))
                # Adicionar um ponto no caminho
                pontos.append((x * tamanho_bloco + tamanho_bloco // 2, y * tamanho_bloco + tamanho_bloco // 2))
    
    # Desenhar os pontos
    for ponto in pontos:
        pygame.draw.circle(TELA, AMARELO, ponto, 5)

    return pontos


# Função para verificar colisão com ajuste de precisão
def verificar_colisao(novo_x, novo_y, labirinto):
    tamanho_bloco = 30
    x_index = int(novo_x / tamanho_bloco)
    y_index = int(novo_y / tamanho_bloco)

    # Garantir que os índices estejam dentro dos limites da grade
    if x_index < 0 or x_index >= len(labirinto[0]) or y_index < 0 or y_index >= len(labirinto):
        return True  # Fora dos limites do labirinto, considera como colisão

    # Verificar se há uma parede no novo destino
    if labirinto[y_index][x_index] == "1":
        return True
    return False


# Função para verificar colisão considerando os limites do personagem
def verificar_colisao_direcao(novo_x, novo_y, jogador_width, jogador_height, labirinto):
    tamanho_bloco = 30

    # Verificar colisão nas 4 direções (esquerda, direita, cima, baixo)
    for x in range(int(novo_x / tamanho_bloco), int((novo_x + jogador_width) / tamanho_bloco) + 1):
        for y in range(int(novo_y / tamanho_bloco), int((novo_y + jogador_height) / tamanho_bloco) + 1):
            if labirinto[y][x] == "1":  # Se encontrar uma parede
                return True
    return False


# Loop principal
clock = pygame.time.Clock()
while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    pontos = desenha_cenario()

    keys = pygame.key.get_pressed()
    movendo = False
    novo_x, novo_y = jogador_x, jogador_y
    if keys[pygame.K_LEFT]:
        novo_x = jogador_x - velocidade
        sprite_atual = sprites["esquerda"]
        movendo = True
    if keys[pygame.K_RIGHT]:
        novo_x = jogador_x + velocidade
        sprite_atual = sprites["direita"]
        movendo = True
    if keys[pygame.K_UP]:
        novo_y = jogador_y - velocidade
        sprite_atual = sprites["cima"]
        movendo = True
    if keys[pygame.K_DOWN]:
        novo_y = jogador_y + velocidade
        sprite_atual = sprites["baixo"]
        movendo = True

    # Verificação de colisão nas direções de movimento antes de mover
    if not verificar_colisao_direcao(novo_x, jogador_y, sprite_width, sprite_height, labirinto):
        jogador_x = novo_x
    if not verificar_colisao_direcao(jogador_x, novo_y, sprite_width, sprite_height, labirinto):
        jogador_y = novo_y

    # Desenha o personagem
    TELA.blit(sprite_atual[0], (jogador_x, jogador_y))

    pygame.display.update()
    clock.tick(30)
