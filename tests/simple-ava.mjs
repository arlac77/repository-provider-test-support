import test from "ava";
import { Branch } from "repository-provider";
import { StringContentEntry } from "content-entry";
import { assertBranch, entryListTest } from "repository-provider-test-support";

test("assertBranch", t => {
  const branch = new Branch({ _addBranch: () => {} }, "b1");

  assertBranch(t, branch, {});

  t.pass();
});

test("entryListTest", t => {
  const branch = new Branch({ _addBranch: () => {} }, "b1");

  async function* entries(pattern) {
    yield new StringContentEntry("a.txt", "line1");
  }

  branch.entries = entries;

  entryListTest(t, branch, "**/*", { "a.txt": {} });
});
