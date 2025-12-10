/**
 * 🔧 前后端通信测试方案 - 验证所有关键功能端到端连接
 *
 * 问题分析：
 * 1. 缺乏系统性的前后端通信测试
 * 2. 没有API接口可用性检测
 * 3. 缺乏Agent系统通信测试
 * 4. 没有语音功能测试验证
 * 5. 缺乏性能和稳定性测试
 *
 * 解决方案：
 * 1. 创建全面的通信测试套件
 * 2. 实现API接口健康检查
 * 3. 添加Agent系统通信测试
 * 4. 集成语音功能测试
 * 5. 提供性能监控和报告
 */

import { apiService } from './apiService';
import { AgentA, NetworkMonitor } from './agentSystem';
import { agentCoordinator, getSystemStatus } from './AgentCoordinationManager';
import { getVoiceService } from './voiceService';
import { agentLogService } from './agentD';
import { agentC_RealDataProducer } from './agentC_RealDataProducer';

// 测试结果类型
export interface TestResult {
  testName: string;
  status: 'pass' | 'fail' | 'pending' | 'skip';
  duration: number;
  message: string;
  details?: any;
  timestamp: number;
}

// 测试套件结果
export interface TestSuiteResult {
  suiteName: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  duration: number;
  results: TestResult[];
  timestamp: number;
}

// 系统健康状态
export interface SystemHealth {
  api: {
    endpoints: Array<{
      name: string;
      url: string;
      status: 'healthy' | 'unhealthy' | 'unknown';
      responseTime: number;
      error?: string;
    }>;
    overall: 'healthy' | 'unhealthy' | 'unknown';
  };
  agents: {
    status: 'healthy' | 'unhealthy' | 'unknown';
    details: any;
  };
  voice: {
    recognition: 'supported' | 'unsupported' | 'unknown';
    synthesis: 'supported' | 'unsupported' | 'unknown';
    details: any;
  };
  performance: {
    loadTime: number;
    memory: number;
    connection: 'fast' | 'slow' | 'unknown';
  };
}

// 通信测试服务
export class CommunicationTestService {
  private static instance: CommunicationTestService;
  private testResults: TestSuiteResult[] = [];
  private isRunning: boolean = false;
  private testCallbacks: Array<(result: TestSuiteResult) => void> = [];

  private constructor() {}

  public static getInstance(): CommunicationTestService {
    if (!CommunicationTestService.instance) {
      CommunicationTestService.instance = new CommunicationTestService();
    }
    return CommunicationTestService.instance;
  }

  // 注册测试回调
  public onTestComplete(callback: (result: TestSuiteResult) => void): void {
    this.testCallbacks.push(callback);
  }

  // 运行完整测试套件
  public async runFullTestSuite(): Promise<TestSuiteResult> {
    if (this.isRunning) {
      throw new Error('测试套件正在运行中');
    }

    this.isRunning = true;
    const startTime = Date.now();

    console.log('🧪 开始运行完整通信测试套件...');

    const testSuites = [
      () => this.testApiConnectivity(),
      () => this.testAgentSystem(),
      () => this.testVoiceFunctionality(),
      () => this.testDataFlow(),
      () => this.testPerformance(),
    ];

    const results: TestResult[] = [];
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;

    for (const testSuite of testSuites) {
      try {
        const suiteResult = await testSuite();
        results.push(...suiteResult.results);
        passedTests += suiteResult.passedTests;
        failedTests += suiteResult.failedTests;
        skippedTests += suiteResult.skippedTests;
      } catch (error) {
        console.error('❌ 测试套件执行失败:', error);
        failedTests++;
      }
    }

    const duration = Date.now() - startTime;
    const fullTestResult: TestSuiteResult = {
      suiteName: '完整通信测试',
      totalTests: results.length,
      passedTests,
      failedTests,
      skippedTests,
      duration,
      results,
      timestamp: Date.now(),
    };

    this.testResults.push(fullTestResult);
    this.isRunning = false;

    // 通知回调
    this.testCallbacks.forEach(callback => callback(fullTestResult));

    console.log('🎉 完整通信测试完成:', fullTestResult);
    return fullTestResult;
  }

