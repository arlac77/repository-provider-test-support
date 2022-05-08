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
) => `${providedTitle} ${provider ? provider.name : "undefined"}`.trim();

export async function repositoryLivecycleTest(
  t,
  provider,
  repoName = "test-repo-1",
  groupName,
  options,
  assert = async (t, repository) => {}
) {
  t.truthy(provider, "provider is present");

  const group = await provider.repositoryGroup(groupName);
  t.truthy(group, "group found");

  let repo = await group.repository(repoName);
  if (repo) {
    await repo.delete();
    t.log("repo cleared");
  }

  repo = await group.createRepository(repoName, options);

  t.truthy(repo, "repo created");

  t.is(repo.name, repoName, "repository name");

  await assert(t, repo);

  try {
    await repo.delete();
  } catch (e) {
    t.log(e);
  }
}
