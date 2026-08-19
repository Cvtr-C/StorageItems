import React, { useState } from "react";
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../services/crud";
import type { Item } from "../types/crud_types";

export function ItemManager() {
  const [items, setItems] = useState<Item[]>([]);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [validade, setValidade] = useState("");

  const [searchId, setSearchId] = useState("");
  const [searchItem, setSearchItem] = useState<Item | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editPreco, setEditPreco] = useState("");
  const [editValidade, setEditValidade] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !preco || !validade) {
      alert("Preencha todos os campos!!!");
      return;
    }

    try {
      const itemCreate = await createItem({ nome, preco, validade });
      setItems((itensAntigos) => [...itensAntigos, itemCreate]);
      setNome("");
      setPreco("");
      setValidade("");
      alert("Item criado com sucesso!");
    } catch (error) {
      console.error("", error);
      alert("Erro ao criar item.");
    }
  };

  const handleFetchItems = async () => {
    try {
      const dados = await getItems();
      setItems(dados);
    } catch (error) {
      console.error("", error);
      alert("Erro ao carregar lista de itens.");
    }
  };

  const handleFetchById = async () => {
    if (!searchId) {
      alert("Digite um ID para buscar!");
      return;
    }

    try {
      const item = await getItemById(searchId);
      setSearchItem(item);
    } catch (error) {
      console.error("", error);
      alert("Item não encontrado.");
      setSearchItem(null);
    }
  };

  const startEditing = (item: Item) => {
    setEditingId(item.id);
    setEditNome(item.nome);
    setEditPreco(item.preco);
    setEditValidade(item.validade);
  };

  const handleUpdate = async (id: string) => {
    try {
      const itemUpdate = await updateItem(id, {
        nome: editNome,
        preco: editPreco,
        validade: editValidade,
      });
      setItems((antigos) =>
        antigos.map((item) => (item.id === id ? itemUpdate : item)),
      );
      setEditingId(null);
      alert("Item atualizado com sucesso!");
    } catch (error) {
      console.error("", error);
      alert("Erro ao atulizar item.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Tem certeza que deseja deletar esse item #${id}?`)) return;

    try {
      await deleteItem(id);
      setItems((antigos) => antigos.filter((item) => item.id !== id));
      if (searchItem?.id === id) setSearchItem(null);
      alert("Item deletado com sucesso!");
    } catch (error) {
      console.error("", error);
      alert("Erro ao deletar o item.");
    }
  };

  return (
    <section>
      <h2>Painel CRUD Completo</h2>
      <div className="Created">
        <h3>(POST) 1. Criar Item</h3>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Escreva o nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="text"
            placeholder="Escreva o preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
          <input
            type="text"
            placeholder="Escreva a validade"
            value={validade}
            onChange={(e) => setValidade(e.target.value)}
          />
          <button type="submit">➕ Criar Item</button>
        </form>
      </div>
      <div className="search">
        <h3>(GET) 2.Lista de Itens</h3>
        <button onClick={handleFetchItems}>🔄 Carregar Todos os Itens</button>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {editingId === item.id ? (
                <div>
                  <input
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                  />
                  <input
                    value={editPreco}
                    onChange={(e) => setEditPreco(e.target.value)}
                  />
                  <input
                    value={editValidade}
                    onChange={(e) => setEditValidade(e.target.value)}
                  />
                  <div className="save">
                    <button onClick={() => handleUpdate(item.id)}>
                      💾 Salvar (PUT)
                    </button>
                    <button onClick={() => setEditingId(null)}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div>
                  <strong>
                    #{item.id} - {item.nome}
                  </strong>{" "}
                  | R$ {item.preco} | Validade: {item.validade}
                  <div className="delete">
                    <button onClick={() => startEditing(item)}>
                      ✏️ Editar (PUT)
                    </button>
                    <button onClick={() => handleDelete(item.id)}>
                      🗑️ Deletar (DELETE)
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="SearchID">
        <h3>(GET) 3.Buscar por ID</h3>
        <input
          placeholder="Digite o ID do item"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleFetchById}>🔍 Buscar Item</button>
        {searchItem && (
          <div>
            <p>
              <strong>ID:</strong> {searchItem.id}
            </p>
            <p>
              <strong>Nome:</strong> {searchItem.nome}
            </p>
            <p>
              <strong>Preço:</strong> R$ {searchItem.preco}
            </p>
            <p>
              <strong>Validade:</strong> {searchItem.validade}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
