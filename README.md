# routing-pattern

A powerful, but minimal library (1.2K minified and gzipped) to conveniently parse and stringify route patterns

## Installing / Getting started

```sh
yarn add routing-pattern
```

## Usage

To parse routes:

```javascript
import { parseRoute } from 'routing-pattern'

parseRoute('/products/3', '/products/:id')
// => { id: '3' }

parseRoute('/products/x', '/products/:id', { constraints: { id: '[0-9]+' } })
// => null

parseRoute('/en/sales/search/books/year/2019', /:locale/sales(/search/:q)(year/:year))
// => { locale: 'en', q: 'books', year: '2019' }

parseRoute('/products/3?foo=bar', '/products/:id')
// => { id: 3, foo: 'bar' }
```

To stringify routes:

```javascript
import { stringifyRoute } from 'routing-pattern'

stringifyRoute('/:locale/sales/(search/:q)(year/:year)', { locale: 'en', q: 'some query', year: '2019' })
// => '/en/sales/search/some%20query/year/2019'

stringifyRoute('/products/:id', {})
// => null
```

## Versioning

This project is using the [Semantic Versioning specification](http://semver.org/).
