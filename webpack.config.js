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
                const url = "http://localhost:3300/remoteEntry.js";
                const script = document.createElement("script");
                script.src = url;
          
                script.onload = () => {
                  if (window.zds) {
                    resolve({
                      get: (module) => {
                        if (window.zds.get(module)) {
                          return window.zds.get(module); // 정상 remote 모듈
                        }
          
                        // 🛡️ 존재하지 않는 모듈 fallback
                        console.warn("❌ Unknown remote module:", module);
                        return () =>
                          Promise.resolve({
                            default: function Fallback() {
                                return '⚠ Remote container missing';
                            },
                          });
                      },
                      init: (shareScope) => {
                        try {
                          return window.zds.init(shareScope);
                        } catch (e) {
                          console.warn("remote init error", e);
                        }
                      },
                    });
                  } else {
                    resolve({
                      get: () => () =>
                        Promise.resolve({
                          default: function Fallback() {
                            return '⚠ Remote container missing';
                          },
                        }),
                      init: () => {},
                    });
                  }
                };
          
                script.onerror = () => {
                  console.warn("⚠ remoteEntry.js load failed");
                  resolve({
                    get: () => () =>
                      Promise.resolve({
                        default: function Fallback() {
                            return '⚠ Remote container missing';
                        },
                      }),
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
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".jsx"], // ts/tsx 포함
        },
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
