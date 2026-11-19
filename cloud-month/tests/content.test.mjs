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

test("hands-on cloud is Azure and the pipeline is Jenkins", () => {
  const cloud = skills.find((skill) => skill.id === "cloud");
  const cicd = skills.find((skill) => skill.id === "cicd");
  const handsOn = (skill) => skill.resources.filter((item) => item.mode === "亲手做").map((item) => item.name);
  assert.ok(handsOn(cloud).every((name) => name.includes("Azure") || name.includes("描述云概念")));
  assert.equal(handsOn(cicd).join(" "), "Jenkins Pipeline 入门");
  assert.match(cloud.practice, /Microsoft Learn/);
  assert.doesNotMatch(cloud.practice, /AWS 官方/);
  assert.match(cicd.practice, /Jenkinsfile/);
  assert.doesNotMatch(cicd.practice, /GitHub Actions/);
  assert.match(days.find((day) => day.n === 22).steps[0], /Jenkins/);
  assert.match(days.find((day) => day.n === 12).steps[0], /Azure/);
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
