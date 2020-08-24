import test from "ava";
import { Branch } from "repository-provider";
import { assertBranch } from "repository-provider-test-support";

test("simple", t => {
  const branch = new Branch({ _addBranch: () => {} }, "b1");

  assertBranch(t, branch, {});

  t.pass();
});
