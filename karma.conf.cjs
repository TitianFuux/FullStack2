// Configuración de Karma. Usa .cjs porque package.json tiene "type": "module".
const fs = require('fs')
const path = require('path')

// karma-esbuild renombra cada spec a .js antes de empaquetarlo, así que
// Contador.spec.jsx llega como Contador.spec.js y esbuild no lo encuentra.
// Este plugin intercepta esas rutas: si el .js no existe pero el .jsx sí,
// le dice a esbuild que use el .jsx.
const specsJsx = {
  name: 'specs-jsx',
  setup(build) {
    build.onResolve({ filter: /\.spec\.js$/ }, (args) => {
      const ruta = path.resolve(args.resolveDir, args.path)
      if (!fs.existsSync(ruta) && fs.existsSync(ruta + 'x')) {
        return { path: ruta + 'x' }
      }
    })
  },
}

module.exports = function (config) {
  config.set({
    // Carpeta base desde donde se resuelven las rutas
    basePath: '',

    // Jasmine aporta describe, it, expect y los espías
    frameworks: ['jasmine'],

    // Archivos que Karma carga en el navegador
    files: [{ pattern: 'src/**/*.spec.js*', watched: false, type: 'module' }],

    // esbuild traduce JSX y resuelve los import antes de enviarlos al navegador
    preprocessors: { 'src/**/*.spec.js*': ['esbuild'] },

    esbuild: {
      target: 'es2022',
      jsx: 'automatic', // permite escribir JSX sin importar React
      loader: { '.js': 'jsx' },
      plugins: [specsJsx], // permite specs con extensión .jsx
    },

    // Cómo se muestran los resultados en la terminal
    reporters: ['progress'],

    // Navegador donde corren las pruebas. Chrome muestra la ventana;
    // ChromeHeadless corre sin interfaz, útil en servidores.
    browsers: ['ChromeHeadless'],

    // true: corre una vez y termina. false: queda esperando cambios.
    singleRun: true,

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    concurrency: 1,
  })
}
