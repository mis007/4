// 完全独立的新文件，不修改任何现有代码
export interface BlackboardCategory {
  user_context: 'user_context';
  system_state: 'system_state';
  interaction_log: 'interaction_log';
  agent_status: 'agent_status';
  cache_data: 'cache_data';
}

export interface BlackboardEntry {
  category: keyof BlackboardCategory;
  key: string;
  data: any;
  metadata: {
    timestamp: number;
    source: string;
    version: number;
  };
}

// 黑板接口定义
export interface BlackboardSharedPool {
  writeToBoard: (
    category: keyof BlackboardCategory,
    key: string,
    data: any,
    source: string
  ) => Promise<void>;
  readFromBoard: <T>(
    category: keyof BlackboardCategory,
    key: string
  ) => Promise<T | null>;
}

// 实现：基于现有MemorySharedCache，但完全独立
export class BlackboardSharedPoolImpl implements BlackboardSharedPool {
  public storage = new Map<string, BlackboardEntry>();

  async writeToBoard(
    category: keyof BlackboardCategory,
    key: string,
    data: any,
    source: string
  ): Promise<void> {
    const fullKey = `${category}:${key}`;
    const entry: BlackboardEntry = {
      category,
      key,
      data,
      metadata: {
        timestamp: Date.now(),
        source,
        version: 1,
      },
    };

    this.storage.set(fullKey, entry);
    console.log(`📝 黑板写入: ${category}:${key} by ${source}`);
  }

  async readFromBoard<T>(
    category: keyof BlackboardCategory,
    key: string
  ): Promise<T | null> {
    const fullKey = `${category}:${key}`;
    const entry = this.storage.get(fullKey);
    if (entry) {
      console.log(`📖 黑板读取: ${category}:${key}`);
      return entry.data as T;
    }
    return null;
  }
}
