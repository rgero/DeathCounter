import React from "react";
import { useSocket } from "../hooks/useWebSocket";

const DeathPage = () => {
  const socket = useSocket();
  const [deaths, setDeaths] = React.useState(0);

  const processIncrement = () => {
    setDeaths( (deaths) => deaths+1 );
  }

  React.useEffect( () => {
    socket.on("Death", processIncrement);

    return () => {
      socket.off("Death", processIncrement);
    }
  })

  return (
    <div>
      {deaths}
    </div>
  )
}

export default DeathPage
