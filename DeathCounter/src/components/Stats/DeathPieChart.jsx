import { Cell, Pie, PieChart } from "recharts";
import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { useDeathTracker } from "../../context/DeathTrackerContext";

const DeathPieChart = () => {
  const dimension = 350;
  const { deathList } = useDeathTracker();

  const [filteredItems, setFilteredItems] = useState([]);
  const [colors, setColors] = useState([]);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    const filtered = deathList.filter(item => item.deaths !== 0);
    setFilteredItems(filtered);
    setColors(filtered.map(() => getRandomColor()));
  }, [deathList]);

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={colors[index]}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {filteredItems[index].name}
      </text>
    );
  };

  return (
    <Box display="flex" justifyContent="center" paddingBottom={10}>
      <PieChart width={dimension * 2} height={dimension}>
        <Pie
          dataKey="deaths"
          data={filteredItems}
          cx="50%"
          cy="50%"
          outerRadius={125}
          fill="#ac3232"
          label={renderLabel}
          labelLine={false}
        >
          {filteredItems.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Pie>
      </PieChart>
    </Box>
  );
};

export default DeathPieChart;