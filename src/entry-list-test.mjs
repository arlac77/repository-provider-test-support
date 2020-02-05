export async function entryListTest(t, branch, pattern, entryFixtures) {
  t.plan(
    Object.values(entryFixtures).filter(e => e.isCollection).length +
      Object.values(entryFixtures).filter(e => e.startsWith).length * 2
  );

  for await (const entry of branch.entries(pattern)) {
    const ef = entryFixtures[entry.name];

    if (ef !== undefined) {
      if (ef.isCollection) {
        t.true(entry.isCollection);
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
        t.true(chunks.join().startsWith(ef.startsWith));
      }
    }
  }
}
