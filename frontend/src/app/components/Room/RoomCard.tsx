import { useCallback, useRef } from "react";
import Stack from "@mui/material/Stack";

import "../../styles/room/roomCard.sass";
import { colorList } from "../../configs/constant";
import IRoom from "@/app/interfaces/IRoom";

type Props = {
  active: boolean;
  room: IRoom[];
  hasUnreadMsg: boolean;
};

export default function RoomCard({ active, room, hasUnreadMsg }: Props) {
  const { room_name, online_user_amount } = room[0];
  const getAvatarColor = useCallback(() => {
    const max = colorList.length;
    const index = Math.floor(Math.random() * max);
    return colorList[index];
  }, [room]);

  const colorRef = useRef(getAvatarColor());

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      className={`
                roomcard--container
                ${active && `active`}
            `}
    >
      <Stack direction="row">
        <div
          className="room--avatar"
          style={{
            color: colorRef.current,
          }}
        >
          {room_name.slice(0, 2)}
        </div>
        <div className="room--desc">
          <p className="name">{room_name}</p>
          <span className={`status ${online_user_amount > 1 && `online`}`}>
            {online_user_amount} online
          </span>
        </div>
      </Stack>
      {hasUnreadMsg && <div className="room--notifications"></div>}
    </Stack>
  );
}
