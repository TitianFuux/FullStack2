const path = require('path');
const fs = require('fs');

// Plugin personalizado para interceptar las rutas renombradas por Karma/esbuild.
// Si Contador.spec.js no existe en disco pero Contador.spec.jsx sí, redirige a .jsx
const specsJsx = {
  name: 'specs-jsx',
  setup(build) {
    build.onResolve({ filter: /\.spec\.cjs$/ }, (args) => {
      const rutaJs = path.resolve(args.resolveDir, args.path);
      if (!fs.existsSync(rutaJs)) {
        const rutaJsx = rutaJs + 'x';
        if (fs.existsSync(rutaJsx)) {
          return { path: rutaJsx };
        }
      }
    });
  },
};

module.exports = function (config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    // Incluye todos los archivos de prueba .js y .jsx
    files: [
      { pattern: 'src/**/*.spec.js*', watched: false, type: 'module' }
    ],

    preprocessors: {
      'src/**/*.spec.js*': ['esbuild']
    },

    esbuild: {
      target: 'es2022',
      jsx: 'automatic', // Procesa sintaxis React JSX moderna
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx'
      },
      plugins: [specsJsx] // Se registra el plugin del profesor aquí
    },

    reporters: ['progress'],

    browsers: ['ChromeHeadless'],

    singleRun: true,

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    concurrency: 1,
  });
};