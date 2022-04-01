import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ApiContext } from '../../utils/api_context';

import { Button } from '../common/button';
import { useMessages } from '../../utils/use_messages';
import { Message } from './message';

export const ChatRoom = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [contents, setContents] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState([]);
  const api = useContext(ApiContext);
  const { id } = useParams();
  const [messages, sendMessage] = useMessages(chatRoom);

  useEffect(async () => {
    setLoading(true);
    if (!user) {
      const { user } = await api.get('/users/me');
      setUser(user);
    }
    const { chatRoom } = await api.get(`/chat_rooms/${id}`);
    setChatRoom(chatRoom);
    setLoading(false);
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation[position.coords.latitude, position.coords.longitude];
    });
  }, [id]);

  if (loading) return 'Loading...';

  return (

    <div className="chat-container">
          <div className="chat-header">
          {chatRoom.name}
        </div>
        <div className="chat-location">
          <div>Long: {chatRoom.longitude}</div>
          <div>Lat: {chatRoom.latitude}</div>
        </div>
      <div className="messages">
        {[...messages].reverse().map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <div className="chat-input">
        <input type="text" value={contents} onChange={(e) => setContents(e.target.value)} />
        <Button onClick={() => sendMessage(contents, user)}>Send</Button>
      </div>
    </div>
  );
};
