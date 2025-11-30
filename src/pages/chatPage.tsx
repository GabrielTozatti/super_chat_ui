import React from 'react';
import MainSidebar from '../components/mainSidebar';
import RoomListSidebar from '../components/roomListSidebar';
import ChatWindow from '../components/chatWindow';

const ChatPage: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#313338]">
      <MainSidebar />
      <RoomListSidebar />
      <ChatWindow />
    </div>
  );
};

export default ChatPage;