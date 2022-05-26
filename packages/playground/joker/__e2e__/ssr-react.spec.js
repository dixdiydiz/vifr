test('root page', async () => {
  await page.goto('./')
  expect(await page.textContent('h1')).toMatch('default message here')
})

// test('client navigation', async () => {
//   await untilUpdated(() => page.textContent('a[href="/about"]'), 'About')
//   await page.click('a[href="/about"]')
//   await untilUpdated(() => page.textContent('h1'), 'About')
//   editFile('src/pages/About.jsx', (code) =>
//     code.replace('<h1>About', '<h1>changed')
//   )
//   await untilUpdated(() => page.textContent('h1'), 'changed')
// })

// test(`circular dependecies modules doesn't throw`, async () => {
//   await page.goto(url)
//   expect(await page.textContent('.circ-dep-init')).toMatch(
//     'circ-dep-init-a circ-dep-init-b'
//   )
// })
