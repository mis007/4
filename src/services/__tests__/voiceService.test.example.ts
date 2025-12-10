// @ts-nocheck
/**
 * 语音服务测试示例
 * 展示如何测试重构后的语音服务
 */

import { VoiceService, VoiceEvents, VoiceError } from '../voiceService';

// 模拟浏览器API
const mockSpeechRecognition = {
  continuous: false,
  interimResults: true,
  lang: 'zh-CN',
  maxAlternatives: 1,
  onstart: null as any,
  onresult: null as any,
  onerror: null as any,
  onend: null as any,
  start: jest.fn(),
  stop: jest.fn(),
  abort: jest.fn(),
};

const mockSpeechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => []),
};

const mockSpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
  text,
  lang: 'zh-CN',
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  onstart: null,
  onend: null,
  onerror: null,
}));

// 设置全局模拟
Object.defineProperty(window, 'SpeechRecognition', {
  value: jest.fn(() => mockSpeechRecognition),
  writable: true,
});

Object.defineProperty(window, 'webkitSpeechRecognition', {
  value: jest.fn(() => mockSpeechRecognition),
  writable: true,
});

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true,
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: mockSpeechSynthesisUtterance,
  writable: true,
});

Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: jest.fn().mockResolvedValue({
      getTracks: jest.fn(() => [{ stop: jest.fn() }]),
    }),
  },
  writable: true,
});

