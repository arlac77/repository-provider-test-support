export async function groupListTest(
  t,
  provider,
  pattern,
  expected,
  withProviderName = false
) {
  const rgs = {};

  for await (const rg of provider.repositoryGroups(pattern)) {
    rgs[withProviderName ? rg.provider.name + "/" + rg.name : rg.name] = rg;
  }

  if (typeof expected === "number") {
    t.truthy(
      expected == Object.keys(rgs).length,
      `expected at least ${expected} but got ${
        Object.keys(rgs).length
      } entries for ${pattern}`
    );
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
  `${provider.name} ${providedTitle} '${pattern}' = ${
    typeof expected === "number"
      ? "#" + expected
      : expected
      ? "[" + Object.keys(expected) + "]"
      : "not present"
  }`.trim();

export async function groupTest(t, provider, name, expected) {
  const normalizedName = provider.normalizeGroupName(name, true);
  const rg = await provider.repositoryGroup(normalizedName);

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
