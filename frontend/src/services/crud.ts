import api from "./api";
import type { Item, ItemUpdate, Items } from "../types/crud_types";

export const createItem = async (novoItem: Items): Promise<Item> => {
  const response = await api.post("/items", novoItem);
  return response.data.items;
};

export const getItems = async (): Promise<Item[]> => {
  const response = await api.get("/items");
  return response.data.Items || response.data;
};

export const getItemById = async (id: string): Promise<Item> => {
  const response = await api.get(`/items/${id}`);
  return response.data.item;
};

export const updateItem = async (
  id: string,
  data_update: ItemUpdate,
): Promise<Item> => {
  const response = await api.patch(`/items/${id}`, data_update);
  return response.data.item;
};

export const deleteItem = async (id: string): Promise<void> => {
  await api.delete(`/items/${id}`);
};
