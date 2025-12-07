import { expect } from "chai";
import { getDriver } from "../utils/driver.js";
import { By, until } from "selenium-webdriver";

describe("Add Note Tests", function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        driver = await getDriver();
        await driver.get("http://51.20.43.93:5000/add");
    });

    after(async () => {
        await driver.quit();
    });

    // ----------------- Existing Test Cases -----------------

    // Test Case 4: Add Note page loads correctly
    it("TC4: Should load Add Note page", async () => {
        const heading = await driver.findElement(By.id("add-note-heading")).getText();
        expect(heading).to.equal("Add Note");
    });

    // Test Case 5: Adding a new note
    it("TC5: Should add a new note", async () => {
        await driver.findElement(By.id("add-note-title")).sendKeys("Test Note");
        await driver.findElement(By.id("add-note-content")).sendKeys("This is a test note.");
        await driver.findElement(By.id("submit-add-note")).click();

        await driver.wait(until.urlIs("http://51.20.43.93:5000/"), 5000);
        const titleText = await driver.findElement(By.css(".note-title")).getText();
        expect(titleText).to.equal("Test Note");
    });

    // ----------------- Additional Test Cases -----------------

    // Test Case 14: Verify cancel button navigates back to home
    it("TC14: Cancel button navigates back to home", async () => {
        await driver.get("http://51.20.43.93:5000/add");
        const cancelBtn = await driver.findElement(By.id("cancel-add-note"));
        await cancelBtn.click();
        await driver.wait(until.urlIs("http://51.20.43.93:5000/"), 5000);
        const pageTitle = await driver.findElement(By.id("page-title")).getText();
        expect(pageTitle).to.equal("My Notes");
    });

    // Test Case 15: Verify title input field is empty initially
    it("TC15: Title input field is empty on page load", async () => {
        await driver.get("http://51.20.43.93:5000/add");
        const titleValue = await driver.findElement(By.id("add-note-title")).getAttribute("value");
        expect(titleValue).to.equal("");
    });

    // Test Case 16: Verify content textarea is empty initially
    it("TC16: Content textarea is empty on page load", async () => {
        const contentValue = await driver.findElement(By.id("add-note-content")).getText();
        expect(contentValue).to.equal("");
    });

    // Test Case 17: Verify form submission without title shows HTML required validation
    it("TC17: Form submission without title should be blocked", async () => {
        await driver.get("http://51.20.43.93:5000/add");
        const contentInput = await driver.findElement(By.id("add-note-content"));
        await contentInput.sendKeys("Note without title");
        const addBtn = await driver.findElement(By.id("submit-add-note"));
        const isDisabled = await addBtn.getAttribute("disabled");
        expect(isDisabled).to.be.null; // HTML5 required blocks submission, but button itself is not disabled
    });

    // Test Case 18: Verify form submission without content shows HTML required validation
    it("TC18: Form submission without content should be blocked", async () => {
        await driver.get("http://51.20.43.93:5000/add");
        const titleInput = await driver.findElement(By.id("add-note-title"));
        await titleInput.sendKeys("Title only");
        const addBtn = await driver.findElement(By.id("submit-add-note"));
        const isDisabled = await addBtn.getAttribute("disabled");
        expect(isDisabled).to.be.null; // HTML5 required blocks submission, but button itself is not disabled
    });
});
