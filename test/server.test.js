const {test, before, after} = require('node:test');
const assert = require('node:assert/strict');
const {server} = require('../server');
let base;
before(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = 'http://127.0.0.1:' + server.address().port;
});
after(() => new Promise(resolve => server.close(resolve)));
test('serves the arcade and its assets', async () => {
  for (const route of ['/', '/style.css', '/app.js', '/sports.js']) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200);
    assert.ok((await response.text()).length > 0);
  }
  assert.equal((await fetch(base + '/missing')).status, 404);
});
test('online room endpoints are removed', async () => {
  for (const route of ['create', 'join', 'move', 'reset', 'events']) {
    assert.equal((await fetch(base + '/api/' + route, {method: route === 'events' ? 'GET' : 'POST'})).status, 404);
  }
});
