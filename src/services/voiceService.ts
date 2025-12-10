/**
 * 🔧 语音交互服务 - 重构版本
 * 
 * 主要改进：
 * 1. 模块化设计，分离关注点
 * 2. 更好的状态管理和错误处理
 * 3. 性能优化和缓存机制
 * 4. 类型安全和可测试性
 */

import { generateMinimaxAudio, VoiceSettings } from './geminiService';

// ==================== 类型定义 ====================

export interface VoiceRecognitionState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  confidence: number;
  error?: string;
}

export interface VoiceSynthesisState {
  isSpeaking: boolean;
  isSupported: boolean;
  currentText?: string;
  error?: string;
}

export interface VoiceEvents {
  onRecognitionStart?: () => void;
  onRecognitionEnd?: () => void;
  onRecognitionResult?: (text: string, confidence: number) => void;
  onRecognitionError?: (error: string) => void;

  onSynthesisStart?: (text: string) => void;
  onSynthesisEnd?: () => void;
  onSynthesisError?: (error: string) => void;
}

export interface VoiceSynthesisOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  useMiniMax?: boolean;
  voiceSettings?: Partial<VoiceSettings>;
}

export interface VoiceRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
}

// ==================== 错误处理 ====================

export class VoiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly recoverable: boolean = true
  ) {
    super(message);
    this.name = 'VoiceError';
  }
}

// ==================== 状态管理器 ====================

class StateManager<T> {
  private state: T;
  private listeners: Array<(state: T) => void> = [];

  constructor(initialState: T) {
    this.state = { ...initialState };
  }

  getState(): T {
    return { ...this.state };
  }

  setState(updates: Partial<T>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  subscribe(listener: (state: T) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }
}

// ==================== 音频缓存管理 ====================

class AudioCache {
  private cache = new Map<string, string>();
  private maxSize = 10; // 最多缓存10个音频

  get(text: string): string | undefined {
    return this.cache.get(text);
  }

  set(text: string, audioBase64: string): void {
    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(text, audioBase64);
  }

  clear(): void {
    this.cache.clear();
  }

  has(text: string): boolean {
    return this.cache.has(text);
  }
}

// ==================== 重试机制 ====================

class RetryManager {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        // 指数退避
        const waitTime = delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError!;
  }
}

// ==================== 语音识别模块 ====================

class VoiceRecognitionManager {
  private recognition: SpeechRecognition | null = null;
  private stateManager: StateManager<VoiceRecognitionState>;
  private events: VoiceEvents;

  constructor(stateManager: StateManager<VoiceRecognitionState>, events: VoiceEvents) {
    this.stateManager = stateManager;
    this.events = events;
  }

  async initialize(): Promise<void> {
    try {
      // 检查浏览器支持
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        throw new VoiceError(
          '浏览器不支持语音识别功能',
          'NOT_SUPPORTED',
          false
        );
      }

      // 请求麦克风权限
      await this.requestMicrophonePermission();

      // 创建语音识别实例
      this.recognition = new SpeechRecognition();
      this.setupRecognitionEvents();

      this.stateManager.setState({ isSupported: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '初始化失败';
      this.stateManager.setState({
        isSupported: false,
        error: errorMessage
      });
      throw error;
    }
  }

  private async requestMicrophonePermission(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // 立即停止，只是测试权限
    } catch (error) {
      throw new VoiceError(
        '麦克风权限被拒绝，请在浏览器设置中允许麦克风访问',
        'PERMISSION_DENIED',
        false
      );
    }
  }

  private setupRecognitionEvents(): void {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'zh-CN';
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.stateManager.setState({
        isListening: true,
        transcript: '',
        confidence: 0,
        error: undefined
      });
      this.events.onRecognitionStart?.();
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;

        if (result.isFinal) {
          finalTranscript += transcript;
          this.events.onRecognitionResult?.(transcript, confidence);
        } else {
          interimTranscript += transcript;
        }
      }

