const express = require('express');
const router = express.Router();
const { parseCommand } = require('../llm/parser');

router.post('/parse', async (req, res) => {
  const { command } = req.body;

  if (!command || typeof command !== 'string') {
    return res.status(400).json({
      error: '请提供命令内容'
    });
  }

  const result = await parseCommand(command.trim());
  res.json(result);
});

module.exports = router;
