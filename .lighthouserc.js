module.exports = {
  ci: {
    collect: {
      staticDistDir: './site/dist',
      url: ['http://127.0.0.1:8080'],
      numberOfRuns: 1,
      startServerCommand: 'npx http-server ./site/dist -p 8080 -c-1'
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.7}],
        'categories:accessibility': ['warn', {minScore: 0.9}],
        'categories:best-practices': ['warn', {minScore: 0.9}],
        'categories:seo': ['warn', {minScore: 0.9}]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};