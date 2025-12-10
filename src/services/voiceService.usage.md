# 语音服务使用指南

## 概述

重构后的语音服务提供了更强大、更可靠的语音交互功能，包括语音识别、语音合成、状态管理和错误处理。

## 主要改进

1. **模块化设计**：将功能拆分为独立的管理器类，提高可维护性
2. **状态管理**：使用观察者模式实现响应式状态管理
3. **性能优化**：添加音频缓存、减少不必要的轮询
4. **错误处理**：增强的错误处理和重试机制
5. **类型安全**：完整的TypeScript类型定义

## 基本使用

### 1. 创建语音服务实例

```typescript
import { VoiceService, VoiceEvents } from './voiceService';

// 定义事件回调
const events: VoiceEvents = {
  onRecognitionStart: () => console.log('开始语音识别'),
  onRecognitionEnd: () => console.log('语音识别结束'),
  onRecognitionResult: (text, confidence) => {
    console.log(`识别结果: ${text} (置信度: ${confidence})`);
  },
  onRecognitionError: (error) => console.error('识别错误:', error),
  onSynthesisStart: (text) => console.log('开始合成:', text),
  onSynthesisEnd: () => console.log('合成结束'),
  onSynthesisError: (error) => console.error('合成错误:', error),
};

// 创建实例
const voiceService = new VoiceService(events);
```

### 2. 语音识别

```typescript
// 开始识别
try {
  await voiceService.startRecognition({
    lang: 'zh-CN',
    continuous: false,
    interimResults: true
  });
} catch (error) {
  console.error('启动识别失败:', error);
}

// 停止识别
voiceService.stopRecognition();

// 获取识别状态
const recognitionState = voiceService.getRecognitionState();
console.log('识别状态:', recognitionState);
```

### 3. 语音合成

```typescript
// 使用MiniMax API合成（优先）
try {
  await voiceService.synthesize('你好，欢迎使用语音服务', {
    useMiniMax: true,
    voiceSettings: {
      voice_id: 'female-qn-jingpin',
      speed: 1.0,
      pitch: 0
    }
  });
} catch (error) {
  console.error('合成失败:', error);
}

// 使用浏览器TTS
try {
  await voiceService.synthesize('你好，欢迎使用语音服务', {
    useMiniMax: false,
    lang: 'zh-CN',
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0
  });
} catch (error) {
  console.error('合成失败:', error);
}

// 停止合成
voiceService.stopSynthesis();
```

## React Hook 使用

### useVoiceService Hook

```typescript
import React from 'react';
import { useVoiceService } from './voiceService';

const VoiceComponent: React.FC = () => {
  const {
    recognitionState,
    synthesisState,
    startRecognition,
    stopRecognition,
    speakText,
    stopSynthesis,
    clearCache,
    isRecognitionSupported,
    isSynthesisSupported
  } = useVoiceService({
    onRecognitionResult: (text, confidence) => {
      console.log('识别结果:', text);
    }
  });

  const handleStartRecognition = async () => {
    try {
      await startRecognition();
    } catch (error) {
      console.error('启动识别失败:', error);
    }
  };

  const handleSpeak = async () => {
    try {
      await speakText('这是语音合成测试', {
        useMiniMax: true
      });
    } catch (error) {
      console.error('合成失败:', error);
    }
  };

  return (
    <div>
      <div>
        <p>识别支持: {isRecognitionSupported ? '是' : '否'}</p>
        <p>合成支持: {isSynthesisSupported ? '是' : '否'}</p>
        <p>识别状态: {recognitionState.isListening ? '正在识别' : '空闲'}</p>
        <p>合成状态: {synthesisState.isSpeaking ? '正在播放' : '空闲'}</p>
        {recognitionState.transcript && (
          <p>识别文本: {recognitionState.transcript}</p>
        )}
      </div>
      
      <button 
        onClick={handleStartRecognition}
        disabled={!isRecognitionSupported || recognitionState.isListening}
      >
        开始识别
      </button>
      
      <button 
        onClick={stopRecognition}
        disabled={!recognitionState.isListening}
      >
        停止识别
      </button>
      
      <button 
        onClick={handleSpeak}
        disabled={!isSynthesisSupported || synthesisState.isSpeaking}
      >
        语音合成
      </button>
      
      <button 
        onClick={stopSynthesis}
        disabled={!synthesisState.isSpeaking}
      >
        停止播放
      </button>
      
      <button onClick={clearCache}>
        清除缓存
      </button>
    </div>
  );
};
```

## 高级功能

### 1. 状态订阅

```typescript
// 订阅识别状态变化
const unsubscribeRecognition = voiceService.subscribeToRecognitionState((state) => {
  console.log('识别状态更新:', state);
  // 更新UI或执行其他逻辑
});

// 订阅合成状态变化
const unsubscribeSynthesis = voiceService.subscribeToSynthesisState((state) => {
  console.log('合成状态更新:', state);
  // 更新UI或执行其他逻辑
});

// 取消订阅
unsubscribeRecognition();
unsubscribeSynthesis();
```

