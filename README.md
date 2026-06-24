# adminApp

这是服装网站的后台管理系统，运行在本地浏览器，端口为3000，支持向cloudflare和wrangler本地模拟（数据库）环境上传（存储）、读取、更新、删除数据。

## 项目概览

请阅读:`docs/README.md`

## 运行（测试）

```bash
npm run dev
```

### 本地模拟数据库

在worker-api中运行

```bash
VITE_API_BASE_URL=http://localhost:8787  # 本地模拟数据库地址
VITE_ADMIN_TOKEN=dev-admin-token       # 管理员token
```
