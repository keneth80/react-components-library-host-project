const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
    const isDevelopment = argv.mode === 'development';
    const moduleFederationCheck = new ModuleFederationPlugin({
        name: "host",
        remotes: {
            designSystem: isDevelopment ? 'designSystem@http://localhost:3001/remoteEntry.js' : 'design-system',
            zds: `promise new Promise((resolve) => {
            const remoteUrl = "http://localhost:3300/remoteEntry.js";
            const script = document.createElement("script");
            script.src = remoteUrl;
            script.type = "text/javascript";
            script.async = true;
    
            script.onload = () => {
                if (window.zds) {
                    resolve(window.zds); // 반드시 remote name과 동일해야 함
                } else {
                    reject(new Error("Container missing: window.zds not found"));
                }
            };
    
            script.onerror = () => {
              console.warn("⚠ remoteEntry.js load failed, falling back to npm package");
    
              resolve({
                get: (module) => {
                  switch (module) {
                    case "./FeButton":
                      return () =>
                        import("react-components-library-seed/FeButton").then((mod) => ({
                          default: mod.default,
                        }));
                    default:
                      console.error("❌ Unknown remote module:", module);
                      return () =>
                        Promise.resolve({
                          default: () => '<div>⚠ Component unavailable</div>',
                        });
                  }
                },
                init: () => {},
              });
            };
    
            document.head.appendChild(script);
          })`,
        },
        shared: {
            react: { singleton: true, requiredVersion: '18.2.0', eager: true },
            'react-dom': { singleton: true, requiredVersion: '18.2.0', eager: true },
        },
      });
    return {
        entry: './src/index.js',
        mode: argv.mode,
        devServer: {
            static: path.join(__dirname, 'dist'),
            port: 3100,
        },
        output: {
            publicPath: 'auto',
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    options: {
                        presets: ['@babel/preset-react', '@babel/preset-typescript'],
                    },
                },
            ],
        },
        plugins: [
            new Dotenv({
                path: isDevelopment ? './.env.development' : './.env.production',
            }),
            moduleFederationCheck,
            // new ModuleFederationPlugin({
            //     name: 'template',
            //     remotes: {
            //         designSystem: isDevelopment ? 'designSystem@http://localhost:3001/remoteEntry.js' : 'design-system',
            //         zds: isDevelopment ? 'zds@http://localhost:3300/remoteEntry.js' : 'zds',
            //     },
            //     shared: {
            //         react: { singleton: true, requiredVersion: '18.2.0', eager: true },
            //         'react-dom': { singleton: true, requiredVersion: '18.2.0', eager: true },
            //     },
            // }),
            new HtmlWebpackPlugin({
                template: './public/index.html',
            }),
        ],
    };
};
