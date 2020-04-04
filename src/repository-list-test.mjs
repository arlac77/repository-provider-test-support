
export async function repositoryListTest(t, provider, pattern, expected) {
  const rs = {};

  for await (const r of provider.repositories(pattern)) {
    rs[r.name] = r;
  }

  if(typeof expected === 'number') {
    t.truthy(expected < Object.keys(rs).length, `expected at least ${expected} but got only ${Object.keys(rs).length} entries for ${pattern}`);
    return;
  }

  if (expected === undefined) {
    t.is(Object.keys(rs).length, 0, `there should not by any repository for ${pattern}`);
  } else {
    for (const [name,e] of Object.entries(expected)) {
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
  `${providedTitle} '${pattern}' ${
    typeof expected === 'number' ? ">#" + expected : expected ? "("+Object.keys(expected)+')' : "none"
  }`.trim();
