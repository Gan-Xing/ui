/**
 * 定义组件模块接口，用于表示导入的组件模块。
 */
interface ComponentModule {
  default: typeof HTMLElement; // 默认导出应是 HTMLElement 的类型
}

/**
 * 注册所有定义的自定义元素。
 * 此函数将遍历 `components` 数组中的所有组件，并将它们注册为自定义元素。
 * 该函数只在浏览器环境中执行，以确保自定义元素的注册只发生在客户端。
 */
export const GXUI = () => {
  if (typeof window !== "undefined" && typeof import.meta !== "undefined") {
    // 检查是否在浏览器环境中
    Object.entries(import.meta.globEager("./GX*/index.ts"))
      .map(([path, mod]) => {
        const module = mod as ComponentModule; // 类型断言，确保模块符合 ComponentModule 接口
        const componentName = path.split("/")[2]; // 从文件路径中提取组件名称
        const tagName = `gx-${componentName.toLowerCase()}`; // 创建自定义元素的标签名
        return { tagName, element: module.default }; // 返回包含标签名和元素类的对象
      })
      .forEach(({ tagName, element }) => {
        // 遍历所有组件
        if (element && !customElements.get(tagName)) {
          // 如果组件尚未注册
          customElements.define(tagName, element); // 注册组件为自定义元素
        }
      });
  }
};
