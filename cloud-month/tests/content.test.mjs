import assert from "node:assert/strict";
import test from "node:test";
import { days, weeks } from "../src/days.js";
import { glossary, outcomes, quiz } from "../src/reference.js";
import { skills } from "../src/skills.js";

test("nine skills each keep five real resources", () => {
  assert.equal(skills.length, 9);
  for (const skill of skills) {
    assert.equal(skill.resources.length, 5, skill.id);
    assert.ok(skill.focus.length >= 4, skill.id);
    assert.ok(skill.later.length >= 2, skill.id);
    const modes = new Set(skill.resources.map((item) => item.mode));
    assert.ok(modes.has("亲手做"), skill.id);
    for (const resource of skill.resources) {
      assert.match(resource.url, /^https:\/\//, resource.name);
      assert.ok(resource.points.length >= 3, resource.name);
      assert.ok(resource.why.length > 12, resource.name);
    }
  }
});

test("thirty days cover four weeks and known skills", () => {
  assert.equal(days.length, 30);
  assert.equal(weeks.length, 4);
  const ids = new Set(skills.map((skill) => skill.id));
  const numbers = days.map((day) => day.n);
  assert.deepEqual(numbers, [...Array(30)].map((_, index) => index + 1));
  for (const day of days) {
    assert.ok(ids.has(day.skill), day.title);
    assert.ok(day.steps.length >= 3, day.title);
    assert.ok(day.minutes >= 45 && day.minutes <= 90, day.title);
  }
  for (const skill of skills) {
    assert.ok(days.some((day) => day.skill === skill.id), skill.id);
  }
});

test("quiz and glossary stay internally consistent", () => {
  assert.equal(quiz.length, 6);
  assert.equal(outcomes.length, 8);
  assert.ok(glossary.length >= 12);
  for (const item of quiz) {
    assert.ok(item.answer >= 0 && item.answer < item.choices.length);
    assert.equal(new Set(item.choices).size, item.choices.length);
  }
});
