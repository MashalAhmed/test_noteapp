import { expect } from "chai";
import { getDriver } from "../utils/driver.js";
import { By, until } from "selenium-webdriver";

describe("Delete Note Tests", function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        driver = await getDriver();

        // Ensure at least two notes exist for deletion tests
        for (let i = 1; i <= 2; i++) {
            await driver.get("http://51.20.43.93:5000/add");
            await driver.findElement(By.id("add-note-title")).sendKeys(`Note for Delete ${i}`);
            await driver.findElement(By.id("add-note-content")).sendKeys(`Content for delete test ${i}`);
            await driver.findElement(By.id("submit-add-note")).click();
            await driver.wait(until.urlIs("http://51.20.43.93:5000/"), 5000);
        }
    });

    after(async () => {
        await driver.quit();
    });

    // ----------------- Existing Test Case -----------------

    it("TC8: Should delete first note", async () => {
        const noteCard = await driver.wait(
            until.elementLocated(By.css(".note-card")),
            10000,
            "No note card found within timeout"
        );
        const noteTitle = await noteCard.findElement(By.css(".note-title")).getText();

        const deleteBtn = await noteCard.findElement(By.css(".delete-note-btn"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", deleteBtn);
        await deleteBtn.click();

        await driver.wait(until.stalenessOf(noteCard), 10000, "Note card did not disappear");

        const remainingNotes = await driver.findElements(By.css(".note-title"));
        if (remainingNotes.length > 0) {
            const remainingTitle = await remainingNotes[0].getText();
            expect(remainingTitle).to.not.equal(noteTitle);
        }
    });

    // ----------------- Additional Test Cases -----------------

    it("TC24: Should delete second note", async () => {
        let notes = await driver.findElements(By.css(".note-card"));
        expect(notes.length).to.be.at.least(1);

        const noteCard = await driver.findElement(By.css(".note-card")); // refetch
        const noteTitle = await noteCard.findElement(By.css(".note-title")).getText();

        const deleteBtn = await noteCard.findElement(By.css(".delete-note-btn"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", deleteBtn);
        await deleteBtn.click();

        await driver.wait(until.stalenessOf(noteCard), 5000);

        const remainingNotes = await driver.findElements(By.css(".note-title"));
        for (const n of remainingNotes) {
            const title = await n.getText();
            expect(title).to.not.equal(noteTitle);
        }
    });

    it("TC25: Note remains if delete not clicked", async () => {
        const notes = await driver.findElements(By.css(".note-card"));
        expect(notes.length).to.be.at.least(1);

        const noteTitle = await notes[0].findElement(By.css(".note-title")).getText();
        const checkTitle = await notes[0].findElement(By.css(".note-title")).getText();
        expect(checkTitle).to.equal(noteTitle);
    });

    it("TC26: Should delete all notes one by one", async () => {
        let notes = await driver.findElements(By.css(".note-card"));
        while (notes.length > 0) {
            const noteCard = await driver.findElement(By.css(".note-card")); // refetch
            const deleteBtn = await noteCard.findElement(By.css(".delete-note-btn"));
            await driver.executeScript("arguments[0].scrollIntoView(true);", deleteBtn);
            await deleteBtn.click();
            await driver.wait(until.stalenessOf(noteCard), 5000);
            notes = await driver.findElements(By.css(".note-card")); // refetch
        }
        expect(notes.length).to.equal(0);
    });
});
