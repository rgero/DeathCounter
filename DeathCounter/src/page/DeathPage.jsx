import DeathList from "../components/DeathList/DeathList";
import Stats from "../components/Stats/Stats";
import { isMobile } from "../utils/isMobile";

const DeathPage = () => {
  return (
    <>
      <DeathList/>
      {isMobile() ? null : <Stats/>}
    </>
  )
}

export default DeathPage
