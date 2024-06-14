export default {
  entries: ["assembly/__tests__/**/*.spec.ts"],
  include: ["assembly/__tests__/**/*.include.ts"],
  disclude: [/node_modules/],
  outputBinary: false,

  async instantiate(memory, createImports, instantiate, binary) {
    const imports = {
      env: { memory },
    };

    return instantiate(binary, createImports(imports));
  },
};
