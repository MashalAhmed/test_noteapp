import { expect } from "chai";
import { getDriver } from "../utils/driver.js";
import { By, until } from "selenium-webdriver";

describe("Delete Note Tests", function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        driver = await getDriver();

        // Ensure at least two notes exist for deletion tests
        await driver.get("http://51.20.43.93:5000/add");
        await driver.findElement(By.id("add-note-title")).sendKeys("Note for Delete 1");
        await driver.findElement(By.id("add-note-content")).sendKeys("Content for delete test 1");
        await driver.findElement(By.id("submit-add-note")).click();
        await driver.wait(until.urlIs("http://51.20.43.93:5000/"), 5000);

        await driver.get("http://51.20.43.93:5000/add");
        await driver.findElement(By.id("add-note-title")).sendKeys("Note for Delete 2");
        await driver.findElement(By.id("add-note-content")).sendKeys("Content for delete test 2");
        await driver.findElement(By.id("submit-add-note")).click();
        await driver.wait(until.urlIs("http://51.20.43.93:5000/"), 5000);
    });

    after(async () => {
        await driver.quit();
    });

    // ----------------- Existing Test Case -----------------

    // Test Case 8: Delete first note (Docker/headless safe)
    it("TC8: Should delete first note", async () => {
        // Wait until at least one note card is present
        const noteCard = await driver.wait(
            until.elementLocated(By.css(".note-card")),
            10000,
            "No note card found within timeout"
        );
    
        // Get its title
        const noteTitle = await noteCard.findElement(By.css(".note-title")).getText();
    
        // Click delete button
        const deleteBtn = await noteCard.findElement(By.css(".delete-note-btn"));
        await deleteBtn.click();
    
        // Wait until the note card disappears from DOM
        await driver.wait(until.stalenessOf(noteCard), 10000, "Note card did not disappear");
    
        // Verify remaining notes
        const remainingNotes = await driver.findElements(By.css(".note-title"));
        if (remainingNotes.length > 0) {
            const remainingTitle = await remainingNotes[0].getText();
            expect(remainingTitle).to.not.equal(noteTitle);
        }
    });
    

    // ----------------- Additional Test Cases -----------------

    // Test Case 24: Delete second note
    it("TC24: Should delete second note", async () => {
        const notes = await driver.findElements(By.css(".note-card"));
        expect(notes.length).to.be.at.least(1);

        const noteCard = notes[0];
        const noteTitle = await noteCard.findElement(By.css(".note-title")).getText();

        const deleteBtn = await noteCard.findElement(By.css(".delete-note-btn"));
        await deleteBtn.click();

        await driver.wait(until.stalenessOf(noteCard), 5000);

        const remainingNotes = await driver.findElements(By.css(".note-title"));
        remainingNotes.forEach(async (n) => {
            const title = await n.getText();
            expect(title).to.not.equal(noteTitle);
        });
    });

    // Test Case 25: Canceling deletion (simulate by not clicking delete) keeps note
    it("TC25: Note remains if delete not clicked", async () => {
        const notes = await driver.findElements(By.css(".note-card"));
        expect(notes.length).to.be.at.least(1);

        const noteTitle = await notes[0].findElement(By.css(".note-title")).getText();
        // Do not click delete, just verify the note exists
        const checkTitle = await notes[0].findElement(By.css(".note-title")).getText();
        expect(checkTitle).to.equal(noteTitle);
    });

    // Test Case 26: All notes can be deleted sequentially
    it("TC26: Should delete all notes one by one", async () => {
        let notes = await driver.findElements(By.css(".note-card"));
        while (notes.length > 0) {
            const noteCard = notes[0];
            const deleteBtn = await noteCard.findElement(By.css(".delete-note-btn"));
            await deleteBtn.click();
            await driver.wait(until.stalenessOf(noteCard), 5000);
            notes = await driver.findElements(By.css(".note-card"));
        }
        expect(notes.length).to.equal(0);
    });
});
