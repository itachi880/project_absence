import { BarElement, CategoryScale, Chart, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
export function BarChart({
  data,
  x_axes,
  y_axes,
  PosibleColors = [
    {
      text: "",
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 0,
      hidden: false,
    },
  ],
  container_html_properties = {},
}) {
  return (
    <div {...container_html_properties}>
      <Bar
        data={{
          labels: data.map((e) => e[x_axes]),
          datasets: [
            {
              label: "avrege absence is",
              data: data.map((e) => e[y_axes]),
              backgroundColor: data.map((e) => e.color) || "bleu",
              borderColor: "black",
              borderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Users Gained between 2016-2020",
            },
            legend: {
              display: true,
              position: "top",

              labels: {
                generateLabels: (chart) => PosibleColors,
              },
            },
          },
        }}
      />
    </div>
  );
}