describe('VoiceService', () => {
  let voiceService: VoiceService;
  let mockEvents: VoiceEvents;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockEvents = {
      onRecognitionStart: jest.fn(),
      onRecognitionEnd: jest.fn(),
      onRecognitionResult: jest.fn(),
      onRecognitionError: jest.fn(),
      onSynthesisStart: jest.fn(),
      onSynthesisEnd: jest.fn(),
      onSynthesisError: jest.fn(),
    };

    voiceService = new VoiceService(mockEvents);
  });

  afterEach(() => {
    voiceService.dispose();
  });

  describe('初始化', () => {
    it('应该正确初始化语音服务', async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 等待异步初始化

      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
      expect(window.SpeechRecognition).toHaveBeenCalled();
    });

    it('应该处理浏览器不支持语音识别的情况', async () => {
      // 临时移除SpeechRecognition支持
      const originalSpeechRecognition = window.SpeechRecognition;
      delete (window as any).SpeechRecognition;
      delete (window as any).webkitSpeechRecognition;

      const unsupportedService = new VoiceService();
      await new Promise(resolve => setTimeout(resolve, 100));

      const recognitionState = unsupportedService.getRecognitionState();
      expect(recognitionState.isSupported).toBe(false);
      expect(recognitionState.error).toContain('浏览器不支持语音识别');

      // 恢复
      window.SpeechRecognition = originalSpeechRecognition;
      unsupportedService.dispose();
    });
  });

  describe('语音识别', () => {
    it('应该能够开始语音识别', async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 等待初始化

      await voiceService.startRecognition();
      expect(mockSpeechRecognition.start).toHaveBeenCalled();
      expect(mockEvents.onRecognitionStart).toHaveBeenCalled();
    });

    it('应该处理语音识别结果', async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 等待初始化

      await voiceService.startRecognition();

      // 模拟识别结果
      const mockResult = {
        resultIndex: 0,
        results: [
          {
            isFinal: true,
            0: {
              transcript: '测试文本',
              confidence: 0.95,
            },
          },
        ],
      };

      // 触发结果事件
      if (mockSpeechRecognition.onresult) {
        mockSpeechRecognition.onresult(mockResult as any);
      }

      expect(mockEvents.onRecognitionResult).toHaveBeenCalledWith('测试文本', 0.95);

      const state = voiceService.getRecognitionState();
      expect(state.transcript).toBe('测试文本');
      expect(state.confidence).toBe(0.95);
    });

    it('应该处理语音识别错误', async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 等待初始化

      await voiceService.startRecognition();

      // 模拟识别错误
      const mockError = {
        error: 'no-speech' as const,
        message: 'No speech detected',
      };

      // 触发错误事件
      if (mockSpeechRecognition.onerror) {
        mockSpeechRecognition.onerror(mockError as any);
      }

      expect(mockEvents.onRecognitionError).toHaveBeenCalledWith('未检测到语音，请重试');

      const state = voiceService.getRecognitionState();
      expect(state.error).toBe('未检测到语音，请重试');
      expect(state.isListening).toBe(false);
    });
  });

  describe('语音合成', () => {
    it('应该能够使用浏览器TTS合成语音', async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 等待初始化

      await voiceService.synthesize('测试文本', { useMiniMax: false });

      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith('测试文本');
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
      expect(mockEvents.onSynthesisStart).toHaveBeenCalledWith('测试文本');
    });

    it('应该处理语音合成错误', async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 等待初始化

      // 模拟合成错误
      const mockUtterance = {
        text: '测试文本',
        onstart: null,
        onend: null,
        onerror: null,
      };

      mockSpeechSynthesisUtterance.mockReturnValue(mockUtterance);

      const synthesisPromise = voiceService.synthesize('测试文本', { useMiniMax: false });

      // 模拟错误事件
      setTimeout(() => {
        if (mockUtterance.onerror) {
          mockUtterance.onerror({ error: 'synthesis-error' } as any);
        }
      }, 10);

      await expect(synthesisPromise).rejects.toThrow();
      expect(mockEvents.onSynthesisError).toHaveBeenCalled();
    });
  });

  describe('状态管理', () => {
    it('应该正确更新和获取识别状态', async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 等待初始化

      const initialState = voiceService.getRecognitionState();
      expect(initialState.isListening).toBe(false);

      await voiceService.startRecognition();
      const activeState = voiceService.getRecognitionState();
      expect(activeState.isListening).toBe(true);

      voiceService.stopRecognition();
      const stoppedState = voiceService.getRecognitionState();
      expect(stoppedState.isListening).toBe(false);
    });

    it('应该支持状态订阅', async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 等待初始化

      const listener = jest.fn();
      const unsubscribe = voiceService.subscribeToRecognitionState(listener);

      // 触发状态变更
      await voiceService.startRecognition();

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ isListening: true })
      );

      unsubscribe();
      await voiceService.stopRecognition();

      // 取消订阅后不应再调用
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('错误处理', () => {
    it('应该正确处理VoiceError', async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 等待初始化

      // 模拟麦克风权限被拒绝
      (navigator.mediaDevices.getUserMedia as jest.Mock).mockRejectedValueOnce(
        new Error('Permission denied')
      );

      const newService = new VoiceService();
      await new Promise(resolve => setTimeout(resolve, 100));

      const state = newService.getRecognitionState();
      expect(state.error).toContain('麦克风权限被拒绝');
      expect(state.isSupported).toBe(false);

      newService.dispose();
    });
  });

  describe('资源清理', () => {
    it('应该正确清理资源', () => {
      voiceService.dispose();

      expect(mockSpeechRecognition.stop).toHaveBeenCalled();
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    });
  });
});

// 集成测试示例
describe('VoiceService Integration', () => {
  it('应该支持完整的语音交互流程', async () => {
    const events: VoiceEvents = {
      onRecognitionResult: jest.fn(),
      onSynthesisEnd: jest.fn(),
    };

    const service = new VoiceService(events);
    await new Promise(resolve => setTimeout(resolve, 100)); // 等待初始化

    // 1. 开始语音识别
    await service.startRecognition();

    // 2. 模拟用户说话
    const mockResult = {
      resultIndex: 0,
      results: [
        {
          isFinal: true,
          0: {
            transcript: '今天天气怎么样',
            confidence: 0.95,
          },
        },
      ],
    };

    if (mockSpeechRecognition.onresult) {
      mockSpeechRecognition.onresult(mockResult as any);
    }

    // 3. 验证识别结果
    expect(events.onRecognitionResult).toHaveBeenCalledWith('今天天气怎么样', 0.95);

    // 4. 合成回复
    await service.synthesize('今天天气晴朗，温度适宜', { useMiniMax: false });

    // 5. 验证合成完成
    expect(events.onSynthesisEnd).toHaveBeenCalled();

    service.dispose();
  });
});
