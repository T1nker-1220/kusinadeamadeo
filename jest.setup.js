// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    category: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      create: jest.fn().mockImplementation((data) => Promise.resolve({ id: 'test-id', ...data.data })),
      findMany: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockImplementation((data) => Promise.resolve({ id: data.where.id, ...data.data })),
      delete: jest.fn().mockResolvedValue({ id: 'test-id' }),
    },
  },
}));

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createServerComponentClient: () => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: {
            user: {
              id: 'test-user-id',
              email: 'test@example.com',
            },
          },
        },
      }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          role: 'ADMIN',
        },
      }),
    }),
  }),
}));

// Mock fetch for API calls
const mockCategories = new Map();
const mockFetch = jest.fn().mockImplementation((url, options = {}) => {
  // Helper to parse request body
  const getBody = () => {
    try {
      return typeof options.body === 'string' ? JSON.parse(options.body) : {};
    } catch {
      return {};
    }
  };

  if (url.startsWith('/api/categories')) {
    if (options.method === 'POST') {
      const body = getBody();

      // Validation checks
      if (body.name === 'ab' || body.description === 'Too short' || body.imageUrl === 'invalid-url') {
        return Promise.resolve({
          status: 400,
          json: () => Promise.resolve({ error: 'Validation failed' }),
        });
      }

      // RLS check for non-admin users
      if (body.name.startsWith('Test_') && options.headers?.['X-User-Role'] !== 'ADMIN') {
        return Promise.resolve({
          status: 403,
          json: () => Promise.resolve({ error: 'Unauthorized' }),
        });
      }

      if (body.name === 'Test_Category') {
        const category = { id: 'test-id', ...body };
        mockCategories.set(category.id, category);
        return Promise.resolve({
          status: 201,
          json: () => Promise.resolve(category),
        });
      }
    }

    if (options.method === 'PATCH') {
      // RLS check for non-admin users
      if (options.headers?.['X-User-Role'] !== 'ADMIN') {
        return Promise.resolve({
          status: 403,
          json: () => Promise.resolve({ error: 'Unauthorized' }),
        });
      }

      const body = getBody();
      const category = mockCategories.get(body.id);
      if (category) {
        const updatedCategory = { ...category, ...body };
        mockCategories.set(body.id, updatedCategory);
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve(updatedCategory),
        });
      }
    }

    if (options.method === 'DELETE') {
      // RLS check for non-admin users
      if (options.headers?.['X-User-Role'] !== 'ADMIN') {
        return Promise.resolve({
          status: 403,
          json: () => Promise.resolve({ error: 'Unauthorized' }),
        });
      }

      const urlObj = new URL(url, 'http://localhost');
      const id = urlObj.searchParams.get('id');

      if (!id) {
        return Promise.resolve({
          status: 400,
          json: () => Promise.resolve({ error: 'Missing id parameter' }),
        });
      }

      mockCategories.delete(id);
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });
    }

    // GET request - public access allowed
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve(Array.from(mockCategories.values())),
    });
  }

  if (url === '/api/upload') {
    if (options.body.get('type') === 'category') {
      const file = options.body.get('file');
      if (file.type === 'image/jpeg') {
        return Promise.resolve({
          status: 201,
          json: () => Promise.resolve({ url: '/images/test.jpg' }),
        });
      }
    }
    return Promise.resolve({
      status: 400,
      json: () => Promise.resolve({ error: 'Invalid file type' }),
    });
  }

  return Promise.resolve({
    status: 404,
    json: () => Promise.resolve({ error: 'Not found' }),
  });
});

global.fetch = mockFetch;

// Setup fetch mock helper
beforeEach(() => {
  mockFetch.mockClear();
  mockCategories.clear();
});

// Add custom matchers
expect.extend({
  toBeValidCategory(received) {
    const pass = received &&
      typeof received.id === 'string' &&
      typeof received.name === 'string' &&
      typeof received.description === 'string' &&
      typeof received.imageUrl === 'string' &&
      typeof received.sortOrder === 'number';

    return {
      pass,
      message: () =>
        `expected ${received} to be a valid category with required properties`,
    };
  },
});
