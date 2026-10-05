import assert from "node:assert/strict";
import test from "node:test";
import {
  bookingSms,
  buildConfirmMessage,
  contactNext,
  customerFilmName,
  customerPackLine,
} from "./confirm-email.ts";

test("a package with no film tier does not say COST", () => {
  assert.equal(customerFilmName(null), "");
  assert.equal(customerFilmName(undefined), "");
  assert.equal(customerPackLine("FRONT", customerFilmName(null)), "FRONT");
  assert.equal(customerPackLine("FRONT", "").includes("COST"), false);
});

test("a chosen film tier names COST or QUALITY", () => {
  assert.equal(customerFilmName("pp5"), "COST");
  assert.equal(customerFilmName("pp10"), "QUALITY");
  assert.equal(customerFilmName("pp10", "Matte"), "QUALITY · Matte");
  assert.equal(customerPackLine("FRONT", customerFilmName("pp5")), "FRONT · COST");
  assert.equal(customerPackLine("MAX", customerFilmName("pp10")), "MAX · QUALITY");
});

test("the confirmation omits an empty film row", () => {
  const empty = buildConfirmMessage({
    name: "Jesus Christ",
    contact: "call",
    vehicle: "2024 Mazda CX-5",
    packageName: "FRONT",
    filmName: "",
    totalDisplay: "$849",
    hoursLabel: "6 hours",
  });
  assert.equal(empty.html.includes(">Film<"), false);
  assert.equal(empty.text.includes("Film:"), false);
  const picked = buildConfirmMessage({
    name: "Jesus",
    vehicle: "2024 Mazda CX-5",
    packageName: "FRONT",
    filmName: "COST",
    totalDisplay: "$849",
    hoursLabel: "6 hours",
  });
  assert.equal(picked.html.includes(">Film<"), true);
  assert.match(picked.text, /Film: COST/);
});

test("the text button carries the booking body", () => {
  const href = bookingSms("Jesus", "2024 Mazda CX-5", "FRONT");
  assert.match(href, /^sms:\+15879009494\?&body=/);
  const body = decodeURIComponent(href.split("body=")[1] ?? "");
  assert.match(body, /Jesus/);
  assert.match(body, /2024 Mazda CX-5/);
  assert.match(body, /FRONT/);
  const bare = decodeURIComponent(bookingSms("Jesus", "2024 Mazda CX-5", "").split("body=")[1] ?? "");
  assert.equal(bare.includes("  "), false);
  assert.match(bare, /booking my 2024 Mazda CX-5$/);
});

test("the email only uses the shop phone and skips banned brands", () => {
  for (const contact of ["call", "text", "whatsapp", ""]) {
    const msg = buildConfirmMessage({
      name: "Jesus",
      contact,
      vehicle: "2024 Mazda CX-5",
      packageName: "FRONT",
      filmName: contact === "call" ? "COST" : "",
      totalDisplay: "$849",
      hoursLabel: "6 hours",
    });
    const both = `${msg.html}\n${msg.text}`;
    assert.match(both, /tel:\+15879009494/);
    assert.match(both, /wa\.me\/15879009494/);
    assert.equal(both.includes("(403) 827-2681"), false);
    assert.equal(both.includes("SUPER AUTOMOTIVE FILM CORPORATION"), false);
    assert.equal(both.includes("HARD PP"), false);
    assert.equal(both.includes("CARMOR"), false);
    assert.equal(both.includes("Ceramic"), false);
    assert.equal(both.includes("Carbon"), false);
    assert.equal(both.toLowerCase().includes("lock your spot"), false);
    assert.equal(both.includes("5,439"), false);
    assert.equal(both.includes("403 "), false);
    assert.equal(both.includes("14 years"), false);
    assert.equal(both.includes("g.page"), false);
    assert.equal(both.includes("We text you a time"), false);
    assert.match(msg.html, />Call</);
    assert.match(msg.html, />Text</);
    assert.match(msg.html, />WhatsApp</);
    assert.match(msg.text, new RegExp(contactNext(contact).step.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("step one follows the contact method", () => {
  assert.match(contactNext("call").step, /We call you\. If we miss you, we follow up by text\./);
  assert.match(contactNext("").step, /We call you\. If we miss you, we follow up by text\./);
  assert.match(contactNext("text").step, /We text you\. If we don't hear back, we give you a call\./);
  assert.match(contactNext("whatsapp").step, /We message you on WhatsApp\. If we don't hear back, we give you a call\./);
  assert.match(contactNext("call").preheader, /We'll call you to set your drop-off\./);
  assert.match(contactNext("text").preheader, /We'll text you to set your drop-off\./);
  assert.match(contactNext("whatsapp").preheader, /We'll message you on WhatsApp to set your drop-off\./);
});

test("the subject uses the vehicle and the total", () => {
  const msg = buildConfirmMessage({
    name: "Jesus",
    vehicle: "2024 Mazda CX-5",
    packageName: "FRONT",
    totalDisplay: "$849",
    hoursLabel: "6 hours",
  });
  assert.equal(msg.subject, "Your 2024 Mazda CX-5 estimate: $849");
  assert.match(msg.html, /Got it, Jesus\./);
  assert.equal(msg.html.length > 0, true);
  assert.equal(msg.text.length > 0, true);
  const fallback = buildConfirmMessage({ name: "" });
  assert.equal(fallback.subject, "We received your SUPERAF estimate");
  assert.match(fallback.html, /Got it, there\./);
});