      this.stateManager.setState({
        transcript: finalTranscript || interimTranscript,
        confidence: event.results[event.resultIndex]?.[0]?.confidence || 0,
      });
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMessage = this.getRecognitionErrorMessage(event.error);
      this.stateManager.setState({
        isListening: false,
        error: errorMessage
      });
      this.events.onRecognitionError?.(errorMessage);
    };

    this.recognition.onend = () => {
      this.stateManager.setState({ isListening: false });
      this.events.onRecognitionEnd?.();
    };
  }

  async start(options: VoiceRecognitionOptions = {}): Promise<void> {
    if (!this.recognition) {
      throw new VoiceError('语音识别未初始化', 'NOT_INITIALIZED');
    }

    const currentState = this.stateManager.getState();
    if (!currentState.isSupported) {
      throw new VoiceError('语音识别不可用', 'NOT_SUPPORTED', false);
    }

    if (currentState.isListening) {
      console.warn('语音识别已在进行中');
      return;
    }

    // 应用选项
    if (options.continuous !== undefined) this.recognition.continuous = options.continuous;
    if (options.interimResults !== undefined) this.recognition.interimResults = options.interimResults;
    if (options.lang !== undefined) this.recognition.lang = options.lang;
    if (options.maxAlternatives !== undefined) this.recognition.maxAlternatives = options.maxAlternatives;

    try {
      this.recognition.start();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '启动失败';
      this.stateManager.setState({ error: errorMessage });
      throw error;
    }
  }

  stop(): void {
    if (this.recognition && this.stateManager.getState().isListening) {
      this.recognition.stop();
    }
  }

  dispose(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
  }

  private getRecognitionErrorMessage(error: SpeechRecognitionErrorCode): string {
    const errorMessages: Record<string, string> = {
      'no-speech': '未检测到语音，请重试',
      aborted: '语音识别被中断',
      'audio-capture': '音频捕获失败，请检查麦克风',
      network: '网络连接错误，请检查网络',
      'not-allowed': '麦克风权限被拒绝，请在浏览器设置中允许',
      'service-not-allowed': '语音识别服务不可用',
      'bad-grammar': '语音识别语法错误',
      'language-not-supported': '不支持的语言设置',
    };

    return errorMessages[error] || '语音识别发生未知错误';
  }
}

// ==================== 语音合成模块 ====================

class VoiceSynthesisManager {
  private synthesis: SpeechSynthesis | null = null;
  private stateManager: StateManager<VoiceSynthesisState>;
  private events: VoiceEvents;
  private audioCache: AudioCache;

  constructor(
    stateManager: StateManager<VoiceSynthesisState>,
    events: VoiceEvents,
    audioCache: AudioCache
  ) {
    this.stateManager = stateManager;
    this.events = events;
    this.audioCache = audioCache;
  }

  initialize(): void {
    if (!('speechSynthesis' in window)) {
      this.stateManager.setState({
        isSupported: false,
        error: '浏览器不支持语音合成功能'
      });
      return;
    }

    this.synthesis = window.speechSynthesis;
    this.stateManager.setState({ isSupported: true });
  }

  async synthesize(
    text: string,
    options: VoiceSynthesisOptions = {}
  ): Promise<void> {
    const currentState = this.stateManager.getState();
    if (!currentState.isSupported) {
      throw new VoiceError('语音合成不可用', 'NOT_SUPPORTED', false);
    }

    // 停止当前播放
    if (currentState.isSpeaking) {
      this.stop();
    }

    // 优先使用MiniMax API（如果可用且未禁用）
    if (options.useMiniMax !== false) {
      try {
        await this.synthesizeWithMiniMax(text, options.voiceSettings);
        return;
      } catch (error) {
        console.warn('MiniMax语音合成失败，降级到浏览器TTS:', error);
        // 降级到浏览器TTS
      }
    }

    // 使用浏览器内置TTS
    await this.synthesizeWithBrowser(text, options);
  }

  private async synthesizeWithMiniMax(
    text: string,
    voiceSettings?: Partial<VoiceSettings>
  ): Promise<void> {
    this.stateManager.setState({
      isSpeaking: true,
      currentText: text,
      error: undefined
    });
    this.events.onSynthesisStart?.(text);

    try {
      // 检查缓存
      let audioBase64 = this.audioCache.get(text);
      
      if (!audioBase64) {
        // 使用重试机制调用API
        audioBase64 = await RetryManager.withRetry(
          () => generateMinimaxAudio(text, voiceSettings),
          2, // 最多重试2次
          1000
        );

        if (!audioBase64) {
          throw new VoiceError('MiniMax API返回空音频', 'API_ERROR');
        }

        // 缓存音频
        this.audioCache.set(text, audioBase64);
      }

      // 播放音频
      await this.playBase64Audio(audioBase64);

      this.stateManager.setState({
        isSpeaking: false,
        currentText: undefined
      });
      this.events.onSynthesisEnd?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '语音合成失败';
      this.stateManager.setState({
        isSpeaking: false,
        error: errorMessage
      });
      this.events.onSynthesisError?.(errorMessage);
      throw error;
    }
  }

  private async synthesizeWithBrowser(
    text: string,
    options: VoiceSynthesisOptions
  ): Promise<void> {
    if (!this.synthesis) {
      throw new VoiceError('语音合成未初始化', 'NOT_INITIALIZED');
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = options.lang || 'zh-CN';
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      utterance.onstart = () => {
        this.stateManager.setState({
          isSpeaking: true,
          currentText: text,
          error: undefined
        });
        this.events.onSynthesisStart?.(text);
      };

      utterance.onend = () => {
        this.stateManager.setState({
          isSpeaking: false,
          currentText: undefined
        });
        this.events.onSynthesisEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        const errorMessage = `语音合成失败: ${event.error}`;
        this.stateManager.setState({
          isSpeaking: false,
          error: errorMessage
        });
        this.events.onSynthesisError?.(errorMessage);
        reject(new VoiceError(errorMessage, 'SYNTHESIS_ERROR'));
      };

      this.synthesis!.speak(utterance);
    });
  }

  private async playBase64Audio(audioBase64: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // 优化的Base64解码
        const binaryString = atob(audioBase64);
        const bytes = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(blob);

        const audio = new Audio(audioUrl);

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };

        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          reject(new VoiceError('音频播放失败', 'PLAYBACK_ERROR'));
        };

        audio.play().catch(reject);
      } catch (error) {
        reject(new VoiceError('音频处理失败', 'AUDIO_PROCESSING_ERROR'));
      }
    });
  }

  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.stateManager.setState({
        isSpeaking: false,
        currentText: undefined
      });
    }
  }

  dispose(): void {
    this.stop();
    this.synthesis = null;
  }
}

// ==================== 主语音服务类 ====================

export class VoiceService {
  private recognitionManager: VoiceRecognitionManager;
  private synthesisManager: VoiceSynthesisManager;
  private recognitionStateManager: StateManager<VoiceRecognitionState>;
  private synthesisStateManager: StateManager<VoiceSynthesisState>;
  private audioCache: AudioCache;
  private events: VoiceEvents;
  private isInitialized: boolean = false;

  constructor(events: VoiceEvents = {}) {
    this.events = events;
    
    // 初始化状态管理器
    this.recognitionStateManager = new StateManager<VoiceRecognitionState>({
      isListening: false,
      isSupported: false,
      transcript: '',
      confidence: 0,
    });

    this.synthesisStateManager = new StateManager<VoiceSynthesisState>({
      isSpeaking: false,
      isSupported: false,
    });

    // 初始化音频缓存
    this.audioCache = new AudioCache();

    // 初始化管理器
    this.recognitionManager = new VoiceRecognitionManager(
      this.recognitionStateManager,
      this.events
    );

    this.synthesisManager = new VoiceSynthesisManager(
      this.synthesisStateManager,
      this.events,
      this.audioCache
    );

    // 异步初始化
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      console.log('🎤 初始化语音服务...');

      // 并行初始化识别和合成
      await Promise.all([
        this.recognitionManager.initialize(),
        Promise.resolve(this.synthesisManager.initialize())
      ]);

      this.isInitialized = true;
      console.log('✅ 语音服务初始化完成', {
        recognitionSupported: this.recognitionStateManager.getState().isSupported,
        synthesisSupported: this.synthesisStateManager.getState().isSupported,
      });
    } catch (error) {
      console.error('❌ 语音服务初始化失败:', error);
    }
  }

  // 语音识别方法
  async startRecognition(options?: VoiceRecognitionOptions): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.recognitionManager.start(options);
  }

  stopRecognition(): void {
    this.recognitionManager.stop();
  }

  // 语音合成方法
  async synthesize(text: string, options?: VoiceSynthesisOptions): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.synthesisManager.synthesize(text, options);
  }

  stopSynthesis(): void {
    this.synthesisManager.stop();
  }

  // 状态获取方法
  getRecognitionState(): VoiceRecognitionState {
    return this.recognitionStateManager.getState();
  }

  getSynthesisState(): VoiceSynthesisState {
    return this.synthesisStateManager.getState();
  }

  // 状态订阅方法
  subscribeToRecognitionState(listener: (state: VoiceRecognitionState) => void): () => void {
    return this.recognitionStateManager.subscribe(listener);
  }

  subscribeToSynthesisState(listener: (state: VoiceSynthesisState) => void): () => void {
    return this.synthesisStateManager.subscribe(listener);
  }

  // 支持检查
  isRecognitionSupported(): boolean {
    return this.recognitionStateManager.getState().isSupported;
  }

  isSynthesisSupported(): boolean {
    return this.synthesisStateManager.getState().isSupported;
  }

  // 缓存管理
  clearAudioCache(): void {
    this.audioCache.clear();
  }

  // 清理资源
  dispose(): void {
    this.recognitionManager.dispose();
    this.synthesisManager.dispose();
    this.audioCache.clear();
    console.log('🧹 语音服务已清理');
  }
}

