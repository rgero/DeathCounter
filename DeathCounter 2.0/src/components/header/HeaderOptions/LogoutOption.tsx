import HeaderMenuOption from "./HeaderMenuOption";
import { Logout } from "@mui/icons-material";
import { useAuthenticationContext } from "../../../context/AuthenticationContext";

const LogoutOption = () => {
  const { logout } = useAuthenticationContext();
  return (
    <HeaderMenuOption icon={<Logout/>} text="Log out" onClick={logout}/>
  )
}

export default LogoutOption
