export interface TagInfo {
  name: string
  color: string
}

interface TagRule {
  keywords: string[]
  tag: string
  color: string
}

const tagRules: TagRule[] = [
  {
    keywords: ['深度学习', '深度神经网络', 'deep learning', 'DL'],
    tag: '深度学习',
    color: '#3b82f6'
  },
  {
    keywords: ['神经网络', 'neuron', '感知器', '反向传播', 'backpropagation'],
    tag: '神经网络',
    color: '#8b5cf6'
  },
  {
    keywords: ['transformer', '注意力机制', 'attention', 'self-attention', 'QKV', 'multi-head', '多头注意力'],
    tag: 'Transformer',
    color: '#ec4899'
  },
  {
    keywords: ['大模型', 'LLM', 'large language model', '语言模型', 'GPT'],
    tag: '大模型',
    color: '#f59e0b'
  },
  {
    keywords: ['稀疏注意力', 'sparse attention', 'MLA', 'KV Cache', '多头潜变量'],
    tag: '稀疏注意力',
    color: '#10b981'
  },
  {
    keywords: ['DeepSeek'],
    tag: 'DeepSeek',
    color: '#06b6d4'
  },
  {
    keywords: ['MoE', '混合专家', 'mixture of experts', '专家模型'],
    tag: 'MoE',
    color: '#a855f7'
  },
  {
    keywords: ['AI发展', 'AI历史', '人工智能历史', '三次浪潮', '两次寒冬', '符号主义', '连接主义'],
    tag: 'AI发展史',
    color: '#64748b'
  },
  {
    keywords: ['图灵', 'turing'],
    tag: '图灵',
    color: '#94a3b8'
  },
  {
    keywords: ['辛顿', 'Hinton', 'AlexNet', '明斯基', 'Minsky', '麦卡锡', 'McCarthy'],
    tag: 'AI先驱',
    color: '#f97316'
  },
  {
    keywords: ['机器学习', 'ML', 'machine learning', '统计学习', 'SVM', '支持向量机'],
    tag: '机器学习',
    color: '#84cc16'
  },
  {
    keywords: ['GPU', '算力', '摩尔定律', '计算', '芯片', '硬件'],
    tag: '算力',
    color: '#ef4444'
  },
  {
    keywords: ['编码器', '解码器', 'encoder', 'decoder', '生成式'],
    tag: '编码解码',
    color: '#14b8a6'
  },
  {
    keywords: ['RNN', '循环神经网络', 'LSTM', 'GRU'],
    tag: 'RNN',
    color: '#6366f1'
  },
  {
    keywords: ['ImageNet', '计算机视觉', 'CV', '图像识别'],
    tag: '计算机视觉',
    color: '#f43f5e'
  }
]

export function extractTags(content: string): TagInfo[] {
  const lowerContent = content.toLowerCase()
  const matchedTags = new Map<string, TagInfo>()

  for (const rule of tagRules) {
    for (const keyword of rule.keywords) {
      if (lowerContent.includes(keyword.toLowerCase())) {
        matchedTags.set(rule.tag, { name: rule.tag, color: rule.color })
        break
      }
    }
  }

  return Array.from(matchedTags.values())
}
