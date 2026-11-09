const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Run the real sync against fake feeds and an in-memory filesystem.
// No credentials, network calls, or production snapshots are used.
function fixture(failingFeed) {
    const files = new Map();
    const logs = [];
    const module = { exports: {} };
    const fakeFS = {
        mkdirSync() {},
        existsSync: () => true,
        statSync: () => ({ size: 100 }),
        readdirSync: dir => dir.endsWith('instagram') ? [] : ['hero-1.jpg'],
        writeFileSync: (file, data) => files.set(path.basename(file), data),
    };
    const context = {
        module,
        __dirname,
        process: { env: { API_EVENTS_URL: 'https://example.test/events', API_INSTA_URL: 'https://example.test/instagram' } },
        console: { log: (...args) => logs.push(args.join(' ')), warn() {}, error: (...args) => logs.push(args.join(' ')) },
        AbortSignal,
        require: name => name === 'fs' ? fakeFS : name === 'path' ? path : require(name),
        fetch: async url => {
            const feed = url.includes('spreadsheets') ? 'studies' : url.endsWith('events') ? 'events' : 'instagram';
            if (feed === failingFeed) return { ok: false, status: feed === 'instagram' ? 401 : 503, statusText: 'Unavailable' };
            return {
                ok: true,
                text: async () => 'start_date,end_date,title\n2026-10-01,2026-12-31,Study',
                json: async () => feed === 'events' ? { items: [] } : { data: [] },
            };
        },
    };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'sync.js'), 'utf8'), context);
    return { run: module.exports.main, files, logs };
}

test('Instagram 401 preserves posts and allows calendar, studies and photos to sync', async () => {
    const { run, files, logs } = fixture('instagram');
    assert.equal(await run(), 1);
    assert.equal(files.has('instagram.json'), false);
    for (const file of ['events.json', 'studies.json', 'heroes.json']) assert.ok(files.has(file));
    assert.ok(logs.some(line => line.includes('HTTP 401') && line.includes('API_INSTA_URL')));
});

for (const [feed, file] of [['events', 'events.json'], ['studies', 'studies.json']]) {
    test(`${feed} failure preserves its data while the other feeds still run`, async () => {
        const { run, files } = fixture(feed);
        assert.equal(await run(), 1);
        assert.equal(files.has(file), false);
        assert.ok(files.has('instagram.json'));
        assert.ok(files.has('heroes.json'));
    });
}

test('all successful feeds produce a successful run', async () => {
    const { run, files } = fixture();
    assert.equal(await run(), 0);
    assert.equal(files.size, 4);
});
