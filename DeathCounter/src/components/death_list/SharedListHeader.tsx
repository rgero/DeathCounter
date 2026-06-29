import { Typography } from "@mui/material";
import { DeathList } from "@interfaces/DeathList";

interface SharedListHeaderProps {
  deathList: DeathList;
}

const SharedListHeader = ({ deathList }: SharedListHeaderProps) => {
  return (
    <>
      <Typography variant="h4" sx={{ py: 3, textAlign: "center" }}>
        {deathList.name}
      </Typography>

      {deathList.description && (
        <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
          {deathList.description}
        </Typography>
      )}
    </>
  );
};

export default SharedListHeader;
