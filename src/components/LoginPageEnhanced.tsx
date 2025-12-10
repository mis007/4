// 增强版登录页 - 独立组件，不影响原有LoginPage
import React, { useState } from 'react';
import { Input, Button, Toast, NavBar, Card } from 'antd-mobile';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { SafeAgentWrapper } from '../services/safeAgentWrapper';

const LoginPageEnhanced = () => {
  const [phone, setPhone] = useState('13800138000'); // 演示账号
  const [code, setCode] = useState('123456'); // 演示验证码
  const [loading, setLoading] = useState(false);

  const safeAgent = new SafeAgentWrapper();

  const handleLogin = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      const loginData = {
        uid: 'demo_user_001',
        phone: phone,
        loginTime: new Date().toISOString(),
        registerTime: '2025-01-01T00:00:00Z',
        isWechatBound: false,
        isAlipayBound: false,
        loginMethod: 'sms',
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
        },
      };

      // 🎯 安全记录到黑板
      await safeAgent.safeRecordLogin(loginData);

      Toast.show({ content: '登录成功！', position: 'top' });

      // 模拟跳转
      setTimeout(() => {
        window.location.href = '/home';
      }, 1000);
    } catch (error) {
      console.error('登录失败:', error);
      Toast.show({ content: '登录失败，请重试', position: 'top' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <NavBar back={null}>
        <span>东里村文旅服务平台 - 增强版</span>
      </NavBar>

      <Card className="login-card" style={{ margin: '20px' }}>
        <div
          className="logo-section"
          style={{ textAlign: 'center', marginBottom: '20px' }}
        >
          <div
            className="avatar-large"
            style={{ fontSize: '48px', margin: '0 auto' }}
          >
            🏞️
          </div>
          <h2 style={{ marginTop: '10px' }}>东里村智能导游</h2>
        </div>

        <div className="form-section">
          <div
            style={{
              marginBottom: '16px',
              padding: '8px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
            }}
          >
            <span style={{ fontSize: '12px', color: '#1976d2' }}>
              演示账号已预填，可直接登录
            </span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Input
              type="tel"
              placeholder="请输入11位手机号"
              value={phone}
              onChange={setPhone}
              style={{ fontSize: '16px' }}
              clearable
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Input
              type="number"
              placeholder="6位验证码"
              value={code}
              onChange={setCode}
              style={{ fontSize: '16px' }}
              clearable
            />
          </div>

          <Button
            type="submit"
            color="primary"
            onClick={handleLogin}
            loading={loading}
            disabled={!phone || code.length !== 6}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            演示登录（带黑板记录）
          </Button>

          <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
            登录后将记录用户信息到黑板系统
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPageEnhanced;
