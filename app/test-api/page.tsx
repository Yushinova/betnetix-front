'use client';

import { useState } from 'react';
import { authApi } from '@/services/authApi';
import { adminApi } from '@/services/adminApi';
import { userApi } from '@/services/userApi';
import { postApi } from '@/services/postApi';
import { commentApi } from '@/services/commentApi';

export default function TestAPIPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ========== ТЕСТЫ AUTH ==========
  
  const testLogin = async () => {
    setLoading(true);
    try {
      const data = await authApi.login({ username: 'emilys', password: 'emilyspass' });
      console.log('Логин:', data);
      setResult(data);
      alert(`✅ Логин успешен! Токен: ${data.token?.substring(0, 30)}...`);
    } catch (error: any) {
      console.error(error);
      alert(`❌ Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ========== ТЕСТЫ USER API ==========

  const testGetAllUsers = async () => {
    setLoading(true);
    try {
      const data = await userApi.getAllUsers(10, 0);
      console.log('Все пользователи:', data);
      setResult(data);
      alert(`✅ Всего пользователей: ${data.total}`);
    } catch (error: any) {
      console.error(error);
      alert(`❌ Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetUsersWithStats = async () => {
    setLoading(true);
    try {
      const data = await userApi.getUsersWithStats(5, 0);
      console.log('Пользователи со статистикой:', data);
      setResult(data);
      alert(`✅ Получено ${data.users.length} пользователей со статистикой`);
    } catch (error: any) {
      console.error(error);
      alert(`❌ Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ========== ТЕСТЫ ADMIN API ==========

  const testGetAdmins = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAdmins(10, 0);
      console.log('Администраторы:', data);
      setResult(data);
      alert(`✅ Администраторов: ${data.total}`);
    } catch (error: any) {
      console.error(error);
      alert(`❌ Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ========== ТЕСТЫ POST API ==========

  const testGetAllPosts = async () => {
    setLoading(true);
    try {
      const data = await postApi.getPosts(5, 0);
      console.log('Все посты:', data);
      setResult(data);
      alert(`✅ Всего постов: ${data.total}`);
    } catch (error: any) {
      console.error(error);
      alert(`❌ Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testSearchPosts = async () => {
    setLoading(true);
    try {
      const data = await postApi.searchPosts('love', 5, 0);
      console.log('Поиск постов "love":', data);
      setResult(data);
      alert(`✅ Найдено постов: ${data.total}`);
    } catch (error: any) {
      console.error(error);
      alert(`❌ Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetPostsWithDetails = async () => {
    setLoading(true);
    try {
      const data = await postApi.getPostsWithDetails(5, 0);
      console.log('Посты с деталями:', data);
      setResult(data);
      alert(`✅ Получено ${data.posts.length} постов с авторами и комментариями`);
    } catch (error: any) {
      console.error(error);
      alert(`❌ Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ========== ТЕСТЫ COMMENT API ==========

  const testGetPostComments = async () => {
    setLoading(true);
    try {
      const data = await commentApi.getPostComments(1, 10, 0);
      console.log('Комментарии к посту 1:', data);
      setResult(data);
      alert(`✅ Комментариев: ${data.total}`);
    } catch (error: any) {
      console.error(error);
      alert(`❌ Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetAllComments = async () => {
    setLoading(true);
    try {
      const data = await commentApi.getAllComments(10, 0);
      console.log('Все комментарии:', data);
      setResult(data);
      alert(`✅ Всего комментариев: ${data.total}`);
    } catch (error: any) {
      console.error(error);
      alert(`❌ Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Тестирование API</h1>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        
        {/* Auth */}
        <button onClick={testLogin} disabled={loading} style={buttonStyle}>
          🔐 Логин
        </button>

        <hr style={{ width: '100%', margin: '10px 0' }} />

        {/* User API */}
        <button onClick={testGetAllUsers} disabled={loading} style={buttonStyle}>
          👥 Все пользователи
        </button>
        
        <button onClick={testGetUsersWithStats} disabled={loading} style={buttonStyle}>
          📊 Пользователи со статистикой
        </button>

        <hr style={{ width: '100%', margin: '10px 0' }} />

        {/* Admin API */}
        <button onClick={testGetAdmins} disabled={loading} style={buttonStyle}>
          👑 Администраторы
        </button>

        <hr style={{ width: '100%', margin: '10px 0' }} />

        {/* Post API */}
        <button onClick={testGetAllPosts} disabled={loading} style={buttonStyle}>
          📝 Все посты
        </button>
        
        <button onClick={testSearchPosts} disabled={loading} style={buttonStyle}>
          🔍 Поиск постов
        </button>
        
        <button onClick={testGetPostsWithDetails} disabled={loading} style={buttonStyle}>
          📰 Посты с деталями
        </button>

        <hr style={{ width: '100%', margin: '10px 0' }} />

        {/* Comment API */}
        <button onClick={testGetPostComments} disabled={loading} style={buttonStyle}>
          💬 Комментарии поста
        </button>
        
        <button onClick={testGetAllComments} disabled={loading} style={buttonStyle}>
          📋 Все комментарии
        </button>
      </div>

      {loading && <div>⏳ Загрузка...</div>}

      {result && (
        <div style={resultStyle}>
          <h3>Результат:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
};

const resultStyle = {
  marginTop: '20px',
  padding: '15px',
  backgroundColor: '#f5f5f5',
  borderRadius: '5px',
  overflow: 'auto',
  maxHeight: '500px',
};