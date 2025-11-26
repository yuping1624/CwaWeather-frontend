// API 基礎 URL
const API_BASE_URL = 'https://weather-new-taipei.zeabur.app/api/weather/city';

// 地點配置 - 所有22個縣市
const LOCATIONS = [
    { key: 'taipei', name: '臺北市', apiName: '臺北市' },
    { key: 'newtaipei', name: '新北市', apiName: '新北市' },
    { key: 'taoyuan', name: '桃園市', apiName: '桃園市' },
    { key: 'taichung', name: '臺中市', apiName: '臺中市' },
    { key: 'tainan', name: '臺南市', apiName: '臺南市' },
    { key: 'kaohsiung', name: '高雄市', apiName: '高雄市' },
    { key: 'keelung', name: '基隆市', apiName: '基隆市' },
    { key: 'hsinchu_city', name: '新竹市', apiName: '新竹市' },
    { key: 'hsinchu_county', name: '新竹縣', apiName: '新竹縣' },
    { key: 'miaoli', name: '苗栗縣', apiName: '苗栗縣' },
    { key: 'changhua', name: '彰化縣', apiName: '彰化縣' },
    { key: 'nantou', name: '南投縣', apiName: '南投縣' },
    { key: 'yunlin', name: '雲林縣', apiName: '雲林縣' },
    { key: 'chiayi_city', name: '嘉義市', apiName: '嘉義市' },
    { key: 'chiayi_county', name: '嘉義縣', apiName: '嘉義縣' },
    { key: 'pingtung', name: '屏東縣', apiName: '屏東縣' },
    { key: 'yilan', name: '宜蘭縣', apiName: '宜蘭縣' },
    { key: 'hualien', name: '花蓮縣', apiName: '花蓮縣' },
    { key: 'taitung', name: '臺東縣', apiName: '臺東縣' },
    { key: 'penghu', name: '澎湖縣', apiName: '澎湖縣' },
    { key: 'kinmen', name: '金門縣', apiName: '金門縣' },
    { key: 'lienchiang', name: '連江縣', apiName: '連江縣' }
];

// 當前選擇的地點
let currentLocation = 'newtaipei';

// 獲取當前API URL
function getApiUrl() {
    const location = LOCATIONS.find(loc => loc.key === currentLocation);
    if (location) {
        return `${API_BASE_URL}/${encodeURIComponent(location.apiName)}`;
    }
    return `${API_BASE_URL}/新北市`;
}

// 根據key獲取地點名稱
function getLocationName(key) {
    const location = LOCATIONS.find(loc => loc.key === key);
    return location ? location.name : '新北市';
}

// 創建飄落的櫻花瓣
function createSakuraPetals() {
    const container = document.getElementById('sakuraContainer');
    const petalCount = 15;
    
    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 3 + 4) + 's';
        petal.style.animationDelay = Math.random() * 2 + 's';
        petal.style.width = (Math.random() * 4 + 6) + 'px';
        petal.style.height = petal.style.width;
        container.appendChild(petal);
    }
}

// 地點選擇功能
function initLocationSelector() {
    const locationPill = document.getElementById('locationPill');
    const locationDropdown = document.getElementById('locationDropdown');
    const locationOptions = document.querySelectorAll('.location-option');

    // 點擊地點標籤顯示/隱藏下拉選單
    locationPill.addEventListener('click', function(e) {
        e.stopPropagation();
        locationDropdown.classList.toggle('show');
    });

    // 點擊選項切換地點
    locationOptions.forEach(option => {
        option.addEventListener('click', function() {
            const location = this.dataset.location;
            const name = this.dataset.name;
            
            // 更新當前地點
            currentLocation = location;
            
            // 更新顯示
            locationPill.textContent = `📍 ${name}`;
            
            // 更新選中狀態
            locationOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // 隱藏下拉選單
            locationDropdown.classList.remove('show');
            
            // 重新載入天氣資料
            loadWeather();
        });
    });

    // 點擊其他地方關閉下拉選單
    document.addEventListener('click', function(e) {
        if (!locationPill.contains(e.target) && !locationDropdown.contains(e.target)) {
            locationDropdown.classList.remove('show');
        }
    });
}

// 頁面載入時創建櫻花瓣和初始化地點選擇
document.addEventListener("DOMContentLoaded", function() {
    createSakuraPetals();
    initLocationSelector();
});

function getWeatherIcon(weather) {
    if (!weather) return "🌤️";
    if (weather.includes("晴")) return "☀️";
    if (weather.includes("多雲")) return "⛅";
    if (weather.includes("陰")) return "☁️";
    if (weather.includes("雨")) return "🌧️";
    if (weather.includes("雷")) return "⛈️";
    return "🌤️";
}

