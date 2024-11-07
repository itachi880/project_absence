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
  graph_titel = false,
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
            title: graph_titel
              ? {
                  display: true,
                  text: graph_titel,
                }
              : { display: false },
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
/**
 * Renders a table based on JSON data, with customizable columns, HTML attributes, and cell click events.
 *
 * @param {Object} props - The props for the component.
 * @param {Array<Object>} [props.data=[]] - The data to display in the table, where each object represents a row.
 * @param {object} [props.replace_column_names={}] - An array of column names to exclude from the table.
 * @param {Array<string>} [props.exclude=[]] - An array of column names to exclude from the table.
 * @param {JSX.Element} [props.NoDataComponent=() => <>no data</>] - A component to render when there is no data.
 * @param {Object} [props.htmlProperties={}] - An object to specify JSX properties for various HTML elements within the table.
 * @param {React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>} [props.htmlProperties.table={}] - Properties for the `<table>` element (e.g., `className`, `style`, `aria-label`).
 * @param {React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>} [props.htmlProperties.thead={}] - Properties for the `<thead>` element.
 * @param {React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>} [props.htmlProperties.tbody={}] - Properties for the `<tbody>` element.
 * @param {React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>} [props.htmlProperties.bodyTr={}] - Properties for `<tr>` elements within `<tbody>`.
 * @param {React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>} [props.htmlProperties.headTr={}] - Properties for `<tr>` elements within `<thead>`.
 * @param {React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>} [props.htmlProperties.bodyTd={}] - Properties for `<td>` elements within `<tbody>`.
 * @param {React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>} [props.htmlProperties.headTd={}] - Properties for `<th>` elements within `<thead>`.
 * @param {function} [props.onCellClick=(index, row, event) => {}] - Callback function for cell click events, providing the cell index, the row data, and the event object.
 * @param {number} props.onCellClick.index - The index of the clicked cell within the row.
 * @param {Object} props.onCellClick.row - The row data for the clicked cell.
 * @param {React.MouseEvent} props.onCellClick.event - The click event.
 *
 * @returns {JSX.Element} - A JSX table element based on the provided JSON data.
 */
export function TableByJson({ data = [], replace_column_names = {}, exclude = [], NoDataCompognent = () => <>no data</>, htmlProperties = { table: {}, thead: {}, tbody: {}, bodyTr: {}, headTr: {}, bodyTd: {}, headTd: {} }, dataTdsOnclick = (index, objectDataRow, event) => {} }) {
  if (data.length <= 0 || !Array.isArray(data)) return <NoDataCompognent />;

  const columns = Object.keys(data[0]).filter((column) => !exclude.includes(column));
  return (
    <table {...htmlProperties.table}>
      <thead {...htmlProperties.thead}>
        <tr {...htmlProperties.headTr}>
          {columns.map((column) => (
            <th key={column} {...htmlProperties.headTd}>
              {replace_column_names[column] || column}
            </th>
          ))}
        </tr>
      </thead>

      <tbody {...htmlProperties.tbody}>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} {...htmlProperties.bodyTr}>
            {columns.map((column, index) => (
              <td key={`${rowIndex}-${column}`} {...htmlProperties.bodyTd} onClick={(e) => dataTdsOnclick(index, row, e)}>
                {row[column]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
