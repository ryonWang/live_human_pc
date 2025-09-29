## 项目概述
本项目为桌面与网页双端的内容创作工具，前端基于 Vue 3 + Vite + Element Plus + Pinia，桌面端通过 Tauri 集成（Rust）。代码结构清晰，模块化拆分，对中文友好。

## 技术栈与关键依赖
- 前端：Vue 3、Vue Router、Pinia、Element Plus（内置中文 zh-cn 与暗黑变量）
- 工具与库：axios、qs、lodash.merge、@element-plus/icons-vue、vue-drag-resize
- 桌面端：Tauri（Rust），配置见 src-tauri/

## 目录结构（简要）
- src/main.js：应用入口，注册 Element Plus、Pinia、路由、图标、拖拽缩放组件
- src/router/index.js：路由配置（登录与主框架路由），包含错误处理与 Tauri 路由基座切换
- src/views/：业务页面（ai-clone、ai-video、login、index）按需异步加载
- src/components/：通用组件（clone、generate、preview-video 等）
- src/layout/：全局布局（菜单、标题栏）
- src/styles/：样式与主题（_variables.scss、element-variables.scss、index.scss）
- src/utils/http.js：HTTP 封装与拦截器、参数与数据格式化工具
- src-tauri/：桌面端（Rust 入口、配置、图标等）
- .env.*：环境变量（开发/生产/预构建等）

## 路由与页面
- 全局路由：/login
- 主路由：/（Index 布局，默认重定向 /login）
- 子路由：
  - /characterClone（角色克隆）
  - /characterList（角色列表）
  - /voiceList（声音列表）
  - /videoList（视频列表）
  - /generateOralBroadcast（生成口播）
- 路由基座：当 VITE_APP_IS_TAURI == 'true' 时使用 createWebHistory()，否则使用 createWebHistory('/pc/')
- 错误处理：动态模块加载或 CSS 预加载失败时，回退并刷新避免白屏

## 样式与主题
- 全局样式入口：src/styles/index.scss，含基础与规范化样式
- 主题与变量：_variables.scss 与 element-variables.scss；支持暗黑主题 CSS 变量
- 图标：iconfont.js + Element Plus 图标全局注册

## 状态管理
- Pinia 在入口中注册，便于模块化状态管理与类型增强

## 数据交互（utils/http.js）
- axios 实例：超时 60s，JSON 请求头，跨域凭据关闭
- 请求拦截：GET 参数使用 qs 序列化（arrayFormat: 'repeat'）
- 响应拦截：
  - 200：返回业务数据
  - 401：清除本地 userInfo/TOKEN 并弹出错误提示（可根据需要跳转登录）
  - 500：直接弹出错误消息
  - blob/arraybuffer：直接返回原始响应
- 统一辅助：
  - adornUrl(action)：拼接 import.meta.env.VITE_APP_BASE_API
  - adornParams(params)：合并默认参数 t=Date.now()
  - adornData(data, type)：JSON 或表单序列化

## 桌面端（Tauri）
- src-tauri/：包含 tauri.conf.json、Rust 入口（src/main.rs、lib.rs）与构建资产
- 图标与能力：icons/ 与 capabilities/

## 配置与变量管理
- 环境变量：.env.beforeBuild、.env.beforeDev、.env.development、.env.production
- 变量集中管理建议：
  - 统一在样式变量文件与单一配置文件中集中定义常量（如 base API、路由基座、业务枚举等），避免重复定义与分散维护
  - 示例建议路径：src/config/constants.js（若需要新增，将在代码评审通过后统一创建）

## 性能与工程实践
- 路由与页面按需异步加载，降低首屏体积
- 错误兜底与用户提示统一（ElMessage），降低故障感知成本
- GET 参数与数据序列化统一，减少后端兼容成本
- 图标与组件按需/全局注册结合，平衡体积与开发效率

## 业务流程概览
1. 登录（/login）进入系统
2. 进入主框架（Index 布局）
3. 侧边菜单进入对应模块：
   - AI 克隆：角色克隆/角色列表/声音列表
   - AI 视频：视频列表/生成口播
4. 数据请求通过 adornUrl + axios 发起，统一处理返回码与错误提示
5. 401 时清理本地并提醒用户（可扩展为自动跳转登录）

## 开发与维护指南
- 中文友好与注释规范：Node/JS 注释写在代码上方，控制在一行以内；Python 注释同理（若有）
- 修改影响面评估：任何修改需评估关联功能并同步更新文档
- 文档与使用说明：任何新功能或影响原有操作的修改，须在 README 对应位置补充说明与使用方法
- 性能与效率：优先选择对性能友好的实现与优化策略
- 日志策略：若同一问题连续两次未解决，下一次修改需加入可定位日志，便于排查
- 项目启动：由使用者自行启动；以下命令与流程仅作为参考

## 后续扩展建议
- 变量与配置统一化：建立集中配置清单，避免重复定义；配合类型或枚举提高可维护性
- 错误处理完善：401 自动跳转与统一错误码字典；为关键链路增加埋点与日志
- 文档沉淀：接口参数字典、数据流图、字段校验规则集中化，提升协作效率
- Tauri 能力增强：文件读写、权限控制、系统托盘等特性按需开放
- 国际化：如需多语言，建议引入 i18n，保持中文为主并逐步扩展
- 缓存与资源：针对大资源（视频/音频）考虑断点续传与缓存策略

## 可提供的进一步资料
如需更详细的信息，请指出具体模块或主题，我可以补充：
- 数据流图（含请求链路与状态流转）
- 接口参数字典（含字段类型、默认值与校验规则）
- 生成器模型字段列表与校验规范

## 文档更新记录
- 新增：项目框架、代码结构与业务逻辑综述，以及扩展建议与维护指南。
