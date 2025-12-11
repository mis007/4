/**
 * 🔒 CRITICAL_DO_NOT_DELETE - 登录页组件
 * 
 * 东里村智能导游系统 - 现代化登录页
 * 
 * 设计理念：
 * - 军工品质：严谨、统一、规范
 * - 用户体验：简洁、直观、友好
 * - 安全性：手机验证码登录
 * - 响应式设计：适配所有设备
 * - 性能优化：懒加载和缓存
 * 
 * @author 东里村开发团队
 * @version 2.0.0
 * @since 2025-12-08
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Card as AntdCard, Typography, Space, message, Checkbox } from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  SafetyOutlined,
  EyeInvisibleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { VillageColors, Spacing, BorderRadius } from '../../styles/theme';
import { authApi } from '../../services/apiService';

// Fix for JSX element type 'Card' does not have any construct or call signatures
const Card = AntdCard as any;

const { Title, Text, Link } = Typography;

interface VillageLoginPageProps {}

interface LoginFormData {
  phone: string;
  code: string;
  rememberMe: boolean;
}

/**
 * 🎯 现代化登录页组件 - 军工品质设计
 * 
 * 特点：
 * - 手机验证码登录
 * - 记住登录状态
 * - 安全验证
 * - 用户友好的错误提示
 * - 响应式设计
 * - 性能优化
 */
export const VillageLoginPage: React.FC<VillageLoginPageProps> = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginFormData>();
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Removed handleSubmit destructuring as it's not on FormInstance

  // 🎯 表单验证规则
  const validatePhone = useCallback((_: any, value: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error('请输入正确的手机号码'));
    }
    return Promise.resolve();
  }, []);

  const validateCode = useCallback((_: any, value: string) => {
    if (!value || value.length !== 6) {
      return Promise.reject(new Error('请输入6位验证码'));
    }
    return Promise.resolve();
  }, []);

  // 🎯 发送验证码
  const handleSendCode = useCallback(async (values: LoginFormData) => {
    try {
      setLoading(true);
      
      // 调用真实API发送验证码
      const response = await authApi.sendCode(values.phone);
      
      if (response.success) {
        message.success('验证码已发送');
        setCodeSent(true);
        
        // 开始倒计时
        let count = 60;
        setCountdown(count);
        
        const timer = setInterval(() => {
          count--;
          setCountdown(count);
          
          if (count <= 0) {
            clearInterval(timer);
            setCodeSent(false);
          }
        }, 1000);
        
        // 保存倒计时状态
        localStorage.setItem('login_countdown', Date.now().toString());
      } else {
        message.error(response.error || '发送验证码失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  // 🎯 登录处理
  const handleLogin = useCallback(async (values: LoginFormData) => {
    try {
      setLoading(true);
      
      // 调用真实API进行登录
      const response = await authApi.login(values.phone, values.code);
      
      if (response.success) {
        message.success('登录成功');
        
        // 保存用户信息和token
        localStorage.setItem('user-token', (response.data as any).token);
        localStorage.setItem('user-info', JSON.stringify((response.data as any).user));
        
        // 记住登录状态
        if (values.rememberMe) {
          localStorage.setItem('remember-login', 'true');
        }
        
        // 跳转到首页
        navigate('/');
      } else {
        message.error(response.error || '登录失败');
      }
    } catch (error) {
      message.error('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  // 🎯 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('user-token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  // 🎯 恢复倒计时状态
  useEffect(() => {
    const savedCountdown = localStorage.getItem('login_countdown');
    if (savedCountdown) {
      const elapsed = Date.now() - parseInt(savedCountdown);
      const remaining = Math.max(0, 60 - Math.floor(elapsed / 1000));
      
      if (remaining > 0) {
        setCodeSent(true);
        setCountdown(remaining);
        
        const timer = setInterval(() => {
          const newRemaining = Math.max(0, remaining - 1);
          setCountdown(newRemaining);
          
          if (newRemaining <= 0) {
            clearInterval(timer);
            setCodeSent(false);
            localStorage.removeItem('login_countdown');
          }
        }, 1000);
      }
    }
  }, []);

  return (
    <div className="village-login-page">
      <div className="login-container">
        <Card 
          className="login-card"
          style={{
            background: `linear-gradient(135deg, ${VillageColors.red.primary}dd 0%, ${VillageColors.red.primary} 0%)`,
            borderColor: VillageColors.red.primary,
            borderRadius: BorderRadius.xl,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="login-header">
            <div className="logo-section">
              <div 
                className="logo"
                style={{ 
                  background: `linear-gradient(135deg, ${VillageColors.gold.light} 0%, ${VillageColors.gold.primary} 100%)`,
                  borderRadius: BorderRadius.circle,
                }}
              >
                <span className="logo-text">东里村</span>
              </div>
              <Title level={2} className="login-title">
                智能导游系统
              </Title>
              <Text className="login-subtitle">
                红色文化 · 生态旅游 · 智能导览
              </Text>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            size="large"
            onFinish={handleLogin}
            className="login-form"
          >
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: '请输入手机号码' },
                { validator: validatePhone },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="请输入手机号码"
                size="large"
                style={{
                  borderRadius: BorderRadius.md,
                }}
              />
            </Form.Item>

            <Form.Item
              name="code"
              rules={[
                { required: true, message: '请输入验证码' },
                { validator: validateCode },
              ]}
            >
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  prefix={<SafetyOutlined />}
                  placeholder="请输入验证码"
                  size="large"
                  maxLength={6}
                  style={{
                    borderRadius: BorderRadius.md,
                    flex: 1,
                  }}
                />
                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  disabled={!codeSent || countdown > 0}
                  onClick={() => form.getFieldValue('phone') && handleSendCode(form.getFieldsValue() as LoginFormData)}
                  style={{
                    background: VillageColors.green.primary,
                    borderColor: VillageColors.green.primary,
                    borderRadius: BorderRadius.md,
                    minWidth: '100px',
                  }}
                >
                  {codeSent ? `${countdown}s` : '获取验证码'}
                </Button>
              </Space.Compact>
            </Form.Item>

            <Form.Item name="rememberMe">
              <Checkbox 
                defaultChecked={localStorage.getItem('remember-login') === 'true'}
                style={{ color: '#ffffff' }}
              >
                记住登录状态
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                disabled={!codeSent}
                style={{
                  background: VillageColors.red.primary,
                  borderColor: VillageColors.red.primary,
                  borderRadius: BorderRadius.lg,
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          <div className="login-footer">
            <Space direction="vertical" size="small" style={{ color: '#ffffff' }}>
              <div className="footer-item">
                <SafetyOutlined />
                <Text type="secondary">您的信息将被安全保护</Text>
              </div>
              <div className="footer-item">
                <PhoneOutlined />
                <Text type="secondary">验证码有效期为5分钟</Text>
              </div>
              <div className="footer-item">
                <EyeInvisibleOutlined />
                <Text type="secondary">我们不会保存您的密码</Text>
              </div>
            </Space>
          </div>
        </Card>
      </div>

      {/* 🎯 背景装饰 */}
      <div className="login-background">
        <div className="bg-pattern"></div>
      </div>
    </div>
  );
};

export default VillageLoginPage;