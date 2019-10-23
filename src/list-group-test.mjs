
export async function listGroupsTest(t, provider, pattern, expected) {
  const rgs = {};

  for await (const rg of provider.repositoryGroups(pattern)) {
    rgs[rg.name] = rg;
  }

  if (expected === undefined) {
    t.is(Object.keys(rgs).length, 0);
  } else {
    for (const name of Object.keys(expected)) {
      const e = expected[name];
      const g = rgs[name];

      t.truthy(g !== undefined, name);

      for (const key of Object.keys(e)) {
        t.is(g[key], e[key], `${name}.${key}`);
      }
    }
  }
}

listGroupsTest.title = (
  providedTitle = "list groups",
  provider,
  pattern,
  expected
) =>
  `${providedTitle} '${pattern}' = ${
    expected ? Object.keys(expected) : ""
  }`.trim();
