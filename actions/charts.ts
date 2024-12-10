"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { Prisma, UserRole } from "@prisma/client";
import * as cheerio from "cheerio";
import moment from "moment-timezone";

import { prisma } from "@/lib/db";

const TIMEZONE = "Asia/Kolkata";

export type FormData = {
  role: UserRole;
};

export async function syncChartsData(userId: string, data: FormData) {
  try {
    const session = await auth();

    const isAdmin = session?.user?.role === "ADMIN";

    if (!session?.user || session?.user.id !== userId || !isAdmin) {
      throw new Error("Unauthorized");
    }

    const charts = await getChartsData();
    const dataToSave = await charts.filter((chart) => !!chart.title);
    // const synchedChart = await prisma.chart.createMany({
    //   data: dataToSave,
    //   skipDuplicates: true,
    // });

    const existingCharts = await prisma.chart.findMany();
    for await (const chart of existingCharts) {
      await getChartResults(chart);
    }

    revalidatePath("/dashboard/settings");
    return { status: "success" };
  } catch (error) {
    console.log(error);
    return { status: "error" };
  }
}

type Chart = {
  title: string;
  score: string;
  jodiChartUrl: string | undefined;
  panelChartUrl: string | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
};

async function getChartsData() {
  const charts: Chart[] = [];
  try {
    const response = await fetch("https://sattamatkachart.in/");
    const htmlString = await response.text();
    const $ = cheerio.load(htmlString);
    $(".news-body .fix").each((i, el) => {
      const $this = $(el);
      const chart: Chart = {} as Chart;
      chart.title = $this.find("span").first().text();
      chart.score = $this.find("span").eq(1).text();
      chart.jodiChartUrl = $this.find(".jodichartleft a").attr("href");
      chart.panelChartUrl = $this.find(".panelchartright a").attr("href");

      const timings = $this.find("span").last().text();
      const [startTime, endTime] = timings.match(/\d{2}:\d{2}/g) || [];
      chart.startTime = startTime;
      chart.endTime = endTime;

      chart.title = chart.title && chart.title.trim();
      charts.push(chart);
    });
  } catch (error) {
    console.log(error);
  }
  return charts;
}

async function getChartResults(chart) {
  try {
    console.log("Fetching results for chart", chart.title);
    console.log("Fetching results for chart", chart.panelChartUrl);
    const response = await fetch(chart.panelChartUrl);
    const htmlString = await response.text();
    const $ = cheerio.load(htmlString);
    const results: Prisma.ResultCreateInput[] = [];

    const cleanNumber = (str) => str.replace(/[^0-9]/g, "");

    // Weeks
    $("table.pchart tr").each((i, el) => {
      // if (i > 1) return;

      const $headings = $(el).children();
      const dates = $headings.first().text();
      const [startDate, _] = dates.match(/\d{2}\/\d{2}\/\d{2,4}/g) || [];

      for (let j = 1; j < $headings.length; j += 3) {
        const result: Prisma.ResultCreateInput = {} as Prisma.ResultCreateInput;

        const today = moment(startDate, ["DD/MM/YYYY", "DD/MM/YY"])
          .tz(TIMEZONE)
          .add(Math.floor(j / 3), "days")
          .startOf("day");
        result.chartId = chart.id;
        result.date = today.toDate();
        result.openNumbers = cleanNumber($headings.eq(j).text());
        result.sum = cleanNumber($headings.eq(j + 1).text());
        result.closeNumbers = cleanNumber($headings.eq(j + 2).text());
        result.score = result.closeNumbers
          ? `${result.openNumbers}-${result.sum}-${result.closeNumbers}`
          : result.openNumbers
            ? `${result.openNumbers}-${result.sum}`
            : "";
        // console.log(JSON.stringify(result));
        const hasResult =
          result.openNumbers || result.sum || result.closeNumbers;
        if (hasResult) {
          results.push(result);
        }
      }
    });
    // console.table(results.slice(results.length - 10));
    // console.table(results);
    // console.table(results.slice(0, 10));
    console.log("Total results", results.length);
    await prisma.result.createMany({
      data: results,
      skipDuplicates: true,
    });

    return { status: "success" };
  } catch (error) {
    console.log(error);
    return { status: "error" };
  }
}
