import { Grid } from "@mui/material"
import { useDeathLists } from "../../context/DeathCounterContext";
import { useModalProvider } from "../../context/ModalContext";

const DeathlistHeader = () => {
  const { toggleTokenModal } = useModalProvider();
  const {getCurrentlyActiveDeathList, isLoading} = useDeathLists();

  const currentlyActiveDeathList = getCurrentlyActiveDeathList();

  if (isLoading || !currentlyActiveDeathList) {
    return null;
  }

  return (
    <Grid container direction="row" justifyContent="space-between">
      <Grid>
        {currentlyActiveDeathList.name}
      </Grid>
      <Grid>
        <button onClick={toggleTokenModal}>Toggle Token Modal</button>
      </Grid>
    </Grid>
  )
}

export default DeathlistHeader
