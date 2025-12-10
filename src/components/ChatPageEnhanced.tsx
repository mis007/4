// 增强版Chat页面 - 集成真实语音功能和Agent系统
import React, { useState, useEffect } from 'react';
import { Button, Toast, NavBar, Avatar, Input } from 'antd-mobile';
import { SafeAgentWrapper } from '../services/safeAgentWrapper';
import { AgentA } from '../services/agentSystem';
import { useVoiceService, VoiceEvents } from '../services/voiceService';
import { communicationTest } from '../services/communicationTest';

const ChatPageEnhanced = () => {
  const [messages, setMessages] = useState<
    { id: string; type: 'user' | 'ai'; text: string; timestamp: number }[]
  >([]);
  const [input, setInput] = useState('');
  const [hasInteraction, setHasInteraction] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [showTestPanel, setShowTestPanel] = useState(false);

  const safeAgent = new SafeAgentWrapper();

  // 语音服务配置
  const voiceEvents: VoiceEvents = {
    onRecognitionStart: () => {
      setIsRecording(true);
      Toast.show({ content: '开始录音...', position: 'top' });
    },
    onRecognitionEnd: () => {
      setIsRecording(false);
    },
    onRecognitionResult: (text: string, confidence: number) => {
      console.log(`🎤 识别结果: "${text}" (置信度: ${confidence})`);
      handleUserInteraction('voice', text);
    },
    onRecognitionError: (error: string) => {
      setIsRecording(false);
      Toast.show({
        content: `语音识别失败: ${error}`,
        position: 'top',
        duration: 3000,
      });
    },
    onSynthesisStart: (text: string) => {
      setIsSpeaking(true);
      console.log(`🔊 开始语音合成: "${text}"`);
    },
    onSynthesisEnd: () => {
      setIsSpeaking(false);
    },
    onSynthesisError: (error: string) => {
      setIsSpeaking(false);
      Toast.show({
        content: `语音合成失败: ${error}`,
        position: 'top',
        duration: 3000,
      });
    },
  };

  const {
    recognitionState,
    synthesisState,
    startRecognition,
    stopRecognition,
    speakText,
    isRecognitionSupported,
    isSynthesisSupported,
  } = useVoiceService(voiceEvents);

  // 10秒自动跳转
  useEffect(() => {
    const timer = setInterval(() => {
      if (!hasInteraction) {
        setCountdown(prev => {
          if (prev <= 1) {
            // 🎯 安全记录自动跳转
            safeAgent.safeRecordRedirect({
              fromPage: 'chat',
              toPage: 'home',
              reason: 'no_interaction_10s',
              timestamp: new Date().toISOString(),
              sessionDuration: 10000,
            });

            Toast.show({ content: '10秒无操作，返回首页', position: 'top' });
            setTimeout(() => {
              window.location.href = '/home';
            }, 1000);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [hasInteraction]);

  // 用户交互处理
  const handleUserInteraction = async (
    type: 'text' | 'voice',
    content: string
  ) => {
    setHasInteraction(true);

    const uid = 'demo_user_001';
    const sessionId = 'demo_session_001';

    const interactionData = {
      uid,
      sessionId,
      interactionType: type,
      content,
      timestamp: new Date().toISOString(),
      page: 'chat_enhanced',
    };

    // 🎯 安全记录用户交互
    await safeAgent.safeRecordInteraction(interactionData);

    // 添加用户消息
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'user',
        text: content,
        timestamp: Date.now(),
      },
    ]);

    try {
      // 🎯 对接真实Agent ABCD四人组系统
      const startTime = Date.now();
      const contextSpot = '东里村'; // 当前景点上下文

      console.log(`🚀 调用Agent系统: uid=${uid}, input="${content}"`);

      const response = await AgentA.processUserRequest(
        uid,
        content,
        contextSpot,
        type
      );

      const responseTime = Date.now() - startTime;

      // 处理Agent响应
      let responseText = '';
      if (typeof response === 'string') {
        responseText = response;
      } else if (response && response.text) {
        responseText = response.text;
      } else if (response && response.content) {
        responseText = response.content;
      } else {
        responseText = JSON.stringify(response).substring(0, 500);
      }

      // 添加AI回复
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          text: responseText,
          timestamp: Date.now(),
        },
      ]);

      // 🎯 安全记录Agent响应
      await safeAgent.safeRecordAgentResponse({
        uid,
        sessionId,
        timestamp: new Date().toISOString(),
        inputType: type,
        inputContent: content,
        agentASuccess: true,
        apiCallSuccess: true,
        signalToBSuccess: true,
      });

      console.log(`✅ Agent响应成功: ${responseTime}ms`);
    } catch (error) {
      console.error('❌ Agent系统调用失败:', error);

      // 优雅降级 - 友好的错误提示
      const errorResponse = `抱歉，我暂时无法回复您的问题。请稍后再试，或者您可以尝试换个方式提问 🤔`;

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          text: errorResponse,
          timestamp: Date.now(),
        },
      ]);

      // 记录错误到黑板
      await safeAgent.safeRecordAgentResponse({
        uid,
        sessionId,
        timestamp: new Date().toISOString(),
        inputType: type,
        inputContent: content,
        agentASuccess: false,
        apiCallSuccess: false,
        signalToBSuccess: false,
      });
    }
  };

  // 真实语音输入处理
  const handleVoiceInput = async () => {
    if (!isRecognitionSupported()) {
      Toast.show({
        content: '您的浏览器不支持语音识别功能',
        position: 'top',
        duration: 3000,
      });
      return;
    }

    try {
      if (isRecording) {
        stopRecognition();
      } else {
        await startRecognition();
      }
    } catch (error) {
      console.error('语音输入失败:', error);
      Toast.show({
        content: '语音输入失败，请使用文字输入',
        position: 'top',
        duration: 3000,
      });
    }
  };

  // 文字转语音播放
  const playTextToSpeech = async (text: string) => {
    if (!isSynthesisSupported()) {
      Toast.show({
        content: '您的浏览器不支持语音合成功能',
        position: 'top',
        duration: 2000,
      });
      return;
    }

    try {
      // 优先使用MiniMax API，失败则降级到浏览器TTS
      await speakText(text, true);
    } catch (error) {
      console.error('语音播放失败:', error);
      Toast.show({
        content: '语音播放失败，请稍后重试',
        position: 'top',
        duration: 2000,
      });
    }
  };

  // 运行通信测试
  const runCommunicationTest = async () => {
    try {
      Toast.show({ content: '正在运行通信测试...', position: 'top' });

      const results = await communicationTest.runFullTestSuite();
      setTestResults(results);
      setShowTestPanel(true);

      const successRate = (
        (results.passedTests / results.totalTests) *
        100
      ).toFixed(1);
      Toast.show({
        content: `测试完成，成功率: ${successRate}%`,
        position: 'top',
        duration: 3000,
      });
    } catch (error) {
      console.error('通信测试失败:', error);
      Toast.show({
        content: '通信测试失败，请检查控制台',
        position: 'top',
        duration: 3000,
      });
    }
  };

  return (
    <div className="chat-page">
      <div
        style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}
      >
        <div
          style={{
            backgroundColor: '#ffeb3b',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          倒计时: {countdown}s
        </div>
      </div>

      <NavBar
        backArrow={false}
        right={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              size="small"
              onClick={() => {
                const stats = safeAgent.getBlackboardStats();
                console.log('📊 黑板统计:', stats);
                alert(JSON.stringify(stats, null, 2));
              }}
            >
              查看黑板
            </Button>
            <Button size="small" onClick={runCommunicationTest}>
              通信测试
            </Button>
          </div>
        }
      >
        AI对话 - 增强版
      </NavBar>

      <div style={{ padding: '16px' }}>
        <div
          style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#2e7d32' }}>
            💡 路演演示说明：
          </div>
          <ul
            style={{
              fontSize: '12px',
              color: '#2e7d32',
              marginTop: '4px',
              paddingLeft: '20px',
            }}
          >
            <li>点击"文字输入"或"语音输入"按钮进行交互</li>
            <li>🎤 语音输入支持真实语音识别</li>
            <li>🔊 AI回复支持语音播放（MiniMax API + 浏览器TTS降级）</li>
            <li>🤖 集成真实Agent ABCD四人组系统</li>
            <li>🧪 支持完整通信测试</li>
            <li>10秒无操作自动返回首页</li>
          </ul>
        </div>

        {/* 语音状态指示器 */}
        <div
          style={{
            marginBottom: '16px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              backgroundColor: isRecognitionSupported() ? '#e8f5e9' : '#ffebee',
              color: isRecognitionSupported() ? '#2e7d32' : '#c62828',
            }}
          >
            🎤 语音识别: {isRecognitionSupported() ? '支持' : '不支持'}
          </div>
          <div
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              backgroundColor: isSynthesisSupported() ? '#e8f5e9' : '#ffebee',
              color: isSynthesisSupported() ? '#2e7d32' : '#c62828',
            }}
          >
            🔊 语音合成: {isSynthesisSupported() ? '支持' : '不支持'}
          </div>
          {isRecording && (
            <div
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                backgroundColor: '#fff3e0',
                color: '#ef6c00',
                animation: 'pulse 1.5s infinite',
              }}
            >
              🎤 录音中...
            </div>
          )}
          {isSpeaking && (
            <div
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                backgroundColor: '#e3f2fd',
                color: '#1565c0',
                animation: 'pulse 1.5s infinite',
              }}
            >
              🔊 播放中...
            </div>
          )}
        </div>

        <div className="chat-messages" style={{ marginBottom: '20px' }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.type === 'ai' ? 'flex-start' : 'flex-end',
                marginBottom: '12px',
                padding: '0 16px',
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  backgroundColor: msg.type === 'ai' ? '#f0f0f0' : '#1677ff',
                  color: msg.type === 'ai' ? '#000' : '#fff',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  wordBreak: 'break-word',
                  position: 'relative',
                }}
              >
                {msg.text}
                {/* AI回复添加语音播放按钮 */}
                {msg.type === 'ai' && isSynthesisSupported() && (
                  <button
                    onClick={() => playTextToSpeech(msg.text)}
                    disabled={isSpeaking}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'none',
                      border: 'none',
                      fontSize: '16px',
                      cursor: isSpeaking ? 'not-allowed' : 'pointer',
                      opacity: isSpeaking ? 0.5 : 0.7,
                      padding: '4px',
                    }}
                    title={isSpeaking ? '正在播放中...' : '点击播放语音'}
                  >
                    {isSpeaking ? '⏸️' : '🔊'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <Input
              value={input}
              onChange={setInput}
              placeholder="请输入文字..."
              style={{ flex: 1 }}
            />
            <Button
              onClick={() => {
                if (input.trim()) {
                  handleUserInteraction('text', input);
                  setInput('');
                }
              }}
            >
              发送
            </Button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {/* 真实语音输入按钮 */}
            <Button
              block
              onClick={handleVoiceInput}
              loading={isRecording}
              disabled={!isRecognitionSupported()}
              style={{
                backgroundColor: isRecording
                  ? '#9e9e9e'
                  : isRecognitionSupported()
                    ? '#4caf50'
                    : '#ccc',
                color: 'white',
                opacity: isRecognitionSupported() ? 1 : 0.6,
              }}
            >
              {isRecording
                ? '🛑 停止录音'
                : isRecognitionSupported()
                  ? '🎤 语音输入'
                  : '🎤 不支持'}
            </Button>
            <Button
              block
              onClick={() =>
                handleUserInteraction('text', '推荐一个红色文化景点')
              }
            >
              📝 快速体验
            </Button>
          </div>

          {/* 功能支持提示 */}
          {!isRecognitionSupported() && !isSynthesisSupported() && (
            <div
              style={{
                fontSize: '12px',
                color: '#666',
                textAlign: 'center',
                marginTop: '8px',
                padding: '8px',
                backgroundColor: '#fff3cd',
                borderRadius: '4px',
                border: '1px solid #ffeaa7',
              }}
            >
              💡 您的浏览器不支持语音功能，请使用文字输入。
            </div>
          )}
        </div>
      </div>

      {/* 测试结果面板 */}
      {showTestPanel && testResults && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '70vh',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: 2000,
            overflow: 'auto',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '16px' }}>🧪 通信测试结果</h3>
            <Button size="small" onClick={() => setShowTestPanel(false)}>
              关闭
            </Button>
          </div>

          <div style={{ padding: '16px' }}>
            <div style={{ marginBottom: '12px', fontSize: '14px' }}>
              <strong>总测试数:</strong> {testResults.totalTests} |
              <strong style={{ color: '#52c41a' }}>通过:</strong>{' '}
              {testResults.passedTests} |
              <strong style={{ color: '#ff4d4f' }}>失败:</strong>{' '}
              {testResults.failedTests} |<strong>耗时:</strong>{' '}
              {testResults.duration}ms
            </div>

            <div style={{ maxHeight: '300px', overflow: 'auto' }}>
              {testResults.results.map((result: any, index: number) => (
                <div
                  key={index}
                  style={{
                    padding: '8px',
                    marginBottom: '8px',
                    borderRadius: '4px',
                    backgroundColor:
                      result.status === 'pass' ? '#f6ffed' : '#fff2f0',
                    border: `1px solid ${result.status === 'pass' ? '#b7eb8f' : '#ffccc7'}`,
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {result.testName}:
                    <span
                      style={{
                        color: result.status === 'pass' ? '#52c41a' : '#ff4d4f',
                        marginLeft: '8px',
                      }}
                    >
                      {result.status === 'pass' ? '✅ 通过' : '❌ 失败'}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#666',
                      marginTop: '4px',
                    }}
                  >
                    {result.message} ({result.duration}ms)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ChatPageEnhanced;
