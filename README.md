# Natural Language Command Parser

自然语言命令解析器 - 将用户输入的自然语言命令转换为结构化 JSON 输出。

## 功能特性

- 输入自然语言命令，AI 自动解析为结构化数据
- 支持多种意图类型识别
- 显示解析历史记录（最近 5 条）
- Apple 风格简洁界面

## 支持的意图类型

| Intent | 说明 | 示例命令 |
|--------|------|----------|
| `file_convert` | 文件格式转换 | "把这个文档转成 PDF" |
| `text_summarize` | 文本摘要 | "总结一下这篇文章" |
| `image_process` | 图像处理 | "压缩这张图片到 500KB 以下" |
| `data_analyze` | 数据分析与计算 | "计算 123 加 456"、"分析这份销售数据" |
| `unknown` | 未识别意图 | "今天天气怎么样" |

## 输出格式

```json
{
  "intent": "file_convert",
  "action": "convert_to_pdf",
  "parameters": {
    "source_type": "document",
    "target_format": "pdf"
  },
  "confidence": 0.95
}
```

## 技术栈

- **前端**: HTML + CSS + JavaScript（原生实现）
- **后端**: Node.js + Express
- **LLM**: 智谱 AI GLM-5

## 环境要求

- Node.js 18+
- npm

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/你的用户名/Natural-Language-Command-Parser.git
cd Natural-Language-Command-Parser
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的智谱 AI API Key：

```env
# 智谱 AI API Key
# 获取地址: https://open.bigmodel.cn/
ZHIPU_API_KEY=your_api_key_here

# 服务器端口（可选，默认 3000）
PORT=3000
```

**获取 API Key：**
1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
2. 注册/登录账号
3. 进入控制台获取 API Key

### 4. 启动服务

```bash
npm start
```

### 5. 访问应用

打开浏览器访问: http://localhost:3000

## 项目结构

```
Natural-Language-Command-Parser/
├── public/
│   ├── index.html      # 主页面
│   ├── style.css       # 样式文件（Apple 风格）
│   └── app.js          # 前端逻辑
├── server/
│   ├── server.js       # 服务器入口
│   ├── llm/
│   │   └── parser.js   # LLM 解析逻辑
│   └── routes/
│       └── api.js      # API 路由
├── .env.example        # 环境变量模板
├── .gitignore
├── package.json
├── CLAUDE.md           # 项目说明
└── README.md           # 本文件
```

## API 接口

### POST /api/parse

解析自然语言命令。

**请求体：**

```json
{
  "command": "把这个文档转成PDF格式"
}
```

**响应：**

```json
{
  "intent": "file_convert",
  "action": "convert_to_pdf",
  "parameters": {
    "target_format": "pdf"
  },
  "confidence": 0.95
}
```

## 注意事项

- `.env` 文件包含 API Key，已添加到 `.gitignore`，请勿提交到仓库
- 确保智谱 AI 账户有足够的余额

## License

MIT
