// 移除 config 导入，因为我们直接使用代理
// import config from '../config/config';

// 简化 getApiUrl 函数
const getApiUrl = () => {
  // 在开发环境中使用代理
  if (process.env.NODE_ENV === 'development') {
    return '/api';
  }
  
  // 在生产环境中使用环境变量中配置的地址
  return '/api';
};

export const callTranscriptionAPI = async (file) => {
  const formData = new FormData();
  formData.append('audio', file);

  try {
    const response = await fetch('/api/api', {  // 直接使用 /api 前缀
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('转录请求失败');
    }

    const result = await response.json();
    if (result.code !== 0) {
      throw new Error(result.msg || '转录请求失败');
    }

    return result;
  } catch (error) {
    console.error('转录出错:', error);
    throw error;
  }
};

// 辅助函数：将时间字符串转换为秒数
export const timeStringToSeconds = (timeStr) => {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  const [secs, ms] = seconds.toString().split(',').map(Number);
  return hours * 3600 + minutes * 60 + secs + ms / 1000;
};

export const fetchTranscription = async (fileId) => {
  try {
    const response = await fetch(`/api/transcription/${fileId}`);  // 直接使用 /api 前缀
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching transcription:', error);
    throw error;
  }
};