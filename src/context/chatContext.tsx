import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { socket } from '../api/socket';
import {
  getMyRooms as getMyRoomsService,
  getRooms as getAvailableRoomsService,
  messagesRoom as getMessagesRoomService,
  sendMessage as sendMessageService,
  createRooms as createRoomsService,
  joinRoom as joinRoomService,
  deleteRoom as deleteRoomService,
  leaveRoom as leaveRoomService
} from '../services/chatService';
import type { Room, Message } from '../types';
import { useAuth } from './authContext';

interface ChatContextType {
  myRooms: Room[];
  rooms: Room[];
  currentRoom: Room | null;
  messages: Message[]
  isLoading: boolean;
  selectRoom: (room: Room) => void;
  leaveRoom: (room: Room) => Promise<void>;
  sendMessage: (roomId: number, content?: string, file?: File) => Promise<void>;
  createRoom: (name: string, description: string) => Promise<void>;
  deleteRoom: (roomId: number) => Promise<void>;
}

export const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const currentRoomRef = useRef<Room | null>(null);
  const userRef = useRef(user);
  const allMyRoomsRef = useRef<Room[]>([]);

  const rejoinCompletedRef = useRef(false);

  useEffect(() => {
    currentRoomRef.current = currentRoom;
    userRef.current = user;
    allMyRoomsRef.current = myRooms;
  }, [currentRoom, user, myRooms]);

  const getRooms = async () => {
    setIsLoading(true);
    try {
      const [activeRooms, availableRoomsList] = await Promise.all([
        getMyRoomsService(),
        getAvailableRoomsService(),
      ]);

      setMyRooms(activeRooms);
      setRooms(availableRoomsList);
    } catch (error) {
      console.error("Erro ao buscar salas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getRooms();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!socket || !socket.connected || !myRooms.length) return;

    if (!rejoinCompletedRef.current) {
      const roomIdsToRejoin = myRooms.map(r => r.id);
      socket.emit('rejoin_rooms', roomIdsToRejoin);
      rejoinCompletedRef.current = true;
    }
  }, [myRooms, socket]);

  useEffect(() => {
    if (!socket || !isAuthenticated) return;

    const handleConnect = () => {
      const roomIds = allMyRoomsRef.current.map(r => r.id);

      if (roomIds.length > 0) {
        socket.emit('rejoin_rooms', roomIds);
      }
    };

    socket.on('connect', handleConnect);

    const handleNewMessage = (newMessage: Message) => {
      const activeRoom = currentRoomRef.current;
      const isSameRoom = activeRoom && String(activeRoom.id) === String(newMessage.roomId);

      if (isSameRoom) {
        setMessages((prev) => [...prev, { ...newMessage }]);
      } else {
        setMyRooms((prevRooms) => prevRooms.map(r => {
          if (String(r.id) === String(newMessage.roomId)) {
            return { ...r, unreadCount: (r.unreadCount || 0) + 1 };
          }
          return r;
        }));
      }
    };

    const handleRoomCreated = (newRoom: Room) => {
      if (userRef.current && userRef.current.id === newRoom.ownerId) {
        setMyRooms((prev) => [newRoom, ...prev]);
        selectRoom(newRoom);
      } else {
        setRooms((prev) => [newRoom, ...prev]);
      }
    };

    const handleRoomDeleted = (data: { id: number }) => {
      const deletedId = Number(data.id);

      setMyRooms(prev => prev.filter(r => r.id !== deletedId));
      setRooms(prev => prev.filter(r => r.id !== deletedId));

      if (currentRoomRef.current?.id === deletedId) {
        setCurrentRoom(null);
        setMessages([]);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('rooms:created', handleRoomCreated);
    socket.on('room_deleted', handleRoomDeleted);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('new_message', handleNewMessage);
      socket.off('rooms:created', handleRoomCreated);
      socket.off('room_deleted', handleRoomDeleted);
    };
  }, [isAuthenticated]);

  const selectRoom = async (room: Room) => {
    if (currentRoom?.id === room.id) return;

    const wasAvailable = rooms.some(r => r.id === room.id);

    if (currentRoom) {
      socket.emit('leave_room', currentRoom.id);
    }

    setIsLoading(true);
    setCurrentRoom(room);
    setMessages([]);

    setMyRooms(prev => prev.map(r => r.id === room.id ? { ...r, unreadCount: 0 } : r));
    try {
      await joinRoomService(room.id);

      socket.emit("join_room", room.id);

      if (wasAvailable) {
        setRooms(prev => prev.filter(r => r.id !== room.id));
        setMyRooms(prev => [...prev, { ...room, unreadCount: 0 }]);
      }

      const response = await getMessagesRoomService(room.id);
      setMessages(response.messages || response);

    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const leaveRoom = async (room: Room) => {
    const isMember = myRooms.some(r => r.id === room.id);
    if (!isMember) return;

    try {
      setIsLoading(true);
      await leaveRoomService(room.id);

      socket.emit('leave_room', room.id);

      setMyRooms(prev => prev.filter(r => r.id !== room.id));
      setRooms(prev => [...prev, { ...room, unreadCount: undefined }]);

      if (currentRoom?.id === room.id) {
        setCurrentRoom(null);
        setMessages([]);
      }

    } catch (error) {
      console.error("Erro ao sair da sala:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (roomId: number, content?: string, file?: File) => {
    if (!currentRoom) return;
    try {
      await sendMessageService(roomId, { content, file });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const createRoom = async (name: string, description: string) => {
    try {
      const response = await createRoomsService({ name, description });

      if (response && response.room) {
        selectRoom(response.room);
      }
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      throw error;
    }
  };

  const deleteRoom = async (roomId: number) => {
    try {
      await deleteRoomService(roomId);

      socket.emit('leave_room', roomId);

    } catch (error) {
      console.error("Erro ao deletar sala:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        myRooms,
        rooms,
        currentRoom,
        messages,
        isLoading,
        selectRoom,
        sendMessage,
        createRoom,
        deleteRoom,
        leaveRoom
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === null) {
    throw new Error('useChat deve ser usado dentro de um ChatProvider');
  }
  return context;
};