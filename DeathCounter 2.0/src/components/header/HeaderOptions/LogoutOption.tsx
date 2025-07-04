import { Logout } from "@mui/icons-material";
import MenuOption from "../../../interfaces/MenuOption";
import { useAuthenticationContext } from "../../../context/AuthenticationContext";

const LogoutOption = () => {
  const { logout } = useAuthenticationContext();
  return (
    <MenuOption icon={<Logout/>} text="Log out" onClick={logout}/>
  )
}

export default LogoutOption
