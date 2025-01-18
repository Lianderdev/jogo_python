import pygame

# Função para carregar e redimensionar sprites
def carrega_sprites(caminho_base, quantidade_frames, tamanho=(30, 30)):
    return [
        pygame.transform.scale(
            pygame.image.load(f"{caminho_base}{i}.png"), tamanho
        ) for i in range(1, quantidade_frames + 1)
    ]

# Função para carregar todos os sprites necessários
def carregar_todos_sprites():
    sprites = {
        "esquerda": carrega_sprites("MeninaEsquerda", 11),
        "direita": carrega_sprites("MeninaDireita", 11),
        "cima": carrega_sprites("Meninacima", 3),
        "baixo": carrega_sprites("Meninabaixo", 3),
    }
    return sprites
