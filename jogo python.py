import pygame
import sys

# Inicializa o pygame
pygame.init()

# Configurações da tela
largura_tela = 700
altura_tela = 500
tela = pygame.display.set_mode((largura_tela, altura_tela))
pygame.display.set_caption("Pac-Man Customizado")

# Cores
PRETO = (0, 0, 0)
BRANCO = (255, 255, 255)
VERDE = (0, 255, 0)

# Configurações do jogador
jogador_x = 77
jogador_y = 77
velocidade = 5

# Dimensões proporcionais do boneco
largura_boneco = 20  # Largura desejada (ajuste conforme necessário)
altura_boneco =  40  # Altura é 119 maior que a largura

# Função para redimensionar sprites
def redimensionar_sprites(sprites):
    return [
        pygame.transform.scale(sprite, (largura_boneco, altura_boneco))
        for sprite in sprites
    ]

# Carregar e redimensionar frames de animação
sprite_esquerda = redimensionar_sprites(
    [pygame.image.load(f"MeninaEsquerda{i}.png") for i in range(1, 12)]
)
sprite_direita = redimensionar_sprites(
    [pygame.image.load(f"MeninaDireita{i}.png") for i in range(1, 12)]
)
sprite_cima = redimensionar_sprites(
    [pygame.image.load(f"Meninacima{i}.png") for i in range(1, 4)]
)
sprite_baixo = redimensionar_sprites(
    [pygame.image.load(f"Meninabaixo{i}.png") for i in range(1, 4)]
)

# Configurações de animação
indice_frame = 0
tempo_animacao = 0
sprite_atual = sprite_direita  # Começa olhando para a direita
movendo = False  # Indica se o jogador está em movimento

# Função para desenhar o cenário
def desenha_cenario():
    tela.fill(PRETO)
    # Exemplo de cenário
    for y in range(0, altura_tela, 30):
        for x in range(0, largura_tela, 30):
            if (x // 30) % 2 == 0 and (y // 30) % 2 == 0:
                pygame.draw.rect(tela, VERDE, (x, y, 30, 30))
            else:
                pygame.draw.rect(tela, BRANCO, (x, y, 30, 30))
    pygame.draw.rect(tela, (255, 255, 0), (50, 50, 30, 30))
    pygame.draw.rect(tela, (255, 255, 0), (500, 50, 30, 30))

# Loop principal
clock = pygame.time.Clock()
while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    keys = pygame.key.get_pressed()
    movendo = False  # Reseta o estado de movimento a cada frame

    # Atualiza a posição do jogador e o sprite atual baseado no movimento
    if keys[pygame.K_LEFT]:
        jogador_x -= velocidade
        sprite_atual = sprite_esquerda
        movendo = True
    if keys[pygame.K_RIGHT]:
        jogador_x += velocidade
        sprite_atual = sprite_direita
        movendo = True
    if keys[pygame.K_UP]:
        jogador_y -= velocidade
        sprite_atual = sprite_cima
        movendo = True
    if keys[pygame.K_DOWN]:
        jogador_y += velocidade
        sprite_atual = sprite_baixo
        movendo = True

    # Impede que o jogador saia das bordas da tela (Colisores)
        jogador_x = max(0, min(jogador_x, largura_tela - largura_boneco))
        jogador_y = max(0, min(jogador_y, altura_tela - altura_boneco))
        
    # Atualiza o índice do frame para animação apenas se estiver em movimento
    if movendo:
        tempo_animacao += 1
        if tempo_animacao >= 3:  # Altere para ajustar a velocidade da animação
            indice_frame = (indice_frame + 1) % len(sprite_atual)
            tempo_animacao = 0
    else:
        indice_frame = 0  # Reseta a animação para o primeiro frame quando parado

    # Desenha o cenário e o jogador
    desenha_cenario()
    tela.blit(sprite_atual[indice_frame], (jogador_x, jogador_y))
    pygame.display.update()
    clock.tick(30)
