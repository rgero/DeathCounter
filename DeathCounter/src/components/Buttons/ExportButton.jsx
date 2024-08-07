import { IconButton, Tooltip } from "@mui/material";

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useDeathTracker } from "../../context/DeathTrackerContext";

const ExportButton = () => {
  const {gameName, deathList} = useDeathTracker();

  const processDownload = () => {
    let exportObject = {gameName: gameName}
    const sortedList = deathList.sort( (a,b) => a.id - b.id);
    exportObject.deathList = sortedList;
    const jsonString = JSON.stringify(exportObject);

    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a link to download the Blob
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Deaths.json');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <Tooltip title="Download data">
      <IconButton onClick={processDownload}>
        <FileDownloadIcon/>
      </IconButton>
    </Tooltip>
  )
}

export default ExportButton
