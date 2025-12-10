import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './global.css';
import { AgentA } from '../services/agentSystem';
import { BlackboardManager } from '../services/blackboardManager';
import { featureFlags } from '../config/featureFlags';

/**
 * 聊天页 - 外墙直接抄的旧代码
 */
const ChatPage = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      text: '您好！我是村官小助理 🌿\n\n可为您提供：\n1. 红色景点介绍\n2. 游玩路线推荐\n3. 村史文化讲解\n4. 最新动态查询',
    },
  ]);

  // 初始化黑板管理器
  const blackboard = BlackboardManager.getInstance();

  // 获取当前会话ID
  const getCurrentSessionId = () => {
    let sessionId = sessionStorage.getItem('chatSessionId');
    if (!sessionId) {
      sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('chatSessionId', sessionId);
    }
    return sessionId;
  };

  // 获取当前用户ID
  const getCurrentUserId = () => {
    return sessionStorage.getItem('userId') || 'demo_user_001';
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = {
      type: 'user',
      text: input,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // 🎯 对接真实Agent ABCD四人组系统
      const startTime = Date.now();
      const uid = getCurrentUserId();
      const contextSpot = '东里村'; // 当前景点上下文

      console.log(`🚀 调用Agent系统: uid=${uid}, input="${userInput}"`);

      const response = await AgentA.processUserRequest(
        uid,
        userInput,
        contextSpot,
        'text'
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

      const aiMsg = {
        type: 'assistant',
        text: responseText,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);

      // 🎯 记录到黑板（如果启用）
      if (featureFlags.enableBlackboard) {
        await blackboard.recordUserInteraction({
          userInput,
          agentResponse: responseText,
          responseTime,
          timestamp: Date.now(),
          sessionId: getCurrentSessionId(),
          page: 'chat',
          uid,
        });
      }

      console.log(`✅ Agent响应成功: ${responseTime}ms`);
    } catch (error) {
      console.error('❌ Agent系统调用失败:', error);

      // 🎯 优雅降级 - 友好的错误提示
      const errorMsg = {
        type: 'assistant',
        text: '抱歉，我暂时无法回复您的问题。请稍后再试，或者您可以尝试换个方式提问 🤔\n\n您也可以点击上方"跳过"按钮继续浏览其他内容。',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);

      // 记录错误到黑板
      if (featureFlags.enableBlackboard) {
        await blackboard.recordAgentResponse({
          userInput,
          agentASuccess: false,
          apiCallSuccess: false,
          signalToBSuccess: false,
          errorDetails: error instanceof Error ? error.message : String(error),
          timestamp: Date.now(),
          uid: getCurrentUserId(),
          sessionId: getCurrentSessionId(),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '480px',
        minHeight: '100vh',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* 骚包背景 - 直接抄的 */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, #ecfdf5 0%, #fff 50%, #f0fdfa 100%)',
          }}
        />
        <div
          className="pulse"
          style={{
            position: 'absolute',
            top: '-10vw',
            right: '-10vw',
            width: '40vw',
            height: '40vw',
            maxWidth: '200px',
            maxHeight: '200px',
            background: 'rgba(16,185,129,0.12)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="grid-bg"
          style={{ position: 'absolute', inset: 0, opacity: 0.3 }}
        />
      </div>

      {/* 导航栏 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            className="avatar-sm"
            style={{
              width: 'clamp(30px, 10vw, 40px)',
              height: 'clamp(30px, 10vw, 40px)',
              background: 'linear-gradient(135deg, #10b981, #14b8a6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            🧑‍💼
          </div>
          <div>
            <div
              style={{ fontSize: '15px', fontWeight: 'bold', color: '#1f2937' }}
            >
              村官小助理
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>在线</div>
          </div>
        </div>
        <button
          className="btn"
          onClick={() => navigate('/category')}
          style={{ padding: '8px 16px', fontSize: '14px' }}
        >
          跳过
        </button>
      </div>

      {/* 聊天区域 - 直接抄的 */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 160px)',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.type}`}
            style={{
              alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {msg.text.split('\n').map((line, j) => (
              <div key={j}>{line}</div>
            ))}
          </div>
        ))}
        {isLoading && (
          <div
            className="message assistant"
            style={{ alignSelf: 'flex-start' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #10b981',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              ></div>
              <span>AI导游正在思考中...</span>
            </div>
          </div>
        )}
      </div>

      {/* 输入区域 - 直接抄的 */}
      <div
        style={{
          padding: '16px',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="和小叶子聊聊..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button
            className="btn"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            style={{
              opacity: isLoading || !input.trim() ? 0.6 : 1,
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? '发送中...' : '发送'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
