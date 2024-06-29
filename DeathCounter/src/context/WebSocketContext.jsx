/* eslint-disable react/prop-types */

import { createContext } from "react";
import io from 'socket.io-client';

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": `${import.meta.env.VITE_BACKEND_URL}`, // Match the origin allowed by Flask-SocketIO
    }
});

export const SocketContext = createContext(socket);

export const SocketProvider = ({children}) => (
  <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
);