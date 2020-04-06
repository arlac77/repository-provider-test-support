export async function groupListTest(t, provider, pattern, expected) {
  const rgs = {};

  for await (const rg of provider.repositoryGroups(pattern)) {
    rgs[rg.name] = rg;
  }

  if(typeof expected === 'number') {
    t.truthy(expected == Object.keys(rgs).length, `expected at least ${expected} but got ${Object.keys(rgs).length} entries for ${pattern}`);
    return;
  }

  if (expected === undefined) {
    t.is(Object.keys(rgs).length, 0);
  } else {
    for (const [name, e] of Object.entries(expected)) {
      const g = rgs[name];

      t.truthy(
        g !== undefined,
        `missing expected group ${name} in (${Object.keys(rgs)})`
      );

      for (const [key, ee] of Object.entries(e)) {
        t.is(g[key], ee, `${name}.${key}`);
      }
    }
  }
}

groupListTest.title = (
  providedTitle = "group list",
  provider,
  pattern,
  expected
) =>
  `${providedTitle} '${pattern}' = ${
    typeof expected === 'number' ? "#" + expected : expected ? "["+Object.keys(expected)+']' : "not present"
  }`.trim();


export async function groupTest(t, provider, name, expected) {
  const rg = await provider.repositoryGroup(name);

  if (expected === undefined) {
    t.is(rg, undefined);
  } else {
      for (const [key, value] of Object.entries(expected)) {
        t.is(rg[key], value, `${key}`);
      }
  }
}

groupTest.title = (providedTitle = "group", provider, name, expected) =>
  `${providedTitle} '${name}' = ${
    expected ? Object.keys(expected) : ""
  }`.trim();
