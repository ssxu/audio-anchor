import React, { useState, useRef } from 'react';
import './TranscriptionPlayer.css';
import { callTranscriptionAPI } from '../services/transcriptionService';

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
  </svg>
);

const LoadingIcon = () => (
  <svg className="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"/>
    <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
  </svg>
);

// 上传界面组件
const UploadScreen = ({ onUpload, isLoading, error, progress }) => (
  <div className="upload-screen">
    <div className="upload-container">
      <h2>上传音视频文件</h2>
      {!isLoading && (
        <div className="file-input-wrapper">
          <label className="upload-button">
            <UploadIcon />
            选择文件
            <input 
              type="file" 
              accept="video/*,audio/*" 
              onChange={onUpload}
              disabled={isLoading}
            />
          </label>
        </div>
      )}
      
      {isLoading && (
        <div className="processing-container">
          <div className="loading">
            <LoadingIcon />
            <span>正在处理中，请耐心等待...</span>
          </div>
          <div className="processing-steps">
            <div className={`step ${progress >= 1 ? 'completed' : 'active'}`}>
              1. 上传文件
            </div>
            <div className={`step ${progress >= 2 ? 'completed' : progress === 1 ? 'active' : ''}`}>
              2. 转录处理
            </div>
            <div className={`step ${progress >= 3 ? 'completed' : progress === 2 ? 'active' : ''}`}>
              3. 生成字幕
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {decodeUnicode(error)}
          <button className="retry-button" onClick={() => window.location.reload()}>
            重新上传
          </button>
        </div>
      )}
    </div>
  </div>
);

// 播放界面组件
const PlayerScreen = ({ file, transcription, onBack }) => {
  const [currentText, setCurrentText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const mediaRef = useRef(null);
  const listRef = useRef(null);
  const currentItemRef = useRef(null);

  const handleTimeUpdate = () => {
    if (transcription && mediaRef.current) {
      const currentTime = mediaRef.current.currentTime;
      const currentSegment = transcription.find(
        segment => currentTime >= segment.start && currentTime <= segment.end
      );
      
      if (currentSegment && currentSegment.text !== currentText) {
        setCurrentText(currentSegment.text);
        
        // 滚动到当前播放的文本
        const currentElement = document.querySelector('.transcription-item.active');
        if (currentElement && listRef.current) {
          listRef.current.scrollTo({
            top: currentElement.offsetTop - listRef.current.offsetHeight / 2,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  // 添加跳转功能
  const handleTranscriptionClick = (startTime) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = startTime;
      mediaRef.current.play(); // 自动开始播放
    }
  };

  // 修改复制功能
  const handleCopyAll = async () => {
    if (transcription) {
      // 只提取文字内容，用换行符分隔
      const allText = transcription
        .map(item => item.text)
        .join('\n');
      
      try {
        await navigator.clipboard.writeText(allText);
        setCopySuccess(true);
        // 3秒后重置复制成功状态
        setTimeout(() => setCopySuccess(false), 3000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  };

  return (
    <div className="player-screen">
      <div className="player-header">
        <button className="back-button" onClick={onBack}>
          返回上传
        </button>
      </div>
      
      <div className="player-content">
        <div className="player-left">
          <div className="media-player">
            {file.includes('video') ? (
              <video
                ref={mediaRef}
                src={file}
                controls
                onTimeUpdate={handleTimeUpdate}
              />
            ) : (
              <audio
                ref={mediaRef}
                src={file}
                controls
                onTimeUpdate={handleTimeUpdate}
              />
            )}
          </div>
          
          <div className="current-text">
            <h3>当前播放文字</h3>
            <div className="text-content">
              {currentText || '等待播放...'}
            </div>
          </div>
        </div>
        
        <div className="transcription-list">
          <div className="list-header">
            <h3>完整转录文本</h3>
            <button 
              className={`copy-button ${copySuccess ? 'success' : ''}`}
              onClick={handleCopyAll}
              disabled={copySuccess}
            >
              {copySuccess ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  已复制
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                  复制全部
                </>
              )}
            </button>
          </div>
          <div className="list-content" ref={listRef}>
            {transcription && transcription.map((item) => (
              <div 
                key={item.line}
                className={`transcription-item ${currentText === item.text ? 'active' : ''}`}
                onClick={() => handleTranscriptionClick(item.start)}
                ref={currentText === item.text ? currentItemRef : null}
              >
                <span className="time">
                  {formatTime(item.start)} - {formatTime(item.end)}
                </span>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 添加时间格式化函数
const formatTime = (seconds) => {
  const pad = (num) => String(num).padStart(2, '0');
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${pad(minutes)}:${pad(remainingSeconds)}`;
};

const decodeUnicode = (str) => {
  try {
    if (/[\u4e00-\u9fa5]/.test(str)) {
      return str;
    }
    return str.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) =>
      String.fromCharCode(parseInt(grp, 16))
    );
  } catch (e) {
    console.error('解码文字失败:', e);
    return str;
  }
};

const TranscriptionPlayer = () => {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(URL.createObjectURL(uploadedFile));
      setIsLoading(true);
      setError('');
      setProgress(0);
      
      try {
        // 更新上传进度
        setProgress(1);
        
        // 调用转录API
        setProgress(2);
        const response = await callTranscriptionAPI(uploadedFile);
        
        if (response.code !== 0) {
          throw new Error(response.msg);
        }

        // 处理返回数据
        const formattedTranscription = response.data.map(item => ({
          line: item.line,
          start: item.start_time / 1000,
          end: item.end_time / 1000,
          text: decodeUnicode(item.text)
        }));
        
        setTranscription(formattedTranscription);
        setProgress(3);
        
        // 延迟显示播放界面，让用户看到处理完成的状态
        setTimeout(() => {
          setShowPlayer(true);
        }, 1000);
        
      } catch (error) {
        setError(error.message);
        setFile(null);
      } finally {
        setIsLoading(false);
        setProgress(0);
      }
    }
  };

  const handleBack = () => {
    setFile(null);
    setTranscription(null);
    setError('');
    setShowPlayer(false);
  };

  return (
    <div className="transcription-player">
      {!showPlayer || error ? (
        <UploadScreen 
          onUpload={handleFileUpload}
          isLoading={isLoading}
          error={error}
          progress={progress}
        />
      ) : (
        <PlayerScreen 
          file={file}
          transcription={transcription}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default TranscriptionPlayer; 