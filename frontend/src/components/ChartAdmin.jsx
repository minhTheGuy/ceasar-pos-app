import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";

const ChartAdmin = ({ totalAmountByMonth, months }) => {
  const chartConfig = {
    type: "line",
    height: 300,
    series: [
      {
        name: "Sales",
        data: totalAmountByMonth,
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: false,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: true,
      },
      colors: ["#22c55e"],
      stroke: {
        lineCap: "round",
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: months,
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };
  return (
    <Card>
      <CardHeader floated={false} shadow={false} color="transparent">
        <Typography variant="h6" color="blue-gray">
          Thống kê tổng doanh thu
        </Typography>
        <Typography
          variant="small"
          color="gray"
          className="max-w-sm font-normal"
        >
          Tính từ thời điểm hiện tại so với năm ngoái
        </Typography>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
};

export default ChartAdmin;
