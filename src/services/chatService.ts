import type { createRoom, createMessage } from '../types';
import { api } from "../api/api";

export const getRooms = async () => {
  const response = await api.get('/rooms')
  return response.data
}

export const getMyRooms = async () => {
  const response = await api.get('/my-rooms')
  return response.data
}

export const createRooms = async (payload: createRoom) => {
  const response = await api.post('/rooms', payload)
  return response.data
}

export const joinRoom = async (roomId: number) => {
  const response = await api.post(`/rooms/${roomId}/join`);
  return response.data;
};

export const leaveRoom = async (roomId: number) => {
  const response = await api.post(`/rooms/${roomId}/leave`);
  return response.data;
};

export const transferRoom = async (roomId: number, newOwnerId: number) => {
  const response = await api.post(`/rooms/${roomId}/transfer`, { newOwnerId });
  return response.data;
};

export const deleteRoom = async (roomId: number) => {
  const response = await api.delete(`/rooms/${roomId}`);
  return response.data;
};

export const messagesRoom = async (roomId: number) => {
  const response = await api.get(`/rooms/${roomId}/messages`);
  return response.data;
};

export const sendMessage = async (roomId: number, payload: createMessage) => {
  const response = await api.post(`/rooms/${roomId}/messages`, payload);
  return response.data;
};

export const deleteMessage = async (id: number) => {
  const response = await api.delete(`/messages/${id}`);
  return response.data;
};