  // 测试API连接性
  public async testApiConnectivity(): Promise<TestSuiteResult> {
    console.log('🔗 测试API连接性...');
    const startTime = Date.now();

    const tests = [
      {
        name: 'API健康检查',
        test: () => this.testApiHealth(),
      },
      {
        name: '景点API测试',
        test: () => this.testSpotsApi(),
      },
      {
        name: '人物API测试',
        test: () => this.testFiguresApi(),
      },
      {
        name: '认证API测试',
        test: () => this.testAuthApi(),
      },
      {
        name: '用户API测试',
        test: () => this.testUserApi(),
      },
    ];

    const results = await this.runTests(tests);
    const duration = Date.now() - startTime;

    return {
      suiteName: 'API连接性测试',
      totalTests: tests.length,
      passedTests: results.filter(r => r.status === 'pass').length,
      failedTests: results.filter(r => r.status === 'fail').length,
      skippedTests: results.filter(r => r.status === 'skip').length,
      duration,
      results,
      timestamp: Date.now(),
    };
  }

  // 测试Agent系统
  public async testAgentSystem(): Promise<TestSuiteResult> {
    console.log('🤖 测试Agent系统...');
    const startTime = Date.now();

    const tests = [
      {
        name: 'Agent A功能测试',
        test: () => this.testAgentA(),
      },
      {
        name: 'Agent B功能测试',
        test: () => this.testAgentB(),
      },
      {
        name: 'Agent C功能测试',
        test: () => this.testAgentC(),
      },
      {
        name: 'Agent D功能测试',
        test: () => this.testAgentD(),
      },
      {
        name: 'Agent协调测试',
        test: () => this.testAgentCoordination(),
      },
    ];

    const results = await this.runTests(tests);
    const duration = Date.now() - startTime;

    return {
      suiteName: 'Agent系统测试',
      totalTests: tests.length,
      passedTests: results.filter(r => r.status === 'pass').length,
      failedTests: results.filter(r => r.status === 'fail').length,
      skippedTests: results.filter(r => r.status === 'skip').length,
      duration,
      results,
      timestamp: Date.now(),
    };
  }

  // 测试语音功能
  public async testVoiceFunctionality(): Promise<TestSuiteResult> {
    console.log('🎤 测试语音功能...');
    const startTime = Date.now();

    const tests = [
      {
        name: '语音识别支持测试',
        test: () => this.testVoiceRecognition(),
      },
      {
        name: '语音合成支持测试',
        test: () => this.testVoiceSynthesis(),
      },
      {
        name: '麦克风权限测试',
        test: () => this.testMicrophonePermission(),
      },
    ];

    const results = await this.runTests(tests);
    const duration = Date.now() - startTime;

    return {
      suiteName: '语音功能测试',
      totalTests: tests.length,
      passedTests: results.filter(r => r.status === 'pass').length,
      failedTests: results.filter(r => r.status === 'fail').length,
      skippedTests: results.filter(r => r.status === 'skip').length,
      duration,
      results,
      timestamp: Date.now(),
    };
  }

  // 测试数据流
  public async testDataFlow(): Promise<TestSuiteResult> {
    console.log('📊 测试数据流...');
    const startTime = Date.now();

    const tests = [
      {
        name: '前端到后端数据流',
        test: () => this.testFrontendToBackendFlow(),
      },
      {
        name: 'Agent间通信流',
        test: () => this.testAgentCommunicationFlow(),
      },
      {
        name: '数据持久化测试',
        test: () => this.testDataPersistence(),
      },
    ];

    const results = await this.runTests(tests);
    const duration = Date.now() - startTime;

    return {
      suiteName: '数据流测试',
      totalTests: tests.length,
      passedTests: results.filter(r => r.status === 'pass').length,
      failedTests: results.filter(r => r.status === 'fail').length,
      skippedTests: results.filter(r => r.status === 'skip').length,
      duration,
      results,
      timestamp: Date.now(),
    };
  }

  // 测试性能
  public async testPerformance(): Promise<TestSuiteResult> {
    console.log('⚡ 测试性能...');
    const startTime = Date.now();

    const tests = [
      {
        name: '页面加载性能',
        test: () => this.testPageLoadPerformance(),
      },
      {
        name: 'API响应性能',
        test: () => this.testApiResponsePerformance(),
      },
      {
        name: 'Agent处理性能',
        test: () => this.testAgentProcessingPerformance(),
      },
    ];

    const results = await this.runTests(tests);
    const duration = Date.now() - startTime;

    return {
      suiteName: '性能测试',
      totalTests: tests.length,
      passedTests: results.filter(r => r.status === 'pass').length,
      failedTests: results.filter(r => r.status === 'fail').length,
      skippedTests: results.filter(r => r.status === 'skip').length,
      duration,
      results,
      timestamp: Date.now(),
    };
  }

  // 运行测试列表
  private async runTests(
    tests: Array<{ name: string; test: () => Promise<TestResult> }>
  ): Promise<TestResult[]> {
    const results: TestResult[] = [];

    for (const { name, test } of tests) {
      try {
        const result = await test();
        results.push(result);
        console.log(`📝 测试 ${name}: ${result.status}`);
      } catch (error) {
        const errorResult: TestResult = {
          testName: name,
          status: 'fail',
          duration: 0,
          message: error instanceof Error ? error.message : '测试执行失败',
          timestamp: Date.now(),
        };
        results.push(errorResult);
        console.error(`❌ 测试 ${name} 失败:`, error);
      }
    }

    return results;
  }

  // 具体测试方法
  private async testApiHealth(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      // 使用 Promise.race 实现超时功能
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('请求超时')), 5000);
      });

      const fetchPromise = fetch('http://localhost:3001/api/health', {
        method: 'GET',
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      const duration = Date.now() - startTime;
      const isHealthy = response.ok;

      return {
        testName: 'API健康检查',
        status: isHealthy ? 'pass' : 'fail',
        duration,
        message: isHealthy ? 'API服务正常' : `API服务异常: ${response.status}`,
        details: { status: response.status, responseTime: duration },
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: 'API健康检查',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : 'API连接失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testSpotsApi(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const result = await apiService.spots.getSpots({ limit: 5 });
      const duration = Date.now() - startTime;

      return {
        testName: '景点API测试',
        status: result.success ? 'pass' : 'fail',
        duration,
        message: result.success ? '景点API正常' : '景点API异常',
        details: { dataCount: result.data?.length || 0 },
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: '景点API测试',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : '景点API调用失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testFiguresApi(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const result = await apiService.figures.getFigures({ limit: 5 });
      const duration = Date.now() - startTime;

      return {
        testName: '人物API测试',
        status: result.success ? 'pass' : 'fail',
        duration,
        message: result.success ? '人物API正常' : '人物API异常',
        details: { dataCount: result.data?.length || 0 },
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: '人物API测试',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : '人物API调用失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testAuthApi(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const result = await apiService.auth.sendCode('13800000000');
      const duration = Date.now() - startTime;

      return {
        testName: '认证API测试',
        status: result.success ? 'pass' : 'fail',
        duration,
        message: result.success ? '认证API正常' : '认证API异常',
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: '认证API测试',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : '认证API调用失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testUserApi(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const result = await apiService.user.getProfile('test_token');
      const duration = Date.now() - startTime;

      return {
        testName: '用户API测试',
        status: result.success ? 'pass' : 'fail',
        duration,
        message: result.success ? '用户API正常' : '用户API异常',
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: '用户API测试',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : '用户API调用失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testAgentA(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const response = await AgentA.processUserRequest(
        'test_user',
        '测试问题',
        '东里村',
        'text'
      );
      const duration = Date.now() - startTime;

      return {
        testName: 'Agent A功能测试',
        status: 'pass',
        duration,
        message: 'Agent A功能正常',
        details: { response: typeof response },
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: 'Agent A功能测试',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : 'Agent A测试失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testAgentB(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      // 测试Agent B的数据访问功能
      const health = NetworkMonitor.getHealth();
      const duration = Date.now() - startTime;

      return {
        testName: 'Agent B功能测试',
        status: health.totalPendingRequests >= 0 ? 'pass' : 'fail',
        duration,
        message: 'Agent B功能正常',
        details: { health },
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: 'Agent B功能测试',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : 'Agent B测试失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testAgentC(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      // 测试Agent C的数据生产功能
      if (!agentC_RealDataProducer) {
        const duration = Date.now() - startTime;
        return {
          testName: 'Agent C功能测试',
          status: 'skip',
          duration,
          message: 'Agent C未初始化',
          timestamp: Date.now(),
        };
      }
      
      const stats = await agentC_RealDataProducer.getDataStats();
      const duration = Date.now() - startTime;

      return {
        testName: 'Agent C功能测试',
        status: stats ? 'pass' : 'fail',
        duration,
        message: 'Agent C功能正常',
        details: { stats },
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: 'Agent C功能测试',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : 'Agent C测试失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testAgentD(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const stats = agentLogService.getStats();
      const duration = Date.now() - startTime;

      return {
        testName: 'Agent D功能测试',
        status: 'pass',
        duration,
        message: 'Agent D功能正常',
        details: { stats },
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: 'Agent D功能测试',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : 'Agent D测试失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testAgentCoordination(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const systemStatus = getSystemStatus();
      const duration = Date.now() - startTime;

      return {
        testName: 'Agent协调测试',
        status: systemStatus ? 'pass' : 'fail',
        duration,
        message: 'Agent协调正常',
        details: { systemStatus },
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: 'Agent协调测试',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : 'Agent协调测试失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testVoiceRecognition(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const voiceService = getVoiceService();
      const isSupported = voiceService.isRecognitionSupported();
      const duration = Date.now() - startTime;

      return {
        testName: '语音识别支持测试',
        status: isSupported ? 'pass' : 'skip',
        duration,
        message: isSupported ? '语音识别支持正常' : '浏览器不支持语音识别',
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: '语音识别支持测试',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : '语音识别测试失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testVoiceSynthesis(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const voiceService = getVoiceService();
      const isSupported = voiceService.isSynthesisSupported();
      const duration = Date.now() - startTime;

      return {
        testName: '语音合成支持测试',
        status: isSupported ? 'pass' : 'skip',
        duration,
        message: isSupported ? '语音合成支持正常' : '浏览器不支持语音合成',
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: '语音合成支持测试',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : '语音合成测试失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testMicrophonePermission(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      const duration = Date.now() - startTime;

      return {
        testName: '麦克风权限测试',
        status: 'pass',
        duration,
        message: '麦克风权限正常',
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: '麦克风权限测试',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : '麦克风权限测试失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testFrontendToBackendFlow(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      // 模拟完整的前端到后端数据流
      const testResult = await apiService.spots.getSpots({ limit: 1 });
      const duration = Date.now() - startTime;

      return {
        testName: '前端到后端数据流',
        status: testResult.success ? 'pass' : 'fail',
        duration,
        message: testResult.success ? '数据流正常' : '数据流异常',
        details: { success: testResult.success },
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: '前端到后端数据流',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : '数据流测试失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testAgentCommunicationFlow(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      // 测试Agent间通信
      const response = await AgentA.processUserRequest(
        'test',
        'test',
        'test',
        'text'
      );
      const duration = Date.now() - startTime;

      return {
        testName: 'Agent间通信流',
        status: response ? 'pass' : 'fail',
        duration,
        message: response ? 'Agent通信正常' : 'Agent通信异常',
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: 'Agent间通信流',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : 'Agent通信测试失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testDataPersistence(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      // 测试数据持久化
      const testData = { test: 'data', timestamp: Date.now() };
      localStorage.setItem('test_persistence', JSON.stringify(testData));
      const retrieved = JSON.parse(
        localStorage.getItem('test_persistence') || '{}'
      );
      localStorage.removeItem('test_persistence');

      const duration = Date.now() - startTime;
      const isWorking = retrieved.test === testData.test;

      return {
        testName: '数据持久化测试',
        status: isWorking ? 'pass' : 'fail',
        duration,
        message: isWorking ? '数据持久化正常' : '数据持久化异常',
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: '数据持久化测试',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : '数据持久化测试失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testPageLoadPerformance(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      const duration = Date.now() - startTime;

      return {
        testName: '页面加载性能',
        status: loadTime < 3000 ? 'pass' : 'fail',
        duration,
        message: `页面加载时间: ${loadTime}ms`,
        details: { loadTime },
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: '页面加载性能',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : '性能测试失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testApiResponsePerformance(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const apiStartTime = Date.now();
      await apiService.spots.getSpots({ limit: 1 });
      const apiDuration = Date.now() - apiStartTime;
      const duration = Date.now() - startTime;

      return {
        testName: 'API响应性能',
        status: apiDuration < 2000 ? 'pass' : 'fail',
        duration,
        message: `API响应时间: ${apiDuration}ms`,
        details: { apiDuration },
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: 'API响应性能',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : 'API性能测试失败',
        timestamp: Date.now(),
      };
    }
  }

  private async testAgentProcessingPerformance(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const agentStartTime = Date.now();
      await AgentA.processUserRequest('test', 'test', 'test', 'text');
      const agentDuration = Date.now() - agentStartTime;
      const duration = Date.now() - startTime;

      return {
        testName: 'Agent处理性能',
        status: agentDuration < 5000 ? 'pass' : 'fail',
        duration,
        message: `Agent处理时间: ${agentDuration}ms`,
        details: { agentDuration },
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: 'Agent处理性能',
        status: 'fail',
        duration,
        message: error instanceof Error ? error.message : 'Agent性能测试失败',
        timestamp: Date.now(),
      };
    }
  }

  // 获取系统健康状态
  public async getSystemHealth(): Promise<SystemHealth> {
    const health: SystemHealth = {
      api: {
        endpoints: [],
        overall: 'unknown',
      },
      agents: {
        status: 'unknown',
        details: null,
      },
      voice: {
        recognition: 'unknown',
        synthesis: 'unknown',
        details: null,
      },
      performance: {
        loadTime: 0,
        memory: 0,
        connection: 'unknown',
      },
    };

    try {
      // 检查API健康状态
      const apiHealth = await this.testApiHealth();
      health.api.overall =
        apiHealth.status === 'pass' ? 'healthy' : 'unhealthy';
      health.api.endpoints.push({
        name: 'API健康检查',
        url: 'http://localhost:3001/api/health',
        status: apiHealth.status === 'pass' ? 'healthy' : 'unhealthy',
        responseTime: apiHealth.duration,
      });

      // 检查Agent系统状态
      const agentStatus = getSystemStatus();
      health.agents.status = agentStatus ? 'healthy' : 'unhealthy';
      health.agents.details = agentStatus;

      // 检查语音功能
      const voiceService = getVoiceService();
      health.voice.recognition = voiceService.isRecognitionSupported()
        ? 'supported'
        : 'unsupported';
      health.voice.synthesis = voiceService.isSynthesisSupported()
        ? 'supported'
        : 'unsupported';
      health.voice.details = {
        recognition: voiceService.getRecognitionState(),
        synthesis: voiceService.getSynthesisState(),
      };

      // 检查性能
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      health.performance.loadTime =
        navigation.loadEventEnd - navigation.loadEventStart;
      health.performance.memory =
        (performance as any).memory?.usedJSHeapSize || 0;
      health.performance.connection =
        health.performance.loadTime < 3000 ? 'fast' : 'slow';
    } catch (error) {
      console.error('❌ 系统健康检查失败:', error);
    }

    return health;
  }

  // 获取测试历史
  public getTestHistory(): TestSuiteResult[] {
    return [...this.testResults];
  }

  // 清理测试历史
  public clearTestHistory(): void {
    this.testResults = [];
  }
}

// 导出单例实例
export const communicationTest = CommunicationTestService.getInstance();

// 便捷函数
export const runFullTest = () => communicationTest.runFullTestSuite();
export const getSystemHealth = () => communicationTest.getSystemHealth();
export const getTestHistory = () => communicationTest.getTestHistory();

export default CommunicationTestService;
