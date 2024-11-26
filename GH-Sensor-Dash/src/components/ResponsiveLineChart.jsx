import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
} from "recharts";

// Function to format time in 12-hour format with AM/PM
const formatTime = (time) => {
  const date = new Date(time);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour format to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${hours}:${minutes}:${seconds} ${ampm}`;
};

// Function to format the full date
const formatDate = (time) => {
  const date = new Date(time);
  return date.toLocaleDateString("en-US"); // Format as MM/DD/YYYY
};

// Custom Tooltip component to display the time and data
const CustomTooltip = ({ payload, label }) => {
  if (!payload || payload.length === 0) return null;

  const { dataKey, value } = payload[0];

  return (
    <div className="custom-tooltip bg-white p-2 border rounded shadow">
      <p className="text-sm text-gray-600">
        {formatDate(label)} - {formatTime(label)}
      </p>
      <p className="font-bold">
        {dataKey}: {value}
      </p>
    </div>
  );
};

const ResponsiveLineChart = ({ data, dataKey, domain, title }) => (
  <div className="w-full h-full">
    <LineChart
      width={1000}
      height={300}
      data={data}
      margin={{ top: 5, right: 20, bottom: 25, left: 20 }}
      className="w-full h-full"
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" tickFormatter={formatTime}>
        <Label value="Time" offset={-10} position="insideBottom" />
      </XAxis>
      <YAxis domain={domain}>
        <Label
          value={title}
          angle={-90}
          position="insideLeft"
          style={{ textAnchor: "middle" }}
        />
      </YAxis>
      <Tooltip content={<CustomTooltip />} />
      <Line
        type="monotone"
        dataKey={dataKey}
        stroke="#ef4444"
        dot={{ fill: "#ef4444" }}
      />
    </LineChart>
  </div>
);

export default ResponsiveLineChart;
