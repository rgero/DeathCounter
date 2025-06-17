import HeaderMenuOption from "./HeaderMenuOption";
import { Person } from "@mui/icons-material";
import { useAuthenticationContext } from "../../../context/AuthenticationContext";

const UserOption = () => {
  const {user} = useAuthenticationContext();
  const userName =  user ? user.user_metadata.full_name : "Default User";

  return (
    <HeaderMenuOption icon={<Person/>} text={userName} />
  )
}

export default UserOption
