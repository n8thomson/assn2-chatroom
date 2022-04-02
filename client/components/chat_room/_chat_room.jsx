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
  const [distance, setDistance] = useState();

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
      setDistance(Math.sqrt(Math.pow(chatRoom.latitude - position.coords.latitude, 2)
      + Math.pow(chatRoom.longitude - position.coords.longitude, 2)));
    });
    // setDistance(Math.sqrt(Math.pow(chatRoom.latitude - location[0], 2)
    //  + Math.pow(chatRoom.longitude - location[1], 2)));

  }, [id]);

  if (loading) return 'Loading...';

  return (

    <div className="chat-container">
          <div className="chat-header">
          <div className="chat-title">{chatRoom.name}</div>

          <div className="chat-distance">
            Distance: {Number(distance).toFixed(3) * 360} feet away
            </div>
          
        
        <div className="chat-location">
          {/* <div>Long: {chatRoom.longitude.toFixed(3)}</div>
          <div>Lat: {chatRoom.latitude}</div> */}
          <div>Chat location: {Number(chatRoom.latitude).toFixed(3)}, {Number(chatRoom.longitude).toFixed(3)}</div>
        </div>
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
