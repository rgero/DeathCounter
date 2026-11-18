import { Box, Grid, IconButton, InputAdornment, OutlinedInput, Typography } from "@mui/material"
import { CopyAll, Visibility, VisibilityOff } from "@mui/icons-material"
import { useEffect, useState } from "react"

import BaseModal from "./BaseModal"
import { encryptAuthToken } from "@utils/crypt"
import toast from "react-hot-toast"
import { useDeathLists } from "@context/deathCounter/DeathCounterContext"
import { useModalProvider } from "@context/modal/ModalContext"

const TokenModal = () => {
  const { tokenModalOpen, toggleTokenModal } = useModalProvider()
  const { activeDeathList, regenerateToken } = useDeathLists()
  const [showToken, setShowToken] = useState(false);
  const [showAuthToken, setShowAuthToken] = useState(false);
  const [authResult, setAuthResult] = useState<{ token: string; value: string; failed: boolean }>();
  const listToken = activeDeathList?.token;

  useEffect(() => {
    if (!tokenModalOpen || !listToken) return;
    let active = true;
    void encryptAuthToken(listToken).then(value => {
      if (active) setAuthResult({ token: listToken, value, failed: false });
    }).catch(() => {
      if (active) setAuthResult({ token: listToken, value: '', failed: true });
    });
    return () => { active = false; };
  }, [listToken, tokenModalOpen]);

  const encryptedAuthToken = authResult?.token === listToken ? authResult?.value ?? '' : '';
  const authFailed = authResult?.token === listToken && authResult?.failed;

  if (!activeDeathList) {
    return null;
  }

  const handleClickShowToken = () => setShowToken((show) => !show);
  const handleClickShowAuthToken = () => setShowAuthToken((show) => !show);

  const handleRegenerateToken = async () => {
    await regenerateToken();
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const copyTokensToClipboard = async () => {
    if (!encryptedAuthToken) return;
    const tokens = {
      gameToken: activeDeathList.token,
      authToken: encryptedAuthToken
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(tokens));
      toast.success("Tokens copied to clipboard");
    } catch {
      toast.error("Unable to copy tokens");
    }
  }

  return (
    <BaseModal
      open={tokenModalOpen}
      handleClose={toggleTokenModal}
      label="token-modal"
    >
      <Grid container spacing={2} sx={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Grid>
          <Typography variant="h6">{activeDeathList.name} - Token</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <Grid>
            <Typography>Game Token</Typography>
            <OutlinedInput
              id="outlined-adornment-token"
              type={showToken ? 'text' : 'password'}
              value={activeDeathList.token}
              endAdornment={
                <InputAdornment position="end">
                  <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <IconButton
                          aria-label={
                            showToken ? 'hide the token' : 'display the token'
                          }
                          onClick={handleClickShowToken}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showToken ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                  </Box>
                </InputAdornment>

              }
              label="Token"
            />
            <Grid>
              <Typography>Websocket Auth Token</Typography>
              <OutlinedInput
                id="outlined-adornment-auth-token"
                type={showAuthToken ? 'text' : 'password'}
                value={encryptedAuthToken}
                endAdornment={
                  <InputAdornment position="end">
                    <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <IconButton
                            aria-label={
                              showAuthToken ? 'hide the token' : 'display the token'
                            }
                            onClick={handleClickShowAuthToken}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                          >
                            {showAuthToken ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                    </Box>
                  </InputAdornment>

                }
                label="Auth Token"
              />
              {authFailed && <Typography role="alert" color="error">Unable to encrypt auth token</Typography>}
            </Grid>
          </Grid>
        </Grid>
        <Grid>
          <IconButton onClick={copyTokensToClipboard} disabled={!encryptedAuthToken} aria-label="Copy tokens">
            <CopyAll />
            <Typography variant="body2">Copy Tokens</Typography>
          </IconButton>
          <IconButton onClick={handleRegenerateToken}>
            <Typography variant="body2">Regenerate Token</Typography>
          </IconButton>     
        </Grid>
        <Grid>
          <IconButton onClick={toggleTokenModal}>
            <Typography variant="body2">Close</Typography>
          </IconButton>
        </Grid>
      </Grid>
    </BaseModal>
  )
}

export default TokenModal
