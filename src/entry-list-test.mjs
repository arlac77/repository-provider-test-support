export async function entryListTest(t, branch, pattern, entryFixtures) {
  t.plan(
    Object.values(entryFixtures).filter(e => e.isCollection).length +
      Object.values(entryFixtures).filter(e => e.notPresent).length +
      Object.values(entryFixtures).filter(e => e.startsWith).length * 2
  );

  const found = new Map();

  for await (const entry of branch.entries(pattern)) {
    found.set(entry.name, entry);

    const ef = entryFixtures[entry.name];

    if (ef !== undefined) {
      if (ef.isCollection) {
        t.true(entry.isCollection, `isCollection '${entry.name}'`);
      } else {
        t.true(
          (await entry.getString()).startsWith(ef.startsWith),
          `${entry.name} '${ef.startsWith}'`
        );

        const stream = await entry.getReadStream();
        const chunks = [];
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        t.true(
          chunks.join().startsWith(ef.startsWith),
          `startsWith '${entry.name}'`
        );
      }
    }
  }

  for (const [name, ef] of Object.entries(entryFixtures)) {
    if (ef.notPresent) {
      t.falsy(found.get(name), `no entry ${name}`);
    }
  }
}
