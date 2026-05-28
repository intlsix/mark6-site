#!/bin/bash
# ============================================================
# intlsix.com Vultr 一键部署脚本
# 用途：重装服务器后跑一遍即恢复全部服务
# 保存位置：GitHub 仓库 scripts/vultr-deploy.sh
# 用法：ssh root@<IP> 'bash -s' < scripts/vultr-deploy.sh
# ============================================================
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()  { echo -e "${RED}[ERR]${NC} $1"; exit 1; }

# ============================================================
# 配置区（改这里）
# ============================================================
DOMAIN="intlsix.com"
EMAIL="intlsix@outlook.com"
GIT_REPO="https://github.com/intlsix/mark6-site.git"
APP_DIR="/opt/site"
APP_NAME="intlsix"
NODE_VERSION="20.14.0"

echo "========================================"
echo " intlsix.com Vultr 部署"
echo " 目标服务器: $(hostname -I | awk '{print $1}')"
echo "========================================"

# ============================================================
# 1. 系统更新
# ============================================================
echo -e "\n${YELLOW}[1/9] 系统更新...${NC}"
apt update -qq && apt upgrade -y -qq
log "系统更新完成"

# ============================================================
# 2. 安装 Node.js
# ============================================================
echo -e "\n${YELLOW}[2/9] 安装 Node.js ${NODE_VERSION}...${NC}"
if command -v node &>/dev/null && [ "$(node -v)" = "v${NODE_VERSION}" ]; then
    log "Node.js 已安装 $(node -v)"
else
    wget -q "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz"
    tar -xf "node-v${NODE_VERSION}-linux-x64.tar.xz" -C /usr/local --strip-components=1
    rm -f "node-v${NODE_VERSION}-linux-x64.tar.xz"
    log "Node.js $(node -v) 安装完成"
fi

# ============================================================
# 3. 安装 nginx + git + PM2 + certbot
# ============================================================
echo -e "\n${YELLOW}[3/9] 安装 nginx/git/PM2/certbot...${NC}"
apt install -y -qq nginx git
npm install -g pm2 --silent
apt install -y -qq certbot python3-certbot-nginx 2>/dev/null || warn "certbot 安装跳过（可能已安装）"
log "基础包安装完成"

# ============================================================
# 4. 克隆项目
# ============================================================
echo -e "\n${YELLOW}[4/9] 克隆项目...${NC}"
if [ -d "$APP_DIR" ]; then
    cd "$APP_DIR" && git pull origin main
    log "项目已存在，已 pull 最新"
else
    cd /opt && git clone "$GIT_REPO" site
    log "项目克隆完成"
fi

# ============================================================
# 5. 构建项目
# ============================================================
echo -e "\n${YELLOW}[5/9] 安装依赖 + 构建...${NC}"
cd "$APP_DIR"
npm install --silent
NODE_OPTIONS="--max-old-space-size=1024" npm run build
log "构建完成"

# ============================================================
# 6. 配置 nginx
# ============================================================
echo -e "\n${YELLOW}[6/9] 配置 nginx...${NC}"
SERVER_IP=$(hostname -I | awk '{print $1}')

cat > "/etc/nginx/sites-available/${APP_NAME}" << NGINX
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN} ${SERVER_IP};

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # API routes: disable proxy buffering for live draw SSE
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_buffering off;
    }
}
NGINX

ln -sf "/etc/nginx/sites-available/${APP_NAME}" /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
log "nginx 配置完成"

# ============================================================
# 7. 启动 PM2
# ============================================================
echo -e "\n${YELLOW}[7/9] 启动 PM2...${NC}"
cd "$APP_DIR"
pm2 delete "$APP_NAME" 2>/dev/null || true
pm2 start npm --name "$APP_NAME" -- start
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true
log "PM2 启动完成"

# ============================================================
# 8. 防火墙
# ============================================================
echo -e "\n${YELLOW}[8/9] 配置防火墙...${NC}"
ufw --force enable 2>/dev/null || true
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
# belt-and-suspenders iptables
iptables -I INPUT -p tcp --dport 80 -j ACCEPT 2>/dev/null || true
iptables -I INPUT -p tcp --dport 443 -j ACCEPT 2>/dev/null || true
log "防火墙配置完成"

# ============================================================
# 9. SSL 证书
# ============================================================
echo -e "\n${YELLOW}[9/9] 申请 SSL 证书...${NC}"
# 先验证 DNS 解析到本机
DNS_IP=$(python3 -c "import socket; print(socket.getaddrinfo('${DOMAIN}', 80)[0][4][0])" 2>/dev/null || echo "")
if [ "$DNS_IP" = "$SERVER_IP" ]; then
    certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" \
        --non-interactive --agree-tos --email "${EMAIL}" 2>&1 | tail -3
    log "SSL 证书申请成功"
else
    warn "DNS 未指向本机 (当前: ${DNS_IP:-无法解析})，跳过 SSL"
    warn "等 DNS 生效后运行: certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
fi

# ============================================================
# 安装 auto-deploy cron
# ============================================================
echo -e "\n${YELLOW}[+] 安装自动部署 cron...${NC}"

cat > /opt/auto-deploy.sh << 'AUTODEPLOY'
#!/bin/bash
cd /opt/site
git fetch origin main 2>/dev/null
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
if [ "$LOCAL" != "$REMOTE" ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S'): New commits detected, deploying..."
  git pull origin main
  npm install --silent 2>&1 | tail -1
  NODE_OPTIONS="--max-old-space-size=1024" npm run build 2>&1 | tail -5
  pm2 restart intlsix
  echo "$(date '+%Y-%m-%d %H:%M:%S'): Deploy done."
fi
AUTODEPLOY

chmod +x /opt/auto-deploy.sh
(crontab -l 2>/dev/null | grep -v 'auto-deploy.sh'; echo '*/5 * * * * /opt/auto-deploy.sh >> /var/log/auto-deploy.log 2>&1') | crontab -
log "自动部署 cron 已安装（每5分钟）"

# ============================================================
# 安装香港开奖采集 cron
# ============================================================
echo -e "\n${YELLOW}[+] 安装香港开奖采集 cron...${NC}"

cat > /opt/fetch_hk_draws.py << 'HKFETCH'
#!/usr/bin/env python3
"""香港开奖数据采集脚本 — 从 tbjl.sxhwqc.com 抓取最新开奖"""
import json, re, sys, urllib.request, os
from datetime import datetime

HK_URL = "https://tbjl.sxhwqc.com:2025/hk.html"
DRAWS_FILE = "/opt/site/src/data/hongkong/draws.json"

def fetch():
    req = urllib.request.Request(HK_URL, headers={"User-Agent": "Mozilla/5.0"})
    try:
        # Ignore SSL cert issues for this specific domain
        ctx = __import__('ssl')._create_unverified_context()
        with urllib.request.urlopen(req, timeout=30, context=ctx) as resp:
            html = resp.read().decode("gb18030", errors="replace")
    except Exception as e:
        print(f"FETCH FAIL: {e}")
        return None
    return html

def parse(html):
    """Extract draw numbers from HTML.
    Format expected: issue numbers in a table/div structure.
    This is a best-effort parser; adjust regex based on actual HTML structure.
    """
    results = []
    # Try to find issue numbers (YYYY-NNN format)
    issue_matches = re.findall(r'(\d{4}-\d{3})', html)
    # Try to find numbers (1-49)
    num_matches = re.findall(r'\b([1-9]|[1-4]\d|49)\b', html)
    
    # Simple approach: group numbers in sets of 7 (6 regular + 1 special)
    # after each issue ID encountered
    nums = [int(x) for x in num_matches]
    for i, issue_id in enumerate(issue_matches):
        start = i * 7
        if start + 7 <= len(nums):
            numbers = nums[start:start+6]
            special = nums[start+6]
            results.append({
                "id": issue_id,
                "drawAt": f"{issue_id[:4]}-01-01",  # placeholder, admin fills real date
                "numbers": numbers,
                "special": special,
                "source": "auto"
            })
    return results

def save(draws):
    os.makedirs(os.path.dirname(DRAWS_FILE), exist_ok=True)
    
    # Read existing
    existing = []
    if os.path.exists(DRAWS_FILE):
        with open(DRAWS_FILE) as f:
            existing = json.load(f)
    
    # Merge: don't duplicate
    existing_ids = {d["id"] for d in existing}
    new_added = 0
    for d in draws:
        if d["id"] not in existing_ids:
            existing.append(d)
            new_added += 1
    
    if new_added:
        with open(DRAWS_FILE, "w") as f:
            json.dump(existing, f, indent=2, ensure_ascii=False)
    
    return new_added

if __name__ == "__main__":
    html = fetch()
    if not html:
        sys.exit(1)
    draws = parse(html)
    added = save(draws)
    print(f"{datetime.now().isoformat()}: {added} new draws saved")
HKFETCH

chmod +x /opt/fetch_hk_draws.py
# HK draw cron: Tue/Thu/Sat at 21:35 Beijing (13:35 UTC)
(crontab -l 2>/dev/null | grep -v 'fetch_hk_draws.py'; echo '35 13 * * 2,4,6 python3 /opt/fetch_hk_draws.py >> /var/log/hk-fetch.log 2>&1') | crontab -
log "香港开奖采集 cron 已安装（周二/四/六 21:35 北京）"

# ============================================================
# 完成
# ============================================================
echo ""
echo "========================================"
echo -e " ${GREEN}部署完成！${NC}"
echo ""
echo " 站点:     https://${DOMAIN}"
echo " 进程:     pm2 status"
echo " 日志:     pm2 logs ${APP_NAME}"
echo " 自动部署: tail -f /var/log/auto-deploy.log"
echo " 采集日志: tail -f /var/log/hk-fetch.log"
echo ""
echo " 如 SSL 未申请，DNS 生效后运行："
echo "   certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo "========================================"