function getAdvice(rainProb, maxTemp) {
    let rainIcon = "🌸";
    let rainText = "散步無需擔憂";
    if (parseInt(rainProb) > 30) {
        rainIcon = "☔️";
        rainText = "記得帶上輕巧的小傘";
    }

    let clothIcon = "👘";
    let clothText = "微涼氣溫，舒適正好";
    if (parseInt(maxTemp) >= 28) {
        clothIcon = "🧢";
        clothText = "陽光熱情，請穿著透氣";
    } else if (parseInt(maxTemp) <= 20) {
        clothIcon = "🧣";
        clothText = "早晚偏涼，添一件暖衣";
    }

    return { rainIcon, rainText, clothIcon, clothText };
}

function getTimePeriod(startTime) {
    const hour = new Date(startTime).getHours();
    if (hour >= 5 && hour < 11) return "早晨";
    if (hour >= 11 && hour < 14) return "中午";
    if (hour >= 14 && hour < 18) return "下午";
    if (hour >= 18 && hour < 23) return "晚上";
    return "深夜";
}

function renderWeather(data) {
    const forecasts = data.forecasts;
    const current = forecasts[0];
    const others = forecasts.slice(1);

    // 1. 渲染 Hero Card (主畫面)
    const advice = getAdvice(current.rain, current.maxTemp);
    const period = getTimePeriod(current.startTime);
    const avgTemp = Math.round((parseInt(current.maxTemp) + parseInt(current.minTemp)) / 2);

    document.getElementById('heroCard').innerHTML = `
                <div class="hero-card">
                    <div class="hero-period">${period}</div>
                    <div class="hero-temp-container">
                        <div class="hero-icon">${getWeatherIcon(current.weather)}</div>
                        <div class="hero-temp">${avgTemp}°</div>
                    </div>
                    <div class="hero-desc">${current.weather}</div>
                    
                    <div class="advice-grid">
                        <div class="advice-item">
                            <div class="advice-icon">${advice.rainIcon}</div>
                            <div class="advice-text">${advice.rainText}</div>
                            <div style="font-size:0.7rem; color:var(--warm-gray); margin-top:3px;">降雨率 ${current.rain}</div>
                        </div>
                        <div class="advice-item">
                            <div class="advice-icon">${advice.clothIcon}</div>
                            <div class="advice-text">${advice.clothText}</div>
                            <div style="font-size:0.7rem; color:var(--warm-gray); margin-top:3px;">最高溫 ${current.maxTemp}°</div>
                        </div>
                    </div>
                </div>
            `;

    // 2. 渲染稍後預報 (包含明天判斷)
    const scrollContainer = document.getElementById('futureForecasts');
    scrollContainer.innerHTML = '';

    // 抓今天的日期數字 (例如 24)
    const todayDate = new Date().getDate();

    others.forEach(f => {
        let p = getTimePeriod(f.startTime);

        // 判斷該預報的日期是否跟今天不同，不同就是明天
        const fDate = new Date(f.startTime);
        if (fDate.getDate() !== todayDate) {
            p = "明天" + p;
        }

        scrollContainer.innerHTML += `
                    <div class="mini-card">
                        <div class="mini-time">${p}</div>
                        <div class="mini-icon">${getWeatherIcon(f.weather)}</div>
                        <div class="mini-temp">${f.minTemp}° - ${f.maxTemp}°</div>
                        <div style="font-size:0.8rem; color:var(--warm-gray); margin-top:5px;">💧${f.rain}</div>
                    </div>
                `;
    });

    // 3. 右上角顯示今日日期
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const dayIndex = now.getDay();
    const days = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

    document.getElementById('updateTime').textContent = `${month}月${date}日 ${days[dayIndex]}`;
}

// 載入天氣資料
async function loadWeather() {
    // 顯示載入畫面
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';

    try {
        // 1. 定義「最低等待時間」：1500 毫秒 (1.5秒)
        const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));

        // 2. 定義「抓取資料」的工作
        const apiUrl = getApiUrl();
        const fetchPromise = fetch(apiUrl).then(res => res.json());

        // 3. Promise.all 會等待「兩個都完成」才會往下走
        const [_, json] = await Promise.all([delayPromise, fetchPromise]);

        if (json.success) {
            renderWeather(json.data);

            // 資料處理好後，隱藏 Loading，顯示主畫面
            document.getElementById('loading').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
        } else {
            throw new Error("API Error");
        }
    } catch (e) {
        console.error(e);
        alert("天氣資料讀取失敗，請稍後再試！");
        // 即使失敗也隱藏載入畫面
        document.getElementById('loading').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    }
}

// 初始載入
document.addEventListener("DOMContentLoaded", function() {
    loadWeather();
});
