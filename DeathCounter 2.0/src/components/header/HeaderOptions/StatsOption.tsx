import HeaderMenuOption from "./HeaderMenuOption";
import { QueryStats } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const StatsOption = () => {
  const navigate = useNavigate();
  return (
    <HeaderMenuOption icon={<QueryStats/>} text="Stats" onClick={() => navigate('/stats')}/>
  )
}

export default StatsOption
