import { CloudDownload } from "@mui/icons-material";
import MenuOption from "../../../interfaces/MenuOption";
import { useNavigate } from "react-router-dom";

const DownloadToolOption = () => {
  const navigate = useNavigate();
  return (
    <MenuOption icon={<CloudDownload/>} text="Get Listener" onClick={() => navigate('/download')}/>
  )
}

export default DownloadToolOption
