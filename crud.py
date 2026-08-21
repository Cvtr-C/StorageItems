from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# Classe para declarar os tipos das variaveis
class Items(BaseModel):
    nome: str
    preco: str
    validade: str


# Classe para declarar os tipos das variaveis
class ItemsUpdate(BaseModel):
    nome: str | None = None
    preco: str | None = None
    validade: str | None = None


# Cria um framework básico em python
app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# "Vetor database"
db = []
# Variavel que usei como ID
X = 0


# Decorador que declara o POST
@app.post("/items")
def create_items(items: Items):
    # Torna o X uma variavel dessa função
    global X
    # Contador ID
    X += 1
    # Tornar o id uma string
    id = str(X)
    # Juntar o id e as informações
    novo_item = {"id": id, **items.model_dump()}
    # Adicionar o novo item a lista
    db.append(novo_item)

    return {"mensagem": "Item criado com sucesso", "items": novo_item}


@app.get("/items")
def read_items():
    return {"mensagem": "Lista de items", "Items": db}


@app.get("/items/{id}")
def read_id_items(id: str):
    # Pegar todos os itens da lista
    for item in db:
        # Procurar o item com o id digitado
        if item["id"] == id:
            return {"messagem": f"Esse é o item de id {id}", "item": item}
    raise HTTPException(status_code=404, detail="Item não encontrado")


@app.patch("/items/{id}")
def update_item(id: str, itemupdate: ItemsUpdate):
    # Pegar todos os itens e suas localizações
    for index, item in enumerate(db):
        # Proucurar o id
        if item["id"] == id:
            # Tornar as outra variaveis opcionais
            update_data = itemupdate.model_dump(exclude_unset=True)
            # Colocar essa mudança no local onde estava o arquivo original
            db[index].update(update_data)
            return {"message": f"Item com ID {id} foi atualizado", "item": db[index]}
    raise HTTPException(status_code=404, detail="Item não encontrado")


@app.delete("/items/{id}")
def delete_item(id: str):
    # Pegar os itens e a loclização
    for index, item in enumerate(db):
        # Procurar o item com o id digitado
        if item["id"] == id:
            # Excluir o item que tiver nessa localização, pois ele é o que tem o id proucurado
            db.pop(index)
            return {"message": f"Item de ID {id} foi deletado"}
    raise HTTPException(status_code=404, detail="Item não encontrado")
