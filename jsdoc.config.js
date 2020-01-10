const pkg = require('./package.json')

module.exports = {
  'tags': {
    'allowUnknownTags': ['category']
  },
  'source': {
    'include': [
      'src/'
    ],
    'includePattern': '.js$'
  },
  'plugins': [
    'plugins/markdown',
    'node_modules/better-docs/category'
  ],
  'opts': {
    'encoding': 'utf8',
    'readme': 'README.md',
    'template': 'node_modules/better-docs',
    'destination': 'docs',
    'recurse': true,
    'verbose': true
  },
  'templates': {
    'cleverLinks': false,
    'monospaceLinks': false,
    'better-docs': {
      'name': `JS Reference: ${pkg.name}`,
      'logo': 'data:image/png;base64,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'
    }
  }
}
