import { generateBranchName } from "repository-provider";
import { StringContentEntry } from "content-entry";

export async function pullRequestLivecycle(t, provider, repoName) {
    const repository = await provider.repository(repoName);
  
    const name = await generateBranchName(repository, "pr-test/*");
  
    const destination = await repository.defaultBranch;
    const source = await destination.createBranch(name);
  
    const commit = await source.commit("message text", [
      new StringContentEntry("README.md", `file content #${name}`)
    ]);
  
    const pr = await provider.pullRequestClass.open(source, destination, {
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
  
    for await (const p of provider.pullRequestClass.list(repository)) {
      console.log("LIST", p, p.title, pr.number, p.number, pr.equals(p));
    }
  
    //await pr.decline();
    await source.delete();
  }
  
  