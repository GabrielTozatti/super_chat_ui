import React, { useState } from 'react';
import { useChat } from '../context/chatContext';
import { type Room } from '../types';

type RoomFilter = 'myRooms' | 'rooms';

const RoomListSidebar: React.FC = () => {
  const { myRooms, rooms, currentRoom, selectRoom, createRoom } = useChat();
  const [activeFilter, setActiveFilter] = useState<RoomFilter>('myRooms');
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    roomName: '',
    description: '',
  });

  const roomsToDisplay = activeFilter === 'myRooms' ? myRooms : rooms;

  const filteredRooms = roomsToDisplay.filter(room =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (formData.roomName.trim() && formData.description.trim()) {
      await createRoom(formData.roomName, formData.description);
      setFormData({
        roomName: '',
        description: '',
      });
    }
  };

  const handleRoomSelection = (room: Room) => {
    selectRoom(room);

    const wasAvailable = rooms.some(r => r.id === room.id);

    if (activeFilter === 'rooms' && wasAvailable) {
      setActiveFilter('myRooms');
    }
  };

  const RoomItem: React.FC<{ room: Room }> = ({ room }) => {
    const isActive = currentRoom?.id === room.id;
    const isAvailable = activeFilter === 'rooms';

    return (
      <div
        key={room.id}
        onClick={() => handleRoomSelection(room)}
        className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-[#35373C]' : 'hover:bg-[#35373C]'
          }`}
      >
        <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-sm font-bold shrink-0 mr-3">
          {room.name.substring(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1 flex flex-col">
          <p className="text-white font-semibold truncate text-sm">
            {room.name}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-[#949BA4] text-xs truncate">
              {isAvailable ? 'Clique para entrar' : (room.description || 'Sem descrição')}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-110 bg-[#2B2D31] flex flex-col h-screen border-r border-[#1E1F22] shadow-xl">
      <div className="h-16 flex items-center justify-between p-4 border-b border-[#35373C]">
        <input
          type="text"
          className="w-full bg-[#1E1F22] p-2 rounded text-white text-sm outline-none placeholder-[#B5BAC1]"
          placeholder={`Pesquisar em ${activeFilter === 'myRooms' ? 'Minhas Salas' : 'Disponíveis'}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="p-4 border-b border-[#35373C]">
        <div className="text-[#B5BAC1] text-sm font-bold mb-2">Criar Sala</div>
        <div className="flex space-x-2">
          <input
            name='roomName'
            type="text"
            placeholder="Nome da Sala"
            className="flex-1 bg-[#313338] p-2 rounded text-white text-sm outline-none placeholder-[#B5BAC1]"
            value={formData.roomName}
            onChange={handleChange}
          />
          <input
            name='description'
            type="text"
            placeholder="Descrição da Sala"
            className="flex-1 bg-[#313338] p-2 rounded text-white text-sm outline-none placeholder-[#B5BAC1]"
            value={formData.description}
            onChange={handleChange}
          />
          <button
            onClick={handleCreate}
            disabled={!(formData.roomName.trim() && formData.description.trim())}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white p-2 rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-auto"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
      </div>
      <div className="flex justify-around p-2 border-b border-[#35373C]">
        <button
          onClick={() => setActiveFilter('myRooms')}
          className={`text-sm font-bold p-2 transition-colors ${activeFilter === 'myRooms'
            ? 'text-white border-b-2 border-white'
            : 'text-[#949BA4] hover:text-[#B5BAC1]'
            }`}
        >
          Minhas Salas ({myRooms.length})
        </button>
        <button
          onClick={() => setActiveFilter('rooms')}
          className={`text-sm font-bold p-2 transition-colors ${activeFilter === 'rooms'
            ? 'text-white border-b-2 border-white'
            : 'text-[#949BA4] hover:text-[#B5BAC1]'
            }`}
        >
          Salas Disponíveis ({rooms.length})
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-off">
        {filteredRooms.length === 0 ? (
          <p className="text-[#949BA4] text-sm text-center p-2">
            {activeFilter === 'myRooms'
              ? 'Você não faz parte de nenhuma sala!'
              : 'Nenhuma sala disponível para explorar!'
            }
          </p>
        ) : (
          filteredRooms.map((room) => (
            <RoomItem key={room.id} room={room} />
          ))
        )}
      </div>
    </div>
  );
};

export default RoomListSidebar;