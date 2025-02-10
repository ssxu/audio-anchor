#!/bin/sh

# 输出环境变量以供调试
echo "Using RECOGN_API: ${RECOGN_API}"

# 生成运行时的环境配置
cat > /usr/share/nginx/html/env-config.js << EOF
window.env = {
  RECOGN_API: '${RECOGN_API}',
  NODE_ENV: 'production'
};
EOF

# 确保 env-config.js 文件存在且有正确的权限
chmod 644 /usr/share/nginx/html/env-config.js

# 输出 env-config.js 内容以供调试
echo "Generated env-config.js content:"
cat /usr/share/nginx/html/env-config.js

# 替换 index.html 中的占位符
sed -i "s|%PUBLIC_URL%|.|g" /usr/share/nginx/html/index.html

# 替换nginx配置文件中的环境变量
envsubst '${RECOGN_API}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# 验证 nginx 配置
nginx -t


# 启动nginx
exec nginx -g 'daemon off;' 