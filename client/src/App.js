import { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

const App = () => {
	const inputRef = useRef();
	const [messageReceived, setMessageReceived] = useState([]);
	const [room, setRoom] = useState('');
	const sendMessage = () => {
		if (room !== '') {
			socket.emit('send_message', { message: inputRef.current.value, room });
			setMessageReceived(prevState => {
				const updatedMessage = [...prevState];
				updatedMessage.push(inputRef.current.value);
				return updatedMessage;
			});
		}
	};

	const joinRoom = () => {
		if (room !== '') {
			socket.emit('join_room', room);
		}
	};

	socket.on('receive_message', messages => {
		setMessageReceived(messages[room]);
	});

	return (
		<div className="App">
			<input type="text" placeholder="Message..." ref={inputRef} />
			<button onClick={sendMessage}>Send Message</button>
			<input
				type="text"
				placeholder="Room"
				onChange={event => setRoom(event.target.value)}
			/>
			<button onClick={joinRoom}>Join</button>
			<ul>
				{messageReceived.map((message, index) => (
					<li key={index}>{message}</li>
				))}
			</ul>
		</div>
	);
};

export default App;