### 2. 音频缓存管理

```typescript
// 清除音频缓存
voiceService.clearAudioCache();

// 缓存会自动管理，最多缓存10个音频文件
// 当缓存满时，会自动删除最旧的条目
```

### 3. 错误处理

```typescript
import { VoiceError } from './voiceService';

try {
  await voiceService.startRecognition();
} catch (error) {
  if (error instanceof VoiceError) {
    console.error('语音错误:', error.message);
    console.error('错误代码:', error.code);
    console.error('是否可恢复:', error.recoverable);
    
    if (error.recoverable) {
      // 尝试恢复
      setTimeout(() => {
        voiceService.startRecognition();
      }, 2000);
    }
  }
}
```

### 4. 便捷函数

```typescript
import { 
  startVoiceRecognition, 
  stopVoiceRecognition, 
  speakText,
  getVoiceService,
  disposeVoiceService 
} from './voiceService';

// 快速开始识别
await startVoiceRecognition({
  onRecognitionResult: (text) => console.log(text)
});

// 停止识别
stopVoiceRecognition();

// 快速合成语音
await speakText('你好', {
  useMiniMax: true,
  voiceSettings: { speed: 1.2 }
});

// 获取全局实例
const service = getVoiceService();

// 清理资源（应用卸载时）
disposeVoiceService();
```

## 最佳实践

### 1. 资源管理

```typescript
// 在组件卸载时清理资源
useEffect(() => {
  return () => {
    voiceService.dispose();
  };
}, []);
```

### 2. 错误恢复

```typescript
const handleRecognitionError = (error: string) => {
  console.error('识别错误:', error);
  
  // 根据错误类型采取不同策略
  if (error.includes('权限')) {
    // 引导用户授权
    showPermissionGuide();
  } else if (error.includes('网络')) {
    // 显示重试按钮
    showRetryButton();
  }
};
```

### 3. 性能优化

```typescript
// 使用状态订阅而不是轮询
const [state, setState] = useState(voiceService.getRecognitionState());

useEffect(() => {
  const unsubscribe = voiceService.subscribeToRecognitionState(setState);
  return unsubscribe;
}, []);
```

### 4. 用户体验

```typescript
// 提供视觉反馈
const [isProcessing, setIsProcessing] = useState(false);

const handleSpeak = async (text: string) => {
  setIsProcessing(true);
  try {
    await voiceService.synthesize(text);
  } finally {
    setIsProcessing(false);
  }
};
```

## 故障排除

### 常见问题

1. **语音识别不工作**
   - 检查浏览器是否支持 Web Speech API
   - 确认麦克风权限已授权
   - 检查网络连接

2. **语音合成无声音**
   - 检查浏览器是否支持 speechSynthesis
   - 确认音频设备正常工作
   - 检查音量设置

3. **MiniMax API 失败**
   - 检查 API 密钥配置
   - 确认网络连接正常
   - 查看控制台错误信息

### 调试技巧

```typescript
// 启用详细日志
const voiceService = new VoiceService({
  onRecognitionStart: () => console.log('🎤 识别开始'),
  onRecognitionEnd: () => console.log('🎤 识别结束'),
  onRecognitionResult: (text, confidence) => 
    console.log(`🎤 识别结果: ${text} (${confidence})`),
  onRecognitionError: (error) => console.error('🎤 识别错误:', error),
  onSynthesisStart: (text) => console.log('🔊 合成开始:', text),
  onSynthesisEnd: () => console.log('🔊 合成结束'),
  onSynthesisError: (error) => console.error('🔊 合成错误:', error),
});
```

## 迁移指南

### 从旧版本迁移

1. **构造函数变化**
   ```typescript
   // 旧版本
   const service = new VoiceService(events);
   
   // 新版本（相同）
   const service = new VoiceService(events);
   ```

2. **方法名称变化**
   ```typescript
   // 旧版本
   await service.synthesizeWithMiniMax(text);
   await service.synthesizeWithBrowser(text, options);
   
   // 新版本
   await service.synthesize(text, { useMiniMax: true });
   await service.synthesize(text, { useMiniMax: false, ...options });
   ```

3. **状态获取变化**
   ```typescript
   // 旧版本
   const state = service.getRecognitionState();
   
   // 新版本（相同，但支持订阅）
   const state = service.getRecognitionState();
   const unsubscribe = service.subscribeToRecognitionState(setState);
   ```

4. **React Hook 变化**
   ```typescript
   // 旧版本 - 使用轮询
   const { recognitionState } = useVoiceService();
   
   // 新版本 - 使用订阅（自动优化）
   const { recognitionState } = useVoiceService();
   ```

## 总结

重构后的语音服务提供了更好的性能、可靠性和开发体验。通过模块化设计、状态管理和错误处理机制，开发者可以更容易地集成语音功能到应用中。