// ==================== 全局实例管理 ====================

class VoiceServiceManager {
  private instance: VoiceService | null = null;

  getInstance(events?: VoiceEvents): VoiceService {
    if (!this.instance) {
      this.instance = new VoiceService(events);
    }
    return this.instance;
  }

  dispose(): void {
    if (this.instance) {
      this.instance.dispose();
      this.instance = null;
    }
  }
}

const voiceServiceManager = new VoiceServiceManager();

// ==================== 导出函数 ====================

export const getVoiceService = (events?: VoiceEvents): VoiceService => {
  return voiceServiceManager.getInstance(events);
};

export const startVoiceRecognition = async (
  events?: VoiceEvents,
  options?: VoiceRecognitionOptions
): Promise<void> => {
  const service = getVoiceService(events);
  return service.startRecognition(options);
};

export const stopVoiceRecognition = (): void => {
  const service = voiceServiceManager.getInstance();
  service.stopRecognition();
};

export const speakText = async (
  text: string,
  options: VoiceSynthesisOptions = {}
): Promise<void> => {
  const service = getVoiceService();
  return service.synthesize(text, options);
};

export const disposeVoiceService = (): void => {
  voiceServiceManager.dispose();
};

// ==================== React Hook ====================

import { useState, useEffect, useCallback, useRef } from 'react';

export const useVoiceService = (events?: VoiceEvents) => {
  const serviceRef = useRef<VoiceService | null>(null);
  const [recognitionState, setRecognitionState] = useState<VoiceRecognitionState>({
    isListening: false,
    isSupported: false,
    transcript: '',
    confidence: 0,
  });
  const [synthesisState, setSynthesisState] = useState<VoiceSynthesisState>({
    isSpeaking: false,
    isSupported: false,
  });

  useEffect(() => {
    const service = getVoiceService(events);
    serviceRef.current = service;

    // 订阅状态变更
    const unsubscribeRecognition = service.subscribeToRecognitionState(setRecognitionState);
    const unsubscribeSynthesis = service.subscribeToSynthesisState(setSynthesisState);

    return () => {
      unsubscribeRecognition();
      unsubscribeSynthesis();
    };
  }, [events]);

  const startRecognition = useCallback(
    (options?: VoiceRecognitionOptions) => {
      return serviceRef.current?.startRecognition(options);
    },
    []
  );

  const stopRecognition = useCallback(() => {
    serviceRef.current?.stopRecognition();
  }, []);

  const speakText = useCallback(
    (text: string, options?: VoiceSynthesisOptions) => {
      return serviceRef.current?.synthesize(text, options);
    },
    []
  );

  const stopSynthesis = useCallback(() => {
    serviceRef.current?.stopSynthesis();
  }, []);

  const clearCache = useCallback(() => {
    serviceRef.current?.clearAudioCache();
  }, []);

  return {
    recognitionState,
    synthesisState,
    startRecognition,
    stopRecognition,
    speakText,
    stopSynthesis,
    clearCache,
    isRecognitionSupported: recognitionState.isSupported,
    isSynthesisSupported: synthesisState.isSupported,
  };
};

export default VoiceService;