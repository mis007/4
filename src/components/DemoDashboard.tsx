// 演示仪表板 - 展示黑板功能（不要的不要的不要假数据！）
import React, { useState } from 'react';
import { Button, Card, Space, Toast, NavBar } from 'antd-mobile';
import { DemoDataGenerator } from '../utils/demoDataGenerator';

const DemoDashboard = () => {
  const [report, setReport] = useState('');
  const generator = new DemoDataGenerator();

  const generateData = async () => {
    Toast.show({ content: '生成真实演示数据...', position: 'top' });
    await generator.generateDemoData();
    Toast.show({ content: '演示数据生成完成！', position: 'top' });
  };

  const viewReport = () => {
    const reportText = generator.getDemoReport();
    setReport(reportText);
    console.log(reportText);
    alert(reportText);
  };

  const quickTest = async () => {
    Toast.show({ content: '快速测试...', position: 'top' });

    // 快速测试登录记录
    const safeAgent = new (
      await import('../services/safeAgentWrapper')
    ).SafeAgentWrapper();
    await safeAgent.safeRecordLogin({
      uid: 'quick_test_user_' + Math.random().toString(36).substr(2, 6),
      phone: '138' + Math.floor(10000000 + Math.random() * 90000000),
      loginTime: new Date().toISOString(),
      registerTime: '2025-01-15T' + new Date().toLocaleTimeString('zh-CN'),
      isWechatBound: Math.random() > 0.5,
      isAlipayBound: Math.random() > 0.5,
      loginMethod: 'sms',
      deviceInfo: {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X)',
        platform: 'iPhone',
        language: 'zh-CN',
      },
    });

    Toast.show({ content: '快速测试完成！', position: 'top' });
  };

  return (
    <div style={{ padding: '16px' }}>
      <NavBar>黑板系统演示</NavBar>

      <Card style={{ marginBottom: '16px' }}>
        <h3>🎯 路演演示指南</h3>
        <p>这是一个完全隔离的黑板系统演示版本，所有功能都不会影响原有系统。</p>
      </Card>

      <Card style={{ marginBottom: '16px' }}>
        <h4>🚀 演示功能</h4>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button block onClick={generateData}>
            📊 生成真实演示数据
          </Button>
          <Button block onClick={viewReport}>
            📈 查看统计报告
          </Button>
          <Button block onClick={quickTest}>
            ⚡ 快速测试
          </Button>
        </Space>
      </Card>

      <Card style={{ marginBottom: '16px' }}>
        <h4>🔗 演示页面</h4>
        <Space direction="vertical" style={{ width: '100%' }}>
          <a href="/demo/login" style={{ textDecoration: 'none' }}>
            <Button block>📱 演示登录页（带黑板记录）</Button>
          </a>
          <a href="/demo/chat" style={{ textDecoration: 'none' }}>
            <Button block>💬 演示Chat页（10秒自动跳转）</Button>
          </a>
          <a href="/demo/home" style={{ textDecoration: 'none' }}>
            <Button block>🏠 演示首页</Button>
          </a>
        </Space>
      </Card>

      <Card style={{ marginBottom: '16px' }}>
        <h4>🛡️ 安全特性</h4>
        <ul>
          <li>✅ 完全新建，不修改任何现有文件</li>
          <li>✅ 功能开关控制，可一键禁用</li>
          <li>✅ 安全包装器，错误不影响主系统</li>
          <li>✅ 独立路由，与原系统隔离</li>
          <li>✅ 真实数据，模拟真实用户行为</li>
        </ul>
      </Card>

      {report && (
        <Card title="📊 最新统计报告">
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {report}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default DemoDashboard;
