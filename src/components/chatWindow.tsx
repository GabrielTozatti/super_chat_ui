import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/chatContext';
import { useAuth } from '../context/authContext';

const ChatWindow: React.FC = () => {
  const { currentRoom, messages, sendMessage, deleteRoom, leaveRoom } = useChat();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'delete' | 'leave' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentRoom) {
    return (
      <div className="flex-1 bg-[#313338] flex flex-col items-center justify-center text-[#B5BAC1]">
        <div className="bg-[#2B2D31] p-6 rounded-full mb-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Selecione uma sala para conversar</h2>
        <p>Use o painel esquerdo para criar ou entrar em uma sala.</p>
      </div>
    );
  }

  const isOwner = currentRoom.ownerId === user?.id;
  const isMember = !!user && !isOwner;

  const handleDeleteRoom = () => {
    setModalType('delete');
    setShowModal(true);
  };
  const handleLeaveRoom = () => {
    setModalType('leave');
    setShowModal(true);
  };

  const confirmAction = () => {
    if (!currentRoom) return;

    if (modalType === 'delete') {
      deleteRoom(currentRoom.id);
    } else if (modalType === 'leave') {
      leaveRoom(currentRoom);
    }

    setShowModal(false);
    setShowSettings(false);
    setModalType(null);
  };

  const cancelAction = () => {
    setShowModal(false);
    setShowSettings(false);
    setModalType(null);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      await sendMessage(currentRoom?.id, inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#313338] relative">
      <div className="h-16 border-b border-[#26272D] flex items-center justify-between px-6 shadow-sm bg-[#313338] z-10">
        <h3 className="font-bold text-white text-lg truncate"># {currentRoom.name}</h3>
        <div className="flex items-center relative">
          {(isOwner || isMember) && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-[#B5BAC1] hover:text-white p-2 rounded-full hover:bg-[#2B2D31] transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B5BAC1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .69.4 1.31 1.03 1.58.3.12.62.19  .97.19H21a2 2 0 0 1 0 4h-.09c-.35 0-.67.07-.97.19-.63.27-1.03.89-1.03 1.58z" />
              </svg>
            </button>
          )}
          {showSettings && (
            <div className="absolute top-12 right-0 w-48 bg-[#313338] rounded p-2 shadow-xl z-50">
              {isOwner && (
                <button
                  onClick={handleDeleteRoom}
                  className="w-full text-left px-2 py-2 text-red-500 hover:bg-red-500 hover:text-white rounded text-sm cursor-pointer"
                >
                  Excluir Sala
                </button>
              )}
              {isMember && (
                <button
                  onClick={handleLeaveRoom}
                  className="w-full text-left px-2 py-2 text-red-500 hover:bg-red-500 hover:text-white rounded text-sm cursor-pointer"
                >
                  Sair da Sala
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-fat">
        {messages.map((msg, index) => {
          const isSequence = index > 0 && messages[index - 1].user?.id === msg.user?.id;
          const timeString = new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });
          return (
            <div key={index} className={`flex group ${isSequence ? 'm-0' : 'mt-4'}`}>
              {!isSequence ? (
                <div className="w-10 h-10 rounded-full bg-[#5865F2] shrink-0 flex items-center justify-center text-white font-bold text-sm mr-4 mt-0.5">
                  {msg.user?.name.substring(0, 2).toUpperCase()}
                </div>
              ) : (
                <div className="w-10 mr-4" />
              )}
              <div className="flex-1 min-w-0">
                {!isSequence && (
                  <div className="flex items-center mb-1">
                    <span className="text-white font-medium hover:underline cursor-pointer mr-2 text-base">
                      {msg.user?.name}
                    </span>
                    <span className="text-[#949BA4] text-[8px]">{timeString}</span>
                  </div>
                )}
                <p className="text-[#DBDEE1] text-[0.95rem] leading-5.5 whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="px-6 pb-6 pt-2 bg-[#313338] border-t border-[#26272D]">
        <div className="bg-[#383A40] rounded-lg px-4 py-2.5 flex items-center">
          <form onSubmit={handleSend} className="flex-1 flex items-center">
            <input
              type="text"
              className="w-full bg-transparent text-[#DBDEE1] placeholder-[#949BA4] outline-none"
              placeholder={`Conversar em #${currentRoom.name}`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="ml-4 bg-[#5865F2] text-white p-2 rounded-lg hover:bg-[#4752C4] transition-colors disabled:opacity-50"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2B2D31] p-6 rounded-xl shadow-xl w-80 text-center border border-[#3A3A3A]">
            <h2 className="text-white text-lg font-bold mb-3">
              {modalType === 'delete' ? 'Excluir Sala' : 'Sair da Sala'}
            </h2>
            <p className="text-[#B5BAC1] text-sm mb-6">
              {modalType === 'delete' ? (
                <>
                  Tem certeza que deseja excluir a sala{' '}
                  <span className="text-[#5865F2] font-bold">{currentRoom?.name}</span>?
                  Esta ação é irreversível.
                </>
              ) : (
                <>
                  Tem certeza que deseja sair da sala{' '}
                  <span className="text-[#5865F2] font-bold">{currentRoom?.name}</span>?
                </>
              )}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={cancelAction}
                className="px-4 py-2 rounded-lg bg-[#4F545C] text-white hover:bg-[#5A5F66] text-sm cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={confirmAction}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;