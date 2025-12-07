import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

export async function getDriver() {
  // Set Chrome options
  const options = new chrome.Options();
  options.addArguments("--headless=new"); // run in headless mode
  options.addArguments("--disable-gpu"); // recommended for headless
  options.addArguments("--ignore-certificate-errors"); // ignore SSL cert errors
  options.addArguments("--allow-insecure-localhost"); // allow self-signed localhost
  options.addArguments("--no-sandbox"); // required on some systems
  options.addArguments("--disable-dev-shm-usage"); // improve stability in headless

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  return driver;
}
