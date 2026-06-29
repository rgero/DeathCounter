import { Grid, IconButton, alpha } from "@mui/material"

import { Add, Share } from "@mui/icons-material"
import GameSelector from "../ui/GameSelector"
import UserAvatar from "./UserAvatar"
import { grey } from "@mui/material/colors"
import { useIsMobile } from "../../hooks/useIsMobile"
import { useOptionalModalProvider } from "../../context/modal/ModalContext"
import { useOptionalDeathLists } from "../../context/deathCounter/DeathCounterContext"

const HeaderOptionsPanel = () => {
  const modalContext = useOptionalModalProvider();
  const deathListContext = useOptionalDeathLists();
  const isMobile = useIsMobile();

  if (!modalContext || !deathListContext) {
    return null;
  }

  const { toggleCreateNewModal, toggleShareListModal } = modalContext;
  const { activeDeathList } = deathListContext;

  return (

    <Grid container spacing={1} sx={{ alignItems: "center", justifyContent: "center", backgroundColor: alpha(grey[900], 0.9), borderRadius: "8px", padding: "0.25rem 0.5rem" }}>
      {!isMobile && (
        <>
          <Grid>
            <GameSelector/>
          </Grid>
          <Grid>
            <IconButton onClick={toggleCreateNewModal} size="small" sx={{color: "white"}}>
              <Add/>
            </IconButton>
          </Grid>
          {activeDeathList && (
            <Grid>
              <IconButton onClick={toggleShareListModal} size="small" sx={{color: "white"}} title="Share Death List">
                <Share/>
              </IconButton>
            </Grid>
          )}
        </>
      )}
      <Grid>
        <UserAvatar />
      </Grid>
    </Grid>
  )
}

export default HeaderOptionsPanel
