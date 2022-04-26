import { StringContentEntry } from "content-entry";
import { generateBranchName } from "./util.mjs";

export async function pullRequestLivecycle(t, provider, repoName) {
  t.truthy(provider, "provider present");

  const repository = await provider.repository(repoName);
  t.truthy(repository, `repsitory present ${repoName}`);

  const name = await generateBranchName(repository, "pr-test/*");

  const destination = await repository.defaultBranch;
  const source = await destination.createBranch(name);

  const commit = await source.commit("message text", [
    new StringContentEntry("README.md", `file content #${name}`)
  ]);

  const pr = await repository.pullRequestClass.open(source, destination, {
    title: `test pr from ${name}`,
    body: "this is the body\n- a\n- b\n- c"
  });

  t.is(pr.source, source, "pull request source");
  t.is(pr.destination, destination, "pull request destination");
  t.true(pr.number !== undefined, "pull request number");

  t.is(pr.title, `test pr from ${name}`, "pull request title");
  t.is(pr.body, "this is the body\n- a\n- b\n- c", "pull request body");
  t.is(pr.state, "OPEN", "pull request state");
  t.is(pr.locked, false, "pull request locked");
  t.is(pr.merged, false, "pull request merged");

  let foundInList = false;

  for await (const p of repository.pullRequestClass.list(repository, {
    source,
    destination
  })) {
    if (pr.equals(p)) {
      foundInList = true;
    }
    //console.log("LIST", p, p.title, pr.number, p.number, pr.equals(p));
  }

  t.true(foundInList, "pr found in list");

  const pr2 = await repository.pullRequestClass.open(source, destination, {
    title: `test pr from ${name}`,
    body: "this is the body\n- a\n- b\n- c"
  });

  t.truthy(pr2, "can open pr again");
  t.true(pr2.equals(pr));

  await pr.decline();
  await source.delete();
}

export async function pullRequestList(t, provider, repoName) {
  t.truthy(provider, "provider present");

  const repository = await provider.repository(repoName);
  t.truthy(repository, `repsitory present ${repoName}`);
  
  const destination = await repository.defaultBranch;

  const sources = await Promise.all(
    ["pr-test/source-1", "pr-test/source-2"].map(async bn => {
      const branch = await repository.createBranch(bn);
      const commit = await branch.commit("message text", [
        new StringContentEntry("README.md", `file content #${bn}`)
      ]);

      const pr = await repository.pullRequestClass.open(branch, destination, {
        title: `test pr from ${bn}`,
        body: "this is the body\n- a\n- b\n- c"
      });

      return branch;
    })
  );

  let numberOfSources = 0;

  for await (const pr of repository.pullRequestClass.list(repository, {
    source: sources[0]
  })) {
    t.is(pr.source, sources[0], "source");
    t.is(pr.destination, destination, `destination: ${destination.fullName}`);
    t.is(pr.title, "test pr from pr-test/source-1", "title");
    t.false(pr.locked, "locked");

    numberOfSources++;
  }

  t.is(numberOfSources, 1);

  const prs = [];

  for await (const pr of repository.pullRequestClass.list(repository)) {
    prs.push(pr);
  }

  t.true(prs.length >= 2);
}
