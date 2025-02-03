import tkinter as tk
from tkinter import Canvas

# Pilha de telas
screens = []

def show_screen(screen):
    """Exibe a tela e a empilha."""
    if screens:
        screens[-1].pack_forget()
    screens.append(screen)
    screen.pack(fill="both", expand=True)

def go_back():
    """Remove a tela atual e volta para a anterior."""
    if len(screens) > 1:
        screens.pop().pack_forget()
        screens[-1].pack(fill="both", expand=True)

def create_round_button(canvas, x, y, text, command):
    """Cria um botão retangular com bordas arredondadas e contorno preto."""
    width = 150
    height = 50
    radius = 20  # Raio da borda arredondada
    x1, y1 = x - width // 2, y - height // 2
    x2, y2 = x + width // 2, y + height // 2
    
    # Criando a forma retangular arredondada com contorno preto
    btn_bg = [
        canvas.create_oval(x1, y1, x1 + radius * 2, y1 + radius * 2, fill="white", outline="black", width=1),
        canvas.create_oval(x2 - radius * 2, y1, x2, y1 + radius * 2, fill="white", outline="black", width=1),
        canvas.create_oval(x1, y2 - radius * 2, x1 + radius * 2, y2, fill="white", outline="black", width=1),
        canvas.create_oval(x2 - radius * 2, y2 - radius * 2, x2, y2, fill="white", outline="black", width=1),
        canvas.create_rectangle(x1 + radius, y1, x2 - radius, y2, fill="white", outline="black", width=1),
        canvas.create_rectangle(x1, y1 + radius, x2, y2 - radius, fill="white", outline="black", width=1)
    ]
    
    # Criando o texto do botão
    btn_text = canvas.create_text(x, y, text=text, font=("Arial", 14), fill="black")

    def on_click(event):
        command()

    # Associando clique ao botão
    canvas.tag_bind(btn_text, "<Button-1>", on_click)

def create_main_screen(root):
    """Cria a tela inicial com botões arredondados."""
    screen = tk.Frame(root)
    
    # Criando um Canvas para o fundo degradê
    canvas = Canvas(screen, width=600, height=800)  # Ajustado para um formato mais retangular
    canvas.pack(fill="both", expand=True)
    
    # Criando o degradê
    for i in range(800):
        color = f"#00{hex(255 - i // 3)[2:]:>02}FF"  # Degradê verde para azul
        canvas.create_line(0, i, 600, i, fill=color, width=1)
    
    # Criando os botões arredondados
    create_round_button(canvas, 300, 300, "Jogar", lambda: print("Iniciar Jogo"))
    create_round_button(canvas, 300, 380, "Ranking", lambda: print("Mostrar Ranking"))
    create_round_button(canvas, 300, 460, "Sair", root.quit)
    
    show_screen(screen)
    
# Criando a janela principal
root = tk.Tk()
root.geometry("600x800")  # Ajustado para um formato retangular
root.title("Jogo Python")
root.resizable(False, False)

create_main_screen(root)
root.mainloop()
