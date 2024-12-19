import { productService } from '../product.service'
import { ProductCategory } from '@/types/product'

// Mock the entire supabase client module
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
  },
  fromSupabaseTimestamp: jest.fn((date) => new Date(date)),
  isSupabaseInitialized: jest.fn(() => true),
}))

// Import after mocking
import { supabase } from '@/lib/supabase/client'

describe('productService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getProducts', () => {
    // Increase timeout for all tests in this describe block
    jest.setTimeout(10000)

    it('should fetch products successfully', async () => {
      // Mock data with snake_case properties (as returned by Supabase)
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product',
          description: 'Test Description',
          base_price: 100,
          category: 'Budget Meals' as ProductCategory,
          image_url: 'test.jpg',
          available: true,
          has_variants: true,
          has_addons: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          variants: [
            {
              id: '1',
              product_id: '1',
              name: 'Test Variant',
              price: 150,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
          ],
          availableAddons: [
            {
              addon: {
                id: '1',
                name: 'Test Addon',
                price: 50,
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z',
              },
            },
          ],
        },
      ]

      // Mock the Supabase query chain
      const mockSelect = jest.fn().mockReturnThis()
      const mockOrder = jest.fn().mockReturnThis()
      const mockEq = jest.fn().mockReturnThis()

      // Mock the final promise resolution
      const mockPromise = Promise.resolve({ data: mockProducts, error: null })

      // Create a mock that implements then/catch/finally
      const mockQueryBuilder = {
        select: mockSelect,
        order: mockOrder,
        eq: mockEq,
        then: jest.fn((callback) => mockPromise.then(callback)),
        catch: jest.fn((callback) => mockPromise.catch(callback)),
        finally: jest.fn((callback) => mockPromise.finally(callback)),
      }

      ;(supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder)

      // Execute test
      const result = await productService.getProducts()

      // Assertions
      expect(result).toHaveLength(1)
      const product = result[0]
      
      // Test basic properties
      expect(product).toMatchObject({
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        basePrice: 100,
        category: 'Budget Meals',
        imageUrl: 'test.jpg',
        available: true,
        hasVariants: true,
        hasAddons: true,
      })

      // Test date transformations
      expect(product.createdAt).toBeInstanceOf(Date)
      expect(product.updatedAt).toBeInstanceOf(Date)

      // Test variants
      expect(product.variants).toHaveLength(1)
      expect(product.variants[0]).toMatchObject({
        id: '1',
        productId: '1',
        name: 'Test Variant',
        price: 150,
      })

      // Test addons
      expect(product.availableAddons).toHaveLength(1)
      expect(product.availableAddons[0]).toMatchObject({
        id: '1',
        name: 'Test Addon',
        price: 50,
      })

      // Verify Supabase calls
      expect(supabase.from).toHaveBeenCalledWith('products')
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false })
    })

    it('should handle errors when fetching products', async () => {
      // Mock error response
      const mockError = {
        message: 'Database error',
        details: 'Test error details',
        hint: 'Test error hint',
      }

      // Mock the Supabase query chain
      const mockSelect = jest.fn().mockReturnThis()
      const mockOrder = jest.fn().mockReturnThis()
      const mockEq = jest.fn().mockReturnThis()

      // Mock the final promise rejection
      const mockPromise = Promise.resolve({ data: null, error: mockError })

      // Create a mock that implements then/catch/finally
      const mockQueryBuilder = {
        select: mockSelect,
        order: mockOrder,
        eq: mockEq,
        then: jest.fn((callback) => mockPromise.then(callback)),
        catch: jest.fn((callback) => mockPromise.catch(callback)),
        finally: jest.fn((callback) => mockPromise.finally(callback)),
      }

      ;(supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder)

      // Execute test and expect error
      await expect(productService.getProducts()).rejects.toThrow('Failed to fetch products: Database error')
    })

    it('should return empty array when no products found', async () => {
      // Mock the Supabase query chain
      const mockSelect = jest.fn().mockReturnThis()
      const mockOrder = jest.fn().mockReturnThis()
      const mockEq = jest.fn().mockReturnThis()

      // Mock the final promise resolution
      const mockPromise = Promise.resolve({ data: null, error: null })

      // Create a mock that implements then/catch/finally
      const mockQueryBuilder = {
        select: mockSelect,
        order: mockOrder,
        eq: mockEq,
        then: jest.fn((callback) => mockPromise.then(callback)),
        catch: jest.fn((callback) => mockPromise.catch(callback)),
        finally: jest.fn((callback) => mockPromise.finally(callback)),
      }

      ;(supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder)

      // Execute test
      const result = await productService.getProducts()

      // Assertions
      expect(result).toEqual([])
    })

    it('should filter products by category', async () => {
      // Mock data with correct category
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product',
          description: 'Test Description',
          base_price: 100,
          category: 'Budget Meals' as ProductCategory,
          image_url: 'test.jpg',
          available: true,
          has_variants: true,
          has_addons: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ]

      // Mock the Supabase query chain
      const mockSelect = jest.fn().mockReturnThis()
      const mockOrder = jest.fn().mockReturnThis()
      const mockEq = jest.fn().mockReturnThis()

      // Mock the final promise resolution
      const mockPromise = Promise.resolve({ data: mockProducts, error: null })

      // Create a mock that implements then/catch/finally
      const mockQueryBuilder = {
        select: mockSelect,
        order: mockOrder,
        eq: mockEq,
        then: jest.fn((callback) => mockPromise.then(callback)),
        catch: jest.fn((callback) => mockPromise.catch(callback)),
        finally: jest.fn((callback) => mockPromise.finally(callback)),
      }

      ;(supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder)

      // Execute test with correct category
      await productService.getProducts('Budget Meals')

      // Verify category filter was applied
      expect(mockEq).toHaveBeenCalledWith('category', 'Budget Meals')
    })
  })
}) 