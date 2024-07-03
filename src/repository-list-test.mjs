export async function repositoryListTest(t, provider, pattern, expected) {
  t.truthy(provider, "provider present");

  const rs = {};

  for await (const r of provider.repositories(pattern)) {
    rs[r.fullName] = r;
  }

  switch (typeof expected) {
    case "number": {
      const length = Object.keys(rs).length;

      t.truthy(
        expected <= length,
        `expected at least ${expected} but got only ${length} entries for ${pattern}`
      );
      return;
    }
    case "undefined":
      t.is(
        Object.keys(rs).length,
        0,
        `there should not by any repository for \"${pattern}\"`
      );
      break;
    default:
      for (const [name, e] of Object.entries(expected)) {
        const r = rs[name];

        t.truthy(
          r !== undefined,
          `missing expected repository ${name} in (${Object.keys(rs)})`
        );

        for (const key of Object.keys(e)) {
          t.is(r[key], e[key], `${name}.${key}`);
        }
      }
  }
}

repositoryListTest.title = (
  providedTitle = "repository list",
  provider,
  pattern,
  expected
) =>
  `${providedTitle} ${JSON.stringify(pattern)} ${
    typeof expected === "number"
      ? ">=#" + expected
      : expected
      ? "[" + Object.keys(expected) + "]"
      : "not present"
  }`.trim();
