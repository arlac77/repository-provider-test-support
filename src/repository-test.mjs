export async function repositoryEqualityTest(t, p1, rn1, rn2) {
  const r1 = await p1.createRepository(rn1);
  t.false(r1.equals(undefined));
  t.true(r1.equals(r1));

  const r2 = await p1.createRepository(rn2);
  t.false(r1.equals(r2));
}

repositoryEqualityTest.title = (
  providedTitle = "repository equality",
  provider
) => `${providedTitle} ${provider.name}`.trim();

export async function repositoryLivecycleTest(
  t,
  provider,
  repoName = "test-repo-1",
  groupName
) {
  const group = await provider.repositoryGroup(groupName);

  t.log("group found");

  let repo = await group.repository(repoName);
  if (repo) {
    await repo.delete();
  }

  t.log("repo cleared");

  repo = await group.createRepository(repoName, {
    description: "a description",
    auto_init: true
  });

  t.log("repo created");

  t.is(repo.name, repoName);
  t.is(repo.description, "a description");

  try {
    await repo.delete();
  } catch (e) {
    t.log(e);
  }
}
