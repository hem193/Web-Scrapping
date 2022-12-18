const puppeteer = require("puppeteer");
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
  const jobData = await page.evaluate(async (data) => {
    const items = document.querySelectorAll("td.resultContent");
    items.forEach((item, index) => {
      const title = item.querySelector("h2.jobTitle>a")?.innerText;
      const link = item.querySelector("h2.jobTitle>a")?.href;
      const salary = item.querySelector(
        "div.metadata.salary-snippet-conatiner > div"
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
  });
  return data;
  browser.close();
}

module.exports = main;
