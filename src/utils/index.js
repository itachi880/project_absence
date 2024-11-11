import { BarElement, CategoryScale, Chart, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
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
 * @param {Array<string>} [props.nonClickableTd=[]] - The order of colmuns the default one is used if empty
 * @param {Array<string>} [props.order=[]] - The order of colmuns the default one is used if empty
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
 * @param {function} [props.dataTdsOnclick=(index, row, event) => {}] - Callback function for cell click events, providing the cell index, the row data, and the event object.
 * @param {number} props.dataTdsOnclick.index - The index of the clicked cell within the row.
 * @param {Object} props.dataTdsOnclick.row - The row data for the clicked cell.
 * @param {React.MouseEvent} props.dataTdsOnclick.event - The click event.
 *
 * @returns {JSX.Element} - A JSX table element based on the provided JSON data.
 */
export function TableByJson({ data = [], nonClickableTd = [], order = [], replace_column_names = {}, exclude = [], NoDataCompognent = () => <>no data</>, htmlProperties = { table: {}, thead: {}, tbody: {}, bodyTr: {}, headTr: {}, bodyTd: {}, headTd: {} }, dataTdsOnclick = (index, objectDataRow, event) => {} }) {
  if (data.length <= 0 || !Array.isArray(data)) return <NoDataCompognent />;

  const columns = [...new Set([...order, ...Object.keys(data[0]).filter((column) => !exclude.includes(column))]).values()];
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
              <td
                key={`${rowIndex}-${column}`}
                {...htmlProperties.bodyTd}
                onClick={(e) => {
                  if (nonClickableTd.includes(column)) return;
                  dataTdsOnclick(index, row, e);
                }}
              >
                {row[column]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export const spans = {
  true: ({ text, onClick = () => {} }) => (
    <span className="true" onClick={onClick} style={{ padding: "5px 10px", fontWeight: "bold", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "0.9rem", border: "2px solid", borderRadius: "5px", color: " var(--correct-color)", borderColor: " var(--correct-color)", backgroundColor: " var(--correct-color-background)" }}>
      {text}
    </span>
  ),
  false: ({ text, onClick = () => {} }) => (
    <span className="false" onClick={onClick} style={{ padding: "5px 10px", fontWeight: "bold", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "0.9rem", border: "2px solid", borderRadius: "5px", color: " var(--error-color)", borderColor: " var(--error-color)", backgroundColor: " var(--error-color-background)" }}>
      {text}
    </span>
  ),
  maybe: ({ text, onClick = () => {} }) => (
    <span className="false" onClick={onClick} style={{ padding: "5px 10px", fontWeight: "bold", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "0.9rem", border: "2px solid", borderRadius: "5px", color: " var(--maybe-color)", borderColor: " var(--maybe-color)", backgroundColor: " var(--maybe-color-background)", cursor: "pointer" }}>
      {text}
    </span>
  ),
  maybe: ({ text }) => (
    <span className="false" style={{ color: " var(--maybe-color)", borderColor: " var(--maybe-color)", backgroundColor: " var(--maybe-color-background)" }}>
      {text}
    </span>
  ),
};

export const PopUp = ({ removeOnClick = true, isLoading = true, timer = 3000, message = "Loading...", color = "var(--maybe-color)" }) => {
  const [isVisible, setIsVisible] = useState(isLoading);

  useEffect(() => {
    if (isLoading && timer > 0) {
      const timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, timer);

      return () => clearTimeout(timeoutId);
    }
    if (!timer) setIsVisible(true);
  }, [isLoading, timer]);
  if (!isLoading || !isVisible) return null;

  return (
    <div
      onClick={(e) => {
        if (!removeOnClick) return;
        setIsVisible(false);
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          color: color,
          padding: "1em",
          borderRadius: "5px",
          minWidth: "300px",
          textAlign: "center",
          position: "relative",
          fontWeight: "bold",
          border: "1px solid " + color,
        }}
      >
        {message}
        <span style={{ position: "absolute", width: "100%", left: 0, background: color, height: "5px", top: "0" }}></span>
      </div>
    </div>
  );
};
