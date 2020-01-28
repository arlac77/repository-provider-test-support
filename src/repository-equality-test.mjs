export async function repositoryEqualityTest(t, p1, rn1, rn2) {
    const r1 = await p1.createRepository(rn1);
    t.false(r1.equal(undefined));
    t.true(r1.equal(r1));

    const r2 = await p1.createRepository(rn2);
    t.false(r1.equal(r2));
}

repositoryEqualityTest.title = (providedTitle = "repository equality", provider) =>
  `${providedTitle} ${provider.name}`.trim();
