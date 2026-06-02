module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" }, modules: "commonjs" }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: [
    // Transforma import.meta.env.X → process.env.X para que Jest pueda resolverlo
    function transformImportMeta() {
      return {
        visitor: {
          MetaProperty(path) {
            if (
              path.node.meta.name === "import" &&
              path.node.property.name === "meta"
            ) {
              path.replaceWithSourceString("(process)");
            }
          },
        },
      };
    },
  ],
};
