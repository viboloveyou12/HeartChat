"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/router";

import { socket } from "../socket";
import IMessage from "../interfaces/IMessage";

type SocketContextType = {
  socket: any;
  messages: any;
  socketId: string;
  lastSeenMsg: any;
  setLastSeenMsg: React.Dispatch<React.SetStateAction<any>>;
};

const initialData: SocketContextType = {
  socket: socket,
  messages: {},
  socketId: "",
  lastSeenMsg: {},
  setLastSeenMsg: () => {},
};
const SocketContext = createContext(initialData);

function useSocket() {
  return useContext(SocketContext);
}

export default function SocketProvider({ children }: { children: ReactNode }) {
  const { push } = useRouter();
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState({});
  const [lastSeenMsg, setLastSeenMsg] = useState({});

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    function onReceiveMsg(data: IMessage) {
      setMessages((prev) => {
        const newMessages = { ...prev };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        newMessages[data.room_id] = [
          ...(newMessages[data.room_id] ?? []),
          data,
        ];
        return newMessages;
      });
    }

    function onAddRoom(roomId: string) {
      push(`/room/${roomId}`);
    }

    function onConnect() {
      setSocketId(socket.id);
    }

    socket.on("connect", onConnect);
    socket.on("receive_message", onReceiveMsg);
    socket.on("addRoom", onAddRoom);

    return () => {
      //TODO DISCONNECT
      socket.off("receive_message", onReceiveMsg);
    };
  }, [messages]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        messages,
        socketId,
        lastSeenMsg,
        setLastSeenMsg,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export { useSocket, SocketProvider };
