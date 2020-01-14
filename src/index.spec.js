import { parseRoute, stringifyRoute } from './index'

describe('index', () => {
  describe('parseRoute', () => {
    it('replaces all placeholders', () => {
      const params = parseRoute('/categories/1/products/2', '/categories/:categoryId/products/:productId')
      expect(params).toEqual({ categoryId: '1', productId: '2' })
    })

    it('allows optional groups', () => {
      const route = '/:locale(/year/:year(/month/:month))'

      expect(parseRoute('/en', route)).toEqual({ locale: 'en' })
      expect(parseRoute('/en/year/2019', route)).toEqual({ locale: 'en', year: '2019' })
      expect(parseRoute('/en/year/2019/month/01', route)).toEqual({ locale: 'en', year: '2019', month: '01' })
    })

    it('decodes the values', () => {
      expect(parseRoute('/search/some%20query', '/search/:q')).toEqual({ q: 'some query' })
      expect(parseRoute('/search?q=some%20query', '/search')).toEqual({ q: 'some query' })
    })

    it('parses the query string', () => {
      const params = parseRoute('/en/products?page=2&sort=price', '/:locale/products')
      expect(params).toEqual({ locale: 'en', page: '2', sort: 'price' })
    })

    it('returns null if the route can not be matched', () => {
      expect(parseRoute('/en/search/query', '/search/:q')).toBeNull()
      expect(parseRoute('/search/query/page/2', '/search/:q')).toBeNull()
    })

    it('allows to set constraints', () => {
      expect(parseRoute('/products/1', '/products/:id', { id: '[0-9]+' })).toEqual({ id: '1' })
      expect(parseRoute('/products/x', '/products/:id', { id: '[0-9]+' })).toBeNull()
    })

    it('escapes regex characters in the pattern', () => {
      expect(parseRoute('/en/products/1', '/:locale/.*')).toBeNull()
      expect(parseRoute('/en/.*', '/:locale/.*')).toEqual({ locale: 'en' })
    })
  })

  describe('generateRoute', () => {
    it('replaces all placeholders', () => {
      const route = '/categories/:categoryId/products/:productId'
      expect(stringifyRoute(route, { categoryId: 1, productId: 2 })).toEqual('/categories/1/products/2')
    })

    it('does not replace parameter prefixes', () => {
      expect(stringifyRoute('/:kinds/:kind', { kind: 'test' })).toBeNull()
    })

    it('does not replace regex variables', () => {
      expect(stringifyRoute('/:test', { test: '$1' })).toEqual('/%241')
    })

    it('returns null if required params are missing', () => {
      expect(stringifyRoute('/products/:id', {})).toBeNull()
      expect(stringifyRoute('/:locale/products/:id', { locale: 'en' })).toBeNull()
    })

    it('encodes the values', () => {
      expect(stringifyRoute('/search/:q', { q: 'some query' })).toEqual('/search/some%20query')
      expect(stringifyRoute('/search', { q: 'some query' })).toEqual('/search?q=some%20query')
    })

    it('ignores blank params', () => {
      expect(stringifyRoute('/:locale(/search/:q)', { locale: 'en', q: null })).toEqual('/en')
      expect(stringifyRoute('/products', { page: null })).toEqual('/products')
    })

    it('removes uncovered groups', () => {
      const route = '/:locale(/year/:year(/month/:month))'
      expect(stringifyRoute(route, { locale: 'en', year: '2019' })).toEqual('/en/year/2019')
    })

    it('removes braces', () => {
      const route = '/:locale(/year/:year)'
      expect(stringifyRoute(route, { locale: 'en', year: '2019' })).toEqual('/en/year/2019')
    })

    it('generates a query string from the additional params', () => {
      expect(stringifyRoute('/:locale/products', { locale: 'en', page: 2, sort: 'price' })).toEqual('/en/products?page=2&sort=price')
    })

    it('sorts the query string params by key', () => {
      expect(stringifyRoute('/products', { c: 1, b: 2, a: 3 })).toEqual('/products?a=3&b=2&c=1')
    })
  })
})
