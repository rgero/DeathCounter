import MenuOption from "../../../interfaces/MenuOption";
import { QueryStats } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const StatsOption = () => {
  const navigate = useNavigate();
  return (
    <MenuOption icon={<QueryStats/>} text="Stats" onClick={() => navigate('/stats')}/>
  )
}

export default StatsOption
