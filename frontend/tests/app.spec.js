import { test, expect } from '@playwright/test'

// Synthetic responses exist only in browser tests; application requests use the real API.
const employee = {
  id: 1,
  employeeCode: 'TEST001',
  surname: 'Test',
  givenName: 'Employee',
  departmentId: 2,
  organizationUnitId: 3,
  positionTitle: 'Quality engineer',
  status: 'ACTIVE',
}
const tree = [
  {
    id: 1,
    name: 'Test corporation',
    departments: [
      {
        id: 2,
        name: 'Operations',
        organizationUnits: [
          {
            id: 3,
            name: 'Assembly',
            unitType: 'TEAM',
            children: [{ id: 4, name: 'Evening shift', children: [] }],
          },
        ],
      },
    ],
  },
]

async function setup(page, role = 'ADMIN', authenticated = true) {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  const session = {
    token: `test.${Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`,
    userId: 'test-user',
    role,
    employeeId: null,
  }
  if (authenticated)
    await page.addInitScript(
      (session) => localStorage.setItem('ems.session', JSON.stringify(session)),
      session,
    )
  const requests = []
  const records = {
    'personal-info': null,
    'labor-contracts': [],
    'family-members': [],
    allowances: [],
  }
  await page.route(/\/api\/(?!apiClient\.js)/, async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const path = url.pathname
    requests.push({
      path,
      search: url.search,
      method: request.method(),
      body: request.postData(),
      authorization: request.headers().authorization,
    })
    const json = (data) => route.fulfill({ json: data })
    if (path === '/api/auth/login') return json(session)
    if (path === '/api/organization-tree') return json(tree)
    if (path === '/api/corporations')
      return json([{ id: 1, name: 'Test corporation' }])
    if (path === '/api/departments/corporation/1')
      return json([{ id: 2, name: 'Operations' }])
    if (path === '/api/organization-units/department/2')
      return json([{ id: 3, name: 'Assembly', unitType: 'TEAM' }])
    if (path === '/api/users')
      return json({
        ...JSON.parse(request.postData()),
        password: undefined,
        id: 10,
      })
    if (path === '/api/employees/1/photo')
      return json({ photoUrl: '/uploads/test.png' })
    const section = path.match(
      /^\/api\/employees\/1\/(personal-info|labor-contracts|family-members|allowances)(?:\/\d+)?$/,
    )?.[1]
    if (section) {
      if (request.method() !== 'GET') {
        const value = { ...JSON.parse(request.postData()), id: 10 }
        if (section === 'personal-info') records[section] = value
        else if (request.method() === 'PUT') records[section] = [value]
        else records[section].unshift(value)
        return json(value)
      }
      if (records[section] === null)
        return route.fulfill({ status: 404, json: {} })
      return json(records[section])
    }
    if (
      path === '/api/employees/1' ||
      (path === '/api/employees' && request.method() === 'POST')
    )
      return json({
        ...employee,
        ...(request.postData() ? JSON.parse(request.postData()) : {}),
      })
    if (path.startsWith('/api/employees')) return json([employee])
    return route.fulfill({ status: 404, json: {} })
  })
  return { requests, errors }
}

test('login, protected routing, logout and no password persistence', async ({
  page,
}) => {
  const { requests, errors } = await setup(page, 'ADMIN', false)
  await page.goto('/employees')
  await expect(page).toHaveURL(/\/login$/)
  await expect(
    page.getByRole('heading', { name: 'Employee Management System' }),
  ).toBeVisible()
  await page.getByLabel('User ID').fill('test-user')
  await page.getByLabel('Password', { exact: true }).fill('test-only-input')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page).toHaveURL(/\/employees$/)
  await expect(page.getByRole('link', { name: 'Test Employee' })).toBeVisible()
  expect(
    await page.evaluate(() => localStorage.getItem('ems.session')),
  ).not.toContain('test-only-input')
  expect(
    requests
      .filter((r) => r.path !== '/api/auth/login')
      .every((r) => r.authorization?.startsWith('Bearer ')),
  ).toBe(true)
  await page
    .getByRole('button', { name: 'Sign out', exact: true })
    .first()
    .click()
  await expect(page).toHaveURL(/\/login$/)
  expect(
    await page.evaluate(() => localStorage.getItem('ems.session')),
  ).toBeNull()
  expect(errors).toEqual([])
})

