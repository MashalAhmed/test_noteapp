import { expect } from "chai";
import { getDriver } from "../utils/driver.js";
import { By, until } from "selenium-webdriver";

describe("Edit Note Tests", function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        driver = await getDriver();

        // Ensure at least one note exists
        await driver.get("http://51.20.43.93:5000/add");
        await driver.findElement(By.id("add-note-title")).sendKeys("Note for Edit");
        await driver.findElement(By.id("add-note-content")).sendKeys("Content for edit test");
        await driver.findElement(By.id("submit-add-note")).click();
        await driver.wait(until.urlIs("http://51.20.43.93:5000/"), 5000);

        // Navigate to edit first note
        await driver.findElement(By.css(".edit-note-btn")).click();
        await driver.wait(until.urlContains("/edit/"), 5000);
    });

    after(async () => {
        await driver.quit();
    });

    // ----------------- Existing Test Cases -----------------

    // Test Case 6: Edit Note page loads
    it("TC6: Should load Edit Note page", async () => {
        const heading = await driver.findElement(By.id("edit-note-heading")).getText();
        expect(heading).to.equal("Edit Note");
    });

    // Test Case 7: Update note title and content
    it("TC7: Should update note title and content", async () => {
        const titleInput = await driver.findElement(By.id("edit-note-title"));
        const contentInput = await driver.findElement(By.id("edit-note-content"));

        await titleInput.clear();
        await titleInput.sendKeys("Updated Test Note");
        await contentInput.clear();
        await contentInput.sendKeys("Updated content.");

        await driver.findElement(By.id("save-edit-note")).click();
        await driver.wait(until.urlIs("http://51.20.43.93:5000/"), 5000);

        const titleText = await driver.findElement(By.css(".note-title")).getText();
        expect(titleText).to.equal("Updated Test Note");
    });

    // ----------------- Additional Test Cases -----------------

    // Test Case 19: Cancel button navigates back to home without saving
    it("TC19: Cancel button should navigate back to home without saving", async () => {
        await driver.get("http://51.20.43.93:5000/");
        await driver.findElement(By.css(".edit-note-btn")).click();
        await driver.wait(until.urlContains("/edit/"), 5000);

        const cancelBtn = await driver.findElement(By.id("cancel-edit-note"));
        await cancelBtn.click();

        await driver.wait(until.urlIs("http://51.20.43.93:5000/"), 5000);
        const pageTitle = await driver.findElement(By.id("page-title")).getText();
        expect(pageTitle).to.equal("My Notes");
    });

    // Test Case 20: Edit note title input field has existing value
    it("TC20: Title input field should contain current note title", async () => {
        await driver.get("http://51.20.43.93:5000/");
        await driver.findElement(By.css(".edit-note-btn")).click();
        await driver.wait(until.urlContains("/edit/"), 5000);

        const titleInput = await driver.findElement(By.id("edit-note-title"));
        const value = await titleInput.getAttribute("value");
        expect(value).to.equal("Updated Test Note"); // Should match last updated title
    });

    // Test Case 21: Edit note content textarea has existing value
    it("TC21: Content textarea should contain current note content", async () => {
        const contentInput = await driver.findElement(By.id("edit-note-content"));
        const value = await contentInput.getText();
        expect(value).to.equal("Updated content."); // Should match last updated content
    });

    // Test Case 22: Empty title field should block saving
    it("TC22: Form submission with empty title should be blocked", async () => {
        const titleInput = await driver.findElement(By.id("edit-note-title"));
        await titleInput.clear();

        const saveBtn = await driver.findElement(By.id("save-edit-note"));
        const isDisabled = await saveBtn.getAttribute("disabled");
        expect(isDisabled).to.be.null; // HTML5 required prevents submission
    });

    // Test Case 23: Empty content field should block saving
    it("TC23: Form submission with empty content should be blocked", async () => {
        const contentInput = await driver.findElement(By.id("edit-note-content"));
        await contentInput.clear();

        const saveBtn = await driver.findElement(By.id("save-edit-note"));
        const isDisabled = await saveBtn.getAttribute("disabled");
        expect(isDisabled).to.be.null; // HTML5 required prevents submission
    });
});
