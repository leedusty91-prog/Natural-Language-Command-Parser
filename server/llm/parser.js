const SYSTEM_PROMPT = `你是一个命令解析器。分析用户的自然语言命令，返回结构化的 JSON 响应。

可用的意图类型：
- file_convert: 文件格式转换（如"转成PDF"、"改变格式"）
- text_summarize: 文本摘要（如"总结一下"、"给我摘要"）
- image_process: 图像处理（如"调整图片大小"、"压缩照片"）
- data_analyze: 数据分析与计算（如"分析数据"、"显示统计"、"计算"、"求和"、"加减乘除"、"算数运算"、"逻辑运算"）
- unknown: 无法识别的意图

你必须只返回有效的 JSON，不要有其他文字。格式如下：
{
  "intent": "可用的意图类型之一",
  "action": "具体动作名称（snake_case格式）",
  "parameters": {
    "key": "value"
  },
  "confidence": 0.0到1.0之间的数字
}`;

const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

async function parseCommand(userInput) {
  try {
    const response = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`
      },
      body: JSON.stringify({
        model: 'glm-5',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userInput }
        ],
        temperature: 0.1,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 错误: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const result = JSON.parse(extractJson(content));

    return validateResult(result);
  } catch (error) {
    console.error('LLM 解析错误:', error.message);
    return {
      intent: 'unknown',
      action: 'parse_error',
      parameters: { error: error.message },
      confidence: 0
    };
  }
}

// 从响应中提取 JSON
function extractJson(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : '{}';
}

// 验证并规范化输出
function validateResult(result) {
  const validIntents = ['file_convert', 'text_summarize', 'image_process', 'data_analyze', 'unknown'];

  return {
    intent: validIntents.includes(result.intent) ? result.intent : 'unknown',
    action: result.action || 'unknown',
    parameters: result.parameters || {},
    confidence: typeof result.confidence === 'number' ? result.confidence : 0.5
  };
}

module.exports = { parseCommand };
