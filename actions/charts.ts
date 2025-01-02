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

const isInvalidDate = (d) =>
  Object.prototype.toString.call(d) !== "[object Date]" ||
  isNaN(new Date(d).getTime());

function parseTimeString(timeString: string): Date {
  const now = new Date(); // Get the current date for reference
  now.setMilliseconds(0); // Clear milliseconds

  // Regular expression to match time strings
  const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;

  const match = timeString.match(timeRegex);

  if (!match) {
    throw new Error(`Invalid time format: ${timeString}`);
  }

  // Extract the hour, minute, and optional period (AM/PM)
  let [_, hourStr, minuteStr, period] = match;

  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (minute < 0 || minute > 59) {
    throw new Error(`Invalid minutes: ${minuteStr}`);
  }

  if (!period) {
    // Default to PM if no period is provided
    period = "PM";
  }

  // Convert to 24-hour format if period is specified
  if (period.toUpperCase() === "PM" && hour !== 12) {
    hour += 12;
  } else if (period.toUpperCase() === "AM" && hour === 12) {
    hour = 0;
  }

  if (hour < 0 || hour > 23) {
    throw new Error(`Invalid hour: ${hourStr}`);
  }

  // Set the time in the Date object
  now.setHours(hour, minute, 0);

  return now;
}

export async function syncChartsData(userId: string, data: FormData) {
  try {
    const session = await auth();

    const isAdmin = session?.user?.role === "ADMIN";

    if (!session?.user || session?.user.id !== userId || !isAdmin) {
      throw new Error("Unauthorized");
    }

    const charts: Prisma.ChartCreateManyInput[] = await getChartsData();
    const existingCharts = (
      (await prisma.chart.findMany({
        select: { id: true, title: true },
      })) || []
    ).map((chart) => chart.title);
    const chartsToCreate: Prisma.ChartCreateManyInput[] = charts.filter(
      (chart) => !!chart.title && !existingCharts.includes(chart.title),
    );

    if (chartsToCreate.length > 0) {
      await prisma.chart.createMany({
        data: chartsToCreate,
        skipDuplicates: true,
      });
    }
    // Pull all charts again to ensure completeness
    const updatedCharts = await prisma.chart.findMany({
      select: { title: true },
    });

    // Prepare a map for efficient lookups
    const scoreUpdates = charts.reduce(
      (acc, chart) => {
        acc[chart.title] = chart.score;
        return acc;
      },
      {} as Record<string, string>,
    );

    // Batch update scores
    await prisma.$transaction(
      updatedCharts.map((chart) =>
        prisma.chart.update({
          where: { title: chart.title },
          data: { score: scoreUpdates[chart.title] },
        }),
      ),
    );

    const allCharts = await prisma.chart.findMany();
    for await (const chart of allCharts) {
      await getChartResults(chart);
    }

    revalidatePath("/dashboard/settings");
    return { status: "success" };
  } catch (error) {
    return { status: "error", message: error.toString() };
  }
}

type Chart = {
  title: string;
  score: string;
  jodiChartUrl: string | undefined;
  panelChartUrl: string | undefined;
  startTime: Date;
  endTime: Date;
};

async function getChartsData() {
  const charts: Chart[] = [];
  const response = await fetch("https://sattamatkachart.in/");
  const htmlString = await response.text();
  const $ = cheerio.load(htmlString);
  $(".news-body .fix, .news-body .news2").each((_i, el) => {
    const $this = $(el);
    const chart: Chart = {} as Chart;
    chart.title = $this.find("span").first().text();
    chart.score = $this.find("span").eq(1).text();
    chart.jodiChartUrl = $this.find(".jodichartleft a").attr("href");
    chart.panelChartUrl = $this.find(".panelchartright a").attr("href");

    // One time only, edit manually after
    const timings = $this.find("span").last().text();
    let [startTime, endTime] = timings.match(/\d{1,2}:\d{1,2}/g) || [];
    if (!startTime || !endTime) {
      return;
    }
    if (chart.title.toLowerCase().includes("morning")) {
      startTime += " AM";
      endTime += " AM";
    } else {
      startTime += " PM";
      endTime += " PM";
    }
    chart.startTime = parseTimeString(startTime);
    chart.endTime = parseTimeString(endTime);

    chart.title = chart.title && chart.title.trim();
    const haveEssentialFields =
      chart.title && chart.jodiChartUrl && chart.panelChartUrl;
    if (haveEssentialFields) {
      charts.push(chart);
    }
  });

  return charts;
}

async function getChartResults(chart) {
  try {
    console.log("Fetching results for chart", chart.title, chart.panelChartUrl);
    const response = await fetch(chart.panelChartUrl);
    const htmlString = await response.text();
    const $ = cheerio.load(htmlString);
    const results: Prisma.ResultCreateInput[] = [];

    // const bugCharts = ["DELUXE", "SYNDICATE NIGHT", "RAJDHANI NIGHT"];
    // const showLogs = bugCharts.includes(chart.title);

    const cleanNumber = (str) => str.replace(/[^0-9]/g, "");

    // Weeks
    $("table.pchart tr").each((i, el) => {
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
        if (isInvalidDate(result.date)) {
          return;
        }
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
    try {
      if (results.length) {
        await prisma.result.createMany({
          data: results,
          skipDuplicates: true,
        });
      }
    } catch (error) {
      console.log("Skipping chart due to errors", chart);
    }

    return { status: "success" };
  } catch (error) {
    console.log(error);
    return { status: "error" };
  }
}
