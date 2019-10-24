export async function providerTest(t, provider) {
  t.is(provider.provider, provider, "be our own provider");
  t.truthy(provider.name, "has a name");

  const group = await provider.group();
  t.is(group, undefined, "undefined group");

  const repository = await provider.repository();
  t.is(repository, undefined, "undefined repository");

  const branch = await provider.branch();
  t.is(branch, undefined, "undefined branch");
}

providerTest.title = (providedTitle = "provider", provider) =>
  `${providedTitle} ${provider.name}`.trim();
