import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import toast from "react-hot-toast";

interface ShareListModalProps {
  open: boolean;
  onClose: () => void;
  shareToken: string | undefined;
}

const ShareListModal = ({
  open,
  onClose,
  shareToken,
}: ShareListModalProps) => {
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (shareToken) {
      const url = `${window.location.origin}/share/${shareToken}`;
      setShareUrl(url);
    }
  }, [shareToken]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied to clipboard!");
  };

  return (
    <BaseModal label="Share Death List" open={open} handleClose={onClose}>
      <Stack spacing={3}>
        <Typography variant="h6">Share this Death List</Typography>

        <Alert severity="info">
          Anyone with this link can view your death list without logging in.
          They won't be able to modify it.
        </Alert>

        <TextField
          fullWidth
          label="Share Link"
          value={shareUrl}
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
        />

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
          <Button
            onClick={handleCopyToClipboard}
            variant="contained"
            disabled={!shareUrl}
          >
            Copy Link
          </Button>
        </Box>
      </Stack>
    </BaseModal>
  );
};

export default ShareListModal;
