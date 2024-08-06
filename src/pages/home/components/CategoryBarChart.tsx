import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Product } from "@/store/products/ProductsSlice";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props {
  products: Product[];
}

const CategoryBarChart: React.FC<Props> = ({ products }) => {
  const categoryCounts = products.reduce(
    (acc: Record<string, number>, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    },
    {}
  );

  const data = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Number of Products",
        data: Object.values(categoryCounts),
        backgroundColor: ["#42A5F5", "#FFCE56", "#4BC0C0", "#FF6384", "#000"], // Bar color
        borderColor: ["#42A5F5", "#FFCE56", "#4BC0C0", "#FF6384", "#000"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "rgba(0, 0, 0, 0.7)",
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const category = tooltipItem.label;
            const count = tooltipItem.raw;
            return `${category}: ${count} products`;
          },
        },
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "rgba(0, 0, 0, 0.7)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "rgba(0, 0, 0, 0.7)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  return (
    <div
      className="mb-10"
      style={{ position: "relative", height: "400px", width: "100%" }}
    >
      <h2>Number of Products by Category</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default CategoryBarChart;
