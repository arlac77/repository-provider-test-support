
export async function repositoryListTest(t, provider, pattern, expected) {
  const rs = {};

  for await (const r of provider.repositories(pattern)) {
    rs[r.name] = r;
  }

  if (expected === undefined) {
    t.is(Object.keys(rs).length, 0);
  } else {
    for (const name of Object.keys(expected)) {
      const e = expected[name];
      const r = rs[name];

      t.truthy(r !== undefined, `missing expected repository ${name} in (${Object.keys(rs)})`);

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
  `${providedTitle} '${pattern}' = ${
    expected ? Object.keys(expected) : ""
  }`.trim();
