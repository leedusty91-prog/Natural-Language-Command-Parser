# Natural Language Command Parser

自然语言命令解析器 - 将用户输入的自然语言命令转换为结构化 JSON 输出。

## 项目概述

本项目是一个 Web 应用，通过调用 LLM API 解析用户的自然语言命令，返回结构化的意图识别结果。

**核心功能：**
- 接收自然语言命令输入
- 调用 LLM API 进行意图识别
- 返回结构化 JSON 输出
- 显示解析历史记录

## 技术栈

| 层面 | 技术 | 说明 |
|------|------|------|
| 前端 | HTML + CSS + JavaScript | 无框架，原生实现 |
| 后端 | Node.js + Express | RESTful API 服务 |
| LLM | OpenAI / Claude API | 自然语言理解 |

## 项目结构

```
natural-language-command-parser/
├── public/
│   ├── index.html      # 主页面
│   ├── style.css       # 样式文件
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
└── CLAUDE.md           # 项目说明（本文件）
```

## 可用 Intent 类型

| Intent | 说明 | 示例命令 |
|--------|------|----------|
| `file_convert` | 文件格式转换 | "把这个文档转成 PDF" |
| `text_summarize` | 文本摘要 | "总结一下这篇文章" |
| `image_process` | 图像处理 | "压缩这张图片到 500KB 以下" |
| `data_analyze` | 数据分析 | "分析这份销售数据" |
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

**字段说明：**
- `intent` - 意图类型（必须是上述可用类型之一）
- `action` - 具体动作名称（snake_case 格式）
- `parameters` - 提取的参数对象
- `confidence` - 置信度（0.0 - 1.0）

## 开发规范

### Prompt Engineering

系统提示词应包含：
1. 角色定义："You are a command parser"
2. 可用 intent 枚举列表
3. 输出格式示例
4. 约束："MUST respond with valid JSON only"

**推荐配置：**
- `temperature: 0.1` - 提高输出一致性
- `response_format: { type: 'json_object' }` - 强制 JSON 输出

### API Key 安全

- 使用 `.env` 文件存储 API Key
- `.env` 必须添加到 `.gitignore`
- 服务端代理模式：前端不直接接触 API Key
- 提供 `.env.example` 作为模板

### 错误处理

- 后端验证 LLM 输出格式
- 无效 intent 自动转为 `unknown`
- 网络错误返回友好提示
- 前端显示加载状态

## 启动命令

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的 OPENAI_API_KEY

# 启动服务
node server/server.js

# 访问 http://localhost:3000
```

## 测试用例

| 输入命令 | 预期 Intent |
|----------|-------------|
| "把 Word 文档转成 PDF" | `file_convert` |
| "帮我总结这篇文章的要点" | `text_summarize` |
| "把图片尺寸缩小到 800px" | `image_process` |
| "分析这份 Excel 数据" | `data_analyze` |
| "今天北京天气如何" | `unknown` |

## 扩展方向

- [ ] 支持更多 LLM 提供商（Claude、Gemini）
- [ ] 添加命令自动补全
- [ ] 支持批量命令解析
- [ ] 添加用户反馈机制优化 prompt
