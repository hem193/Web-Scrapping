const puppeteer = require("puppeteer");
const fs = require("fs");
const data = {
  list: [],
};
async function main(skill) {
  //launches chromium
  const browser = await puppeteer.launch({ headless: false });
  //open new tab
  const page = await browser.newPage();
  // https://in.indeed.com/jobs?q={skill}&l=Bangalore%2C+Karnataka
  // https://in.indeed.com/jobs?q=sde&l=Bangalore%2C+Karnataka
  await page.goto(
    `https://in.indeed.com/jobs?q=${skill}&l=Bangalore%2C+Karnataka`,
    {
      timeout: 0,
      waitUntil: "networkidle0",
    }
  );

  // const pdf = page.pdf({
  //   path: "",
  //   format: "A4",
  // });

  // const screenshot = page.screenshot({
  //   path: "",
  //   fullPage: true,
  // });

  const jobData = await page.evaluate(async (data) => {
    const items = document.querySelectorAll("td.resultContent");
    items.forEach((item, index) => {
      const title = item.querySelector("h2.jobTitle>a")?.innerText;
      const link = item.querySelector("h2.jobTitle>a")?.href;
      const salary = item.querySelector(
        "div.metadata.salary-snippet-container > div"
      )?.innerText;
      const companyName = item.querySelector("span.companyName")?.innerText;
      if (salary === null) {
        salary = "not defined";
      }
      data.list.push({
        title,
        salary,
        companyName,
        link,
      });
    });
    return data;
  }, data);
  let response = await jobData;
  let json = JSON.stringify(jobData, null, 2);
  fs.writeFile("job.json", json, "utf-8", () => {
    console.log("Written in job.json");
  });

  browser.close();
  return response;
}

module.exports = main;
