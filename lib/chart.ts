import moment from "moment-timezone";

import { activeCharts } from "@/config/chart";
import { prisma } from "@/lib/db";

export const getChartById = async (id: string) => {
  try {
    const chart = await prisma.chart.findUnique({ where: { id } });

    return chart;
  } catch {
    return null;
  }
};

export const getCharts = async () => {
  try {
    const charts = await prisma.chart.findMany();
    return charts;
  } catch {
    return null;
  }
};

export const getPublicCharts = async () => {
  try {
    const charts = await prisma.chart.findMany({
      where: {
        title: {
          in: activeCharts,
          mode: "insensitive", // Ignore case
        },
      },
    });
    return charts;
  } catch {
    return null;
  }
};

export const getChartResults = async (chartId: string) => {
  try {
    const results = await prisma.result.findMany({
      where: { chartId: chartId },
    });
    const resultWithDate = results
      .sort((a, b) => b.date - a.date)
      .map((result) => {
        return {
          ...result,
          date: moment(result.date).format("DD-MM-YYYY"),
        };
      });
    return resultWithDate;
  } catch (error) {
    console.log(error);
    return [];
  }
};
