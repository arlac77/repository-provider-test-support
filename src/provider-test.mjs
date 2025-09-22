export async function providerTest(t, provider) {
  t.is(provider.provider, provider, "be our own provider");
  t.truthy(provider.name, "has a name");
  t.truthy(provider.fullName, `${provider.name} has a fullName`);
  t.truthy(provider.url, `${provider.name} has a url`);

  const repository = await provider.repository();
  t.is(repository, undefined, "undefined repository");

  const branch = await provider.branch();
  t.is(branch, undefined, "undefined branch");
}

providerTest.title = (providedTitle = "provider", provider) =>
  `${providedTitle} ${provider ? provider.name : "undefined"}`.trim();

export async function providerParseNameTest(t, provider, fixtures) {
  for (const [name, repo] of Object.entries(fixtures)) {
    t.deepEqual(provider.parseName(name), repo, name);
  }
}
providerParseNameTest.title = (providedTitle = "provider name", provider) =>
  `${providedTitle} ${provider ? provider.name : "undefined"}`.trim();