for (const role of ['ADMIN', 'HR', 'VIEWER']) {
  test(`${role} permissions, profile tabs and direct route protection`, async ({
    page,
  }) => {
    const { requests, errors } = await setup(page, role)
    await page.goto('/employees')
    await expect(
      page.getByRole('link', { name: 'Test Employee' }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'Add employee' })).toHaveCount(
      role === 'VIEWER' ? 0 : 1,
    )
    await expect(
      page.getByRole('link', { name: 'User Management' }),
    ).toHaveCount(role === 'ADMIN' ? 1 : 0)
    await page.getByRole('link', { name: 'Test Employee' }).click()
    await expect(
      page.getByRole('heading', { name: 'Test Employee' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Delete', exact: true }),
    ).toHaveCount(role === 'ADMIN' ? 1 : 0)
    await expect(page.getByRole('link', { name: 'Edit employee' })).toHaveCount(
      role === 'VIEWER' ? 0 : 1,
    )
    for (const tab of [
      'Personal Info',
      'Labor Contract',
      'Family Info',
      'Allowances',
    ]) {
      await page.getByRole('tab', { name: tab, exact: true }).click()
      await expect(
        page.getByRole('tabpanel', { name: tab, exact: true }),
      ).toContainText('No ')
      if (role === 'VIEWER')
        await expect(page.getByRole('button', { name: /^Add / })).toHaveCount(0)
    }
    const before = requests.filter((r) =>
      r.path.endsWith('/personal-info'),
    ).length
    await page.getByRole('tab', { name: 'Personal Info', exact: true }).click()
    expect(
      requests.filter((r) => r.path.endsWith('/personal-info')).length,
    ).toBe(before)
    if (role !== 'ADMIN') {
      await page.goto('/users')
      await expect(page).toHaveURL(/\/employees$/)
    }
    if (role === 'VIEWER') {
      for (const path of ['/employees/new', '/employees/1/edit']) {
        await page.goto(path)
        await expect(page).toHaveURL(/\/employees$/)
      }
    }
    expect(errors).toEqual([])
  })
}

test('search and exact organization filtering use API endpoints', async ({
  page,
}) => {
  const { requests } = await setup(page)
  await page.goto('/employees')
  await page.getByLabel('Search employees').fill('Test')
  await expect
    .poll(() =>
      requests.some(
        (r) =>
          r.path === '/api/employees/search' &&
          r.search.includes('keyword=Test'),
      ),
    )
    .toBe(true)
  await page.getByRole('button', { name: 'Assembly', exact: true }).click()
  await expect
    .poll(() =>
      requests.some((r) => r.path === '/api/employees/organization-unit/3'),
    )
    .toBe(true)
  await expect(page.getByRole('link', { name: 'Test Employee' })).toBeVisible()
})

test('employee create and edit preserve immutable code and selected organization', async ({
  page,
}) => {
  const { requests, errors } = await setup(page)
  await page.goto('/employees/new')
  await page.getByLabel('Corporation').selectOption('1')
  await page.getByLabel('Department').selectOption('2')
  await page.getByLabel('Organization unit', { exact: true }).selectOption('3')
  await page.getByLabel('Employee code').fill('TEST002')
  await page.getByLabel('Surname').fill('Test')
  await page.getByLabel('Given name').fill('New')
  await page.getByRole('button', { name: 'Save employee' }).click()
  await expect(page).toHaveURL(/\/employees\/1$/)
  const create = JSON.parse(
    requests.find((r) => r.path === '/api/employees' && r.method === 'POST')
      .body,
  )
  expect(create.departmentId).toBe(2)
  expect(create.organizationUnitId).toBe(3)
  await page.goto('/employees/1/edit')
  await expect(page.getByLabel('Employee code')).toBeDisabled()
  await expect(page.getByLabel('Department')).toHaveValue('2')
  await expect(
    page.getByLabel('Organization unit', { exact: true }),
  ).toHaveValue('3')
  await page.getByLabel('Position title').fill('Supervisor')
  await page.getByRole('button', { name: 'Save employee' }).click()
  await expect(page).toHaveURL(/\/employees\/1$/)
  const update = JSON.parse(
    requests.find((r) => r.path === '/api/employees/1' && r.method === 'PUT')
      .body,
  )
  expect(update).not.toHaveProperty('employeeCode')
  expect(update.positionTitle).toBe('Supervisor')
  expect(errors).toEqual([])
})

test('profile sections create, edit and retain saved information', async ({
  page,
}) => {
  const { requests, errors } = await setup(page)
  await page.goto('/employees/1')
  const cases = [
    [
      'Personal Info',
      'Personal Info',
      { Email: 'test@example.invalid' },
      'personal-info',
    ],
    [
      'Labor Contract',
      'Contract',
      {
        'Contract number': 'TEST-CONTRACT',
        'Contract type': 'FIXED_TERM',
        'Start date': '2026-01-01',
        'Basic salary': '13000000',
      },
      'labor-contracts',
    ],
    [
      'Family Info',
      'Family member',
      { 'Full name': 'Test Relative', Relationship: 'SPOUSE' },
      'family-members',
    ],
    [
      'Allowances',
      'Allowance',
      {
        'Allowance type': 'TRANSPORT',
        Amount: '700000',
        'Effective from': '2026-01-01',
      },
      'allowances',
    ],
  ]
  for (const [tab, singular, fields, endpoint] of cases) {
    await page.getByRole('tab', { name: tab, exact: true }).click()
    await page
      .getByRole('button', { name: `Add ${singular}`, exact: true })
      .click()
    const dialog = page.getByRole('dialog')
    for (const [label, value] of Object.entries(fields))
      await dialog.getByLabel(label, { exact: false }).fill(value)
    await dialog.getByRole('button', { name: 'Save changes' }).click()
    await expect(dialog).toHaveCount(0)
    await expect(
      page.getByRole('tabpanel', { name: tab, exact: true }),
    ).toContainText('saved successfully')
    await page.getByRole('button', { name: 'Edit', exact: true }).click()
    await dialog.getByRole('button', { name: 'Save changes' }).click()
    await expect(dialog).toHaveCount(0)
    expect(
      requests.some((r) => r.path.includes(endpoint) && r.method === 'PUT'),
    ).toBe(true)
  }
  expect(errors).toEqual([])
})

test('admin creates users and confirms soft deletion', async ({ page }) => {
  const { requests, errors } = await setup(page)
  await page.goto('/users')
  await page.getByLabel('User ID').fill('new-test-user')
  await page.getByLabel('Password').fill('test-only-password')
  await page.getByLabel('Role').selectOption('HR')
  await page.getByRole('button', { name: 'Create user' }).click()
  await expect(page.getByRole('status')).toContainText(
    'created with the HR role',
  )
  await expect(page.getByLabel('Password')).toHaveValue('')
  await page.goto('/employees/1')
  await page.getByRole('button', { name: 'Delete', exact: true }).click()
  expect(requests.some((r) => r.method === 'DELETE')).toBe(false)
  await page.getByRole('button', { name: 'Confirm delete' }).click()
  await expect(page).toHaveURL(/\/employees$/)
  expect(
    requests.some(
      (r) => r.method === 'DELETE' && r.path === '/api/employees/1',
    ),
  ).toBe(true)
  expect(errors).toEqual([])
})

for (const width of [390, 768, 1440]) {
  test(`responsive navigation and forms at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const { errors } = await setup(page)
    await page.goto('/employees')
    await expect(
      page.getByRole('link', { name: 'Test Employee' }),
    ).toBeVisible()
    if (width < 992) {
      await page.getByRole('button', { name: 'Open navigation' }).click()
      await expect(
        page.getByRole('link', { name: 'Organization', exact: true }),
      ).toBeVisible()
      await page
        .getByRole('link', { name: 'Organization', exact: true })
        .click()
      await expect(page).toHaveURL(/\/organization$/)
      await expect(page.locator('.offcanvas-backdrop')).toHaveCount(0)
    }
    await page.goto('/employees/new')
    await expect(page.getByLabel('Surname')).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)
    await page.screenshot({
      path: `test-results/form-${width}.png`,
      fullPage: true,
    })
    expect(errors).toEqual([])
  })
}

test('authorization errors and expired sessions are readable', async ({
  page,
}) => {
  await setup(page)
  await page.route('**/api/employees', (route) =>
    route.fulfill({ status: 403, json: { trace: 'private stack trace' } }),
  )
  await page.goto('/employees')
  await expect(page.getByRole('alert')).toContainText('permission')
  await expect(page.locator('body')).not.toContainText('private stack trace')
  await page.route('**/api/employees', (route) =>
    route.fulfill({ status: 401, json: {} }),
  )
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('status')).toContainText('expired')
})

test('photo upload validates format and loads the returned image with authorization', async ({
  page,
}) => {
  const { requests, errors } = await setup(page)
  let photoAuthorization
  await page.route('**/uploads/test.png', (route) => {
    photoAuthorization = route.request().headers().authorization
    return route.fulfill({
      contentType: 'image/png',
      body: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=',
        'base64',
      ),
    })
  })
  await page.goto('/employees/1')
  const input = page.getByLabel('Upload employee photo')
  await input.setInputFiles({
    name: 'invalid.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('test'),
  })
  await expect(page.getByRole('alert')).toContainText('JPG, PNG, or WEBP')
  expect(requests.some((r) => r.path.endsWith('/photo'))).toBe(false)
  await input.setInputFiles({
    name: 'test.png',
    mimeType: 'image/png',
    buffer: Buffer.from('test-image'),
  })
  await expect(page.getByRole('status')).toContainText('photo updated')
  await expect.poll(() => photoAuthorization).toMatch(/^Bearer /)
  await expect(
    page.getByRole('img', { name: 'Test Employee' }),
  ).toHaveAttribute('src', /^blob:/)
  expect(requests.find((r) => r.path.endsWith('/photo')).body).toContain(
    'name="file"',
  )
  expect(errors).toEqual([])
})

test('mobile login and modal remain within viewport, including sign out from navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const { errors } = await setup(page, 'ADMIN', false)
  await page.goto('/login')
  await page.screenshot({
    path: 'test-results/login-mobile.png',
    fullPage: true,
  })
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.getByLabel('User ID').fill('test-user')
  await page.getByLabel('Password', { exact: true }).fill('test-only-input')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await page.getByRole('link', { name: 'Test Employee' }).click()
  await page.getByRole('tab', { name: 'Labor Contract', exact: true }).click()
  await page.getByRole('button', { name: 'Add Contract' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.getByRole('button', { name: 'Cancel', exact: true }).click()
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.locator('aside').getByRole('button', { name: 'Sign out' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.locator('.offcanvas-backdrop')).toHaveCount(0)
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .not.toBe('hidden')
  expect(errors).toEqual([])
})
