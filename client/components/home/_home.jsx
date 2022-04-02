import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { Link, Route, Routes } from 'react-router-dom';
import { Rooms } from './rooms';
import { Room } from './room';
import { ChatRoom } from '../chat_room/_chat_room';
import { NewRoomModal } from './new_room_modal';

export const Home = () => {
  const api = useContext(ApiContext);
  // const navigate = useNavigate();

  const [chatRooms, setChatRooms] = useState([]);
  const [location, setLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(async () => {
    const res = await api.get('/users/me');
    const { chatRooms } = await api.get('/chat_rooms');
    console.log(chatRooms);
    setChatRooms(chatRooms);
    setUser(res.user);
    setLoading(false);
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const createRoom = async (name ) => {
    setIsOpen(false);
    let longitude = location[1];
    let latitude = location[0];
    const { chatRoom } = await api.post('/chat_rooms', { name, latitude, longitude});
    setChatRooms([...chatRooms, chatRoom]);
  };

  return (
    <div className="app-container">
      <Rooms>
      <div className="location-readout">
      <div>Current location: </div>
      <div>{Number(location[0]).toFixed(3)}, {Number(location[1]).toFixed(3)}</div>
      </div>
        {chatRooms.map((room) => {
          // if (room.latitude > (location[0] - 100) && room.latitude < (location[0] + 100)
          // && room.longitude > (location[1] - 100) && room.longitude < (location[1] + 100)){
          let distance = Math.sqrt(Math.pow(room.latitude - location[0], 2) + Math.pow(room.longitude - location[1], 2));
          if (distance < 50){
            return (
              <Room key={room.id} to={`chat_rooms/${room.id}`}>
                {room.name}
              </Room>
            );
          }  

        })}
        <Room action={() => setIsOpen(true)}>+</Room>
      </Rooms>
     
      <div className="chat-window">
        <Routes>
          <Route path="chat_rooms/:id" element={<ChatRoom />} />
          <Route path="/*" element={<div>Select a room to get started</div>} />
        </Routes>
      </div>
      {isOpen ? <NewRoomModal createRoom={createRoom} closeModal={() => setIsOpen(false)} /> : null}
    </div>
  );
};
