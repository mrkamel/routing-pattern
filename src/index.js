export function parseRoute (path, pattern, constraints = {}) {
  const pathWithoutQueryString = path.replace(/\?.*/, '')
  const queryString = path.replace(/[^?]*\??/, '')
  const namedParameters = (pattern.match(/:[a-zA-Z0-9_]+/g) || []).map(name => name.replace(/^:/g, ''))
  const escapedPattern = escapeRegexWithoutBraces(pattern).replace(/\(/g, '(?:').replace(/\)/g, ')?')

  const patternWithConstraints = namedParameters.reduce(
    (acc, cur) => acc.replace(new RegExp(`:${cur}`, 'g'), `(${constraints[cur] || '[^/]+'})`),
    escapedPattern
  )

  const regex = new RegExp(`^${patternWithConstraints}$`)
  const matches = pathWithoutQueryString.match(regex)

  if (!matches) return null

  const pathParams = namedParameters.reduce((acc, cur, index) => {
    if (matches[index + 1]) {
      acc[cur] = decodeURIComponent(matches[index + 1])
    }

    return acc
  }, {})

  const queryStringParams = parseQueryString(queryString)

  return { ...pathParams, ...queryStringParams }
}

export function stringifyRoute (pattern, params = {}) {
  const presentParams = objectWithoutBlanks(params)
  let path = pattern
  const queryStringParams = {}

  Object.keys(presentParams).forEach((key) => {
    const placeholder = `:${key}`

    if (!placeholder.match(/^:[a-zA-Z0-9_]+$/g) || pattern.indexOf(placeholder) === -1) {
      queryStringParams[key] = presentParams[key]

      return
    }

    path = path.replace(new RegExp(placeholder, 'g'), encodeURIComponent(presentParams[key]).replace(/\(/g, '%28').replace(/\)/g, '%29'))
  })

  while (true) {
    const newPath = path.replace(/[(][^()]*:[a-zA-Z0-9_]+[^()]*[)]/g, '')

    if (newPath === path) break

    path = newPath
  }

  if (path.match(/:[a-zA-Z0-9_]+/)) return null

  path = path.replace(/[()]/g, '').replace(/%28/g, '(').replace(/%29/g, ')')

  const queryString = generateQueryString(queryStringParams)

  if (!queryString) return path

  return `${path}?${queryString}`
}

function escapeRegexWithoutBraces (string) {
  return string.replace(/[.*+?^${}|[\]\\]/g, '\\$&')
}

function objectWithoutBlanks (object) {
  return Object.keys(object).reduce((acc, key) => {
    if (object[key] !== null && object[key] !== undefined) {
      acc[key] = object[key]
    }

    return acc
  }, {})
}

function parseQueryString (queryString) {
  return queryString.split('&').reduce((acc, str) => {
    const key = decodeURIComponent(str.replace(/=.*/, ''))
    const value = decodeURIComponent(str.replace(/[^=]*=/, ''))

    if (key) {
      acc[key] = value
    }

    return acc
  }, {})
}

function generateQueryString (params) {
  return Object.keys(params).sort().reduce((acc, key) => {
    return acc.concat(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  }, []).join('&')
}
