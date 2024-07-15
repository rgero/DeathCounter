import { Pie, PieChart } from "recharts";
import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { useDeathTracker } from "../../context/DeathTrackerContext";

const DeathPieChart = () => {
  const dimension = 350;
  const { deathList } = useDeathTracker();

  const [filteredItems, setFilteredItems] = useState(deathList.filter(item => item.deaths !== 0));

  useEffect(() => {
    setFilteredItems([...deathList.filter(item => item.deaths !== 0)])
  }, [deathList])

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index}) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#ac3232"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {filteredItems[index].name}
      </text>
    );
  }

  return (
    <Box display="flex" justifyContent="center" paddingBottom={10}>
      <PieChart width={dimension*2} height={dimension}>
        <Pie
          dataKey="deaths"
          data={filteredItems}
          cx="50%"
          cy="50%"
          outerRadius={125}
          fill="#ac3232"
          label={renderLabel}
        />
      </PieChart>
    </Box>
  )
}

export default DeathPieChart
