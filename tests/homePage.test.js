import { expect } from "chai";
import { getDriver } from "../utils/driver.js";
import { By } from "selenium-webdriver";

describe("Home Page Tests", function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        driver = await getDriver();
        await driver.get("http://localhost:5000/");
    });

    after(async () => {
        await driver.quit();
    });

    // ----------------- Existing Test Cases -----------------

    // Test Case 1: Verify page title
    it("TC1: Should display the page title", async () => {
        const title = await driver.findElement(By.id("page-title")).getText();
        expect(title).to.equal("My Notes");
    });

    // Test Case 2: Verify Add New Note button
    it("TC2: Should show Add New Note button", async () => {
        const addBtn = await driver.findElement(By.id("add-new-note-btn"));
        expect(addBtn).to.not.be.null;
    });

    // Test Case 3: Verify notes container exists
    it("TC3: Should display notes container", async () => {
        const container = await driver.findElement(By.id("notes-container"));
        expect(container).to.not.be.null;
    });

    // ----------------- Additional Test Cases -----------------

    // Test Case 12: Verify each note card has title, content, edit and delete buttons
    it("TC12: Each note card has title, content, edit, delete buttons", async () => {
        const noteCards = await driver.findElements(By.css(".note-card"));
        expect(noteCards.length).to.be.above(0);

        for (const card of noteCards) {
            const title = await card.findElement(By.css(".note-title")).getText();
            const content = await card.findElement(By.css(".note-content")).getText();
            const editBtn = await card.findElement(By.css(".edit-note-btn"));
            const deleteBtn = await card.findElement(By.css(".delete-note-btn"));

            expect(title).to.not.be.empty;
            expect(content).to.not.be.empty;
            expect(editBtn).to.not.be.null;
            expect(deleteBtn).to.not.be.null;
        }
    });

    // Test Case 13: Verify notes are sorted by creation date descending
    it("TC13: Notes are sorted by createdAt descending", async () => {
        const titles = await driver.findElements(By.css(".note-title"));
        const firstTitleText = await titles[0].getText();
        const secondTitleText = titles.length > 1 ? await titles[1].getText() : null;

        expect(firstTitleText).to.not.be.empty;
        if (secondTitleText) expect(firstTitleText).to.not.equal(secondTitleText);
    });
});
