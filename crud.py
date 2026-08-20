from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class Items(BaseModel):
    nome: str
    preco: str
    validade: str


class ItemsUpdate(BaseModel):
    nome: str | None = None
    preco: str | None = None
    validade: str | None = None


app = FastAPI()

origins = [
     "http://localhost:",#host
     "http://:",#network
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = []
X = 0


@app.post("/items")
def create_items(items: Items):
    global X
    X += 1
    id = str(X)
    novo_item = {"id": id, **items.model_dump()}
    db.append(novo_item)

    return {"mensagem": "Item criado com sucesso", "Items": novo_item}


@app.get("/items")
def read_items():
    return {"mensagem": "Lista de items", "Items": db}


@app.get("/items/{id}")
def read_id_items(id: str):
    for item in db:
        if item["id"] == id:
            return {"messagem": f"Esse é o item de id {id}", "item": item}
    raise HTTPException(status_code=404, detail="Item não encontrado")


@app.patch("/items/{id}")
def update_item(id: str, itemupdate: ItemsUpdate):
    for index, item in enumerate(db):
        if item["id"] == id:
            update_data = itemupdate.model_dump(exclude_unset=True)
            db[index].update(update_data)
            return {"message": f"Item com ID {id} foi atualizado", "item": db[index]}
    raise HTTPException(status_code=404, detail="Item não encontrado")


@app.delete("/items/{id}")
def delete_item(id: str):
    for index, item in enumerate(db):
        if item["id"] == id:
            db.pop(index)
            return {"message": f"Item de ID {id} foi deletado"}
    raise HTTPException(status_code=404, detail="Item não encontrado")
