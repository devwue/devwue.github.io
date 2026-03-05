<template>
  <div class="map-widget">

    <!-- 헤더 -->
    <div class="widget-header">
      <div class="header-left">
        <span class="header-icon">📍</span>
        <div>
          <h2 class="header-title">우리 동네 핫플레이스</h2>
          <p class="header-sub">핀을 클릭하면 상세정보를 볼 수 있어요</p>
        </div>
      </div>
      <button class="my-location-btn" @click="goToMyLocation" :class="{ locating }">
        <span v-if="!locating">🎯 내 위치</span>
        <span v-else>📡 찾는 중…</span>
      </button>
    </div>

    <!-- 카테고리 필터 -->
    <div class="filter-bar">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="filter-btn"
        :class="{ active: selectedCategory === cat.id }"
        @click="selectCategory(cat.id)"
      >
        {{ cat.icon }} {{ cat.label }}
        <span class="filter-count">{{ countByCategory(cat.id) }}</span>
      </button>
    </div>

    <!-- 지도 (전체 너비) -->
    <div class="map-wrap">
      <div ref="mapRef" class="kakao-map"></div>

      <!-- 핀 클릭 팝업 -->
      <transition name="popup">
        <div v-if="selectedPlace" class="place-popup">
          <button class="popup-close" @click="selectedPlace = null">✕</button>

          <div class="popup-header">
            <span class="popup-icon">{{ selectedPlace.icon }}</span>
            <div>
              <div class="popup-name">{{ selectedPlace.name }}</div>
              <span class="popup-cat-tag">{{ selectedPlace.categoryLabel }}</span>
            </div>
            <span v-if="selectedPlace.rating" class="popup-rating">⭐ {{ selectedPlace.rating }}</span>
          </div>

          <div class="popup-details">
            <div class="popup-row">📍 {{ selectedPlace.address }}</div>
            <div v-if="selectedPlace.hours" class="popup-row">🕐 {{ selectedPlace.hours }}</div>
            <div v-if="selectedPlace.note" class="popup-note">💬 {{ selectedPlace.note }}</div>
          </div>

          <a
            class="popup-naver-btn"
            :href="`https://map.naver.com/search?query=${encodeURIComponent(selectedPlace.name + ' 하남')}`"
            target="_blank"
            rel="noopener"
          >
            <span class="naver-logo">N</span> 네이버 지도로 보기
          </a>
        </div>
      </transition>

      <!-- 내 위치 배지 -->
      <div v-if="myLocationVisible" class="my-loc-badge">📡 내 위치 표시 중</div>

      <!-- 지도 클릭 시 팝업 닫기 안내 (팝업 열려있을 때) -->
      <div v-if="selectedPlace" class="map-backdrop" @click="selectedPlace = null" />
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'

interface Place {
  id: number
  name: string
  category: string
  categoryLabel: string
  icon: string
  lat: number
  lng: number
  address: string
  hours?: string
  rating?: number
  note?: string
}

declare global {
  interface Window { kakao: any }
}

const KAKAO_APP_KEY = 'd8b5e66858241f433f873d66de1b39a9'

const PLACES: Place[] = [
  {
    id: 3, name: '강동 이케아', category: 'shopping', categoryLabel: '쇼핑', icon: '👔',
    lat: 37.567053, lng: 127.156930,
    address: '강동구 고덕비즈밸리로6길 51', hours: '11:00 ~ 21:00', rating: 4.3,
    note: '각종 쇼핑이 가능, 이케아/롯데/이마트 다있음',
  },
  {
    id: 6, name: '하늘공원', category: 'park', categoryLabel: '공원', icon: '🏞️',
    lat: 37.578899, lng: 127.183340,
    address: '경기도 하남시 선동 417', hours: '09:00 ~ 20:00', rating: 4.8,
    note: '미사 북쪽 산책 마무리, 한강뷰',
  },
  {
    id: 6, name: '파스쿠찌 하남스카이폴리스점', category: 'cafe', categoryLabel: '카페', icon: '☕',
    lat: 37.576663, lng: 127.191861,
    address: '경기도 하남시 미사강변한강로 135 스카이폴리스', hours: '09:00 ~ 20:00', rating: 4.8,
    note: '스카이 폴리스내 카페, 산책하기 좋음',
  },
  {
    id: 7, name: '하나로마트', category: 'shopping', categoryLabel: '쇼핑', icon: '🛒',
    lat: 37.569929, lng: 127.196186,
    address: '경기 하남시 미사강변한강로 220', hours: '평일 09:00 ~ 18:00',
    note: '주차공간 지상, 넓음',
  },
  {
    id: 7, name: '도서관', category: 'admin', categoryLabel: '행정', icon: '📚',
    lat: 37.56766, lng: 127.18737,
    address: '경기도 하남시 아리수로 545', hours: '평일 09:00 ~ 18:00',
    note: '매주 화요일 휴무, 주차공간 지상, 넓음',
  },
  {
    id: 8, name: '미사2동 행정복지센터', category: 'admin', categoryLabel: '행정', icon: '🏛️',
    lat: 37.5671338, lng: 127.1860375,
    address: '경기 하남시 아리수로 531', hours: '평일 09:00 ~ 18:00',
    note: '주차공간 지상/지하, 좁음',
  },
  {
    id: 8, name: '물놀이 공원', category: 'park', categoryLabel: '공원', icon: '🛝',
    lat: 37.5671338, lng: 127.1860375,
    address: '경기 하남시 아리수로 531', hours: '평일 09:00 ~ 18:00',
    note: '주차공간 지상/지하, 좁음',
  },
  {
    id: 4, name: '한채당', category: 'restaurant', categoryLabel: '식당', icon: '🥘',
    lat: 37.570838, lng: 127.201589,
    address: '경기도 하남시 미사동로 38-1', hours: '11:30 ~ 21:30', rating: 4.5,
    note: '가성비 좋은 한정식집. 룸도 있어서 가족 외식하기 좋음',
  },
  {
    id: 4, name: '미사리 조정경기장 공원', category: 'park', categoryLabel: '공원', icon: '🌊',
    lat: 37.5614, lng: 127.2060,
    address: '경기도 하남시 미사대로 505', hours: '05:00 ~ 20:00', rating: 4.5,
    note: '한강 옆 조용한 산책 명소. 봄 벚꽃이 특히 아름다움',
  },
  {
    id: 2, name: '이마트', category: 'shopping', categoryLabel: '쇼핑', icon: '🛒',
    lat: 37.5527, lng: 127.2054,
    address: '경기도 하남시 덕풍서로 70', hours: '10:00 ~ 23:00', rating: 4.1,
    note: '풍산지구 생필품 쇼핑. 피자 세일 행사 자주 함',
  },
  {
    id: 1, name: '스타필드 하남', category: 'shopping', categoryLabel: '쇼핑', icon: '🛍️',
    lat: 37.5454, lng: 127.2239,
    address: '경기도 하남시 미사대로 750', hours: '10:00 ~ 22:00', rating: 4.3,
    note: '마트·식당·영화관 모두 한 곳에! 주말엔 일찍 가야 주차 가능',
  },

]

export default defineComponent({
  name: 'DailyMap',
  setup() {
    const mapRef = ref<HTMLElement | null>(null)
    const selectedPlace = ref<Place | null>(null)
    const selectedCategory = ref('all')
    const locating = ref(false)
    const myLocationVisible = ref(false)

    let kakaoMap: any = null
    let overlays: any[] = []
    let myMarker: any = null
    let myCircle: any = null

    const categories = [
      { id: 'all',      icon: '🗺️', label: '전체' },
      { id: 'shopping', icon: '🛍️', label: '쇼핑' },
      { id: 'nature',   icon: '🌿', label: '자연' },
      { id: 'cafe',     icon: '☕', label: '카페' },
      { id: 'admin',    icon: '🏛️', label: '행정' },
      { id: 'restaurant', icon: '🥘', label: '식당' },
      { id: 'park', icon: '🌳', label: '공원' },
    ]

    const filteredPlaces = computed(() =>
      selectedCategory.value === 'all'
        ? PLACES
        : PLACES.filter(p => p.category === selectedCategory.value)
    )

    function countByCategory(id: string) {
      return id === 'all' ? PLACES.length : PLACES.filter(p => p.category === id).length
    }

    function selectCategory(id: string) {
      selectedCategory.value = id
      selectedPlace.value = null
      renderMarkers()
    }

    function selectPlace(place: Place) {
      selectedPlace.value = place
      if (kakaoMap) {
        // 팝업이 핀 위에 가리지 않도록 살짝 위로 이동
        const latLng = new window.kakao.maps.LatLng(place.lat, place.lng)
        kakaoMap.panTo(latLng)
      }
      renderMarkers()
    }

    function renderMarkers() {
      overlays.forEach(o => o.setMap(null))
      overlays = []
      if (!kakaoMap) return

      filteredPlaces.value.forEach(place => {
        const isActive = selectedPlace.value?.id === place.id

        const content = document.createElement('div')
        content.style.cssText = 'display:inline-block; position:relative;'
        content.innerHTML = `
          <div class="map-pin ${isActive ? 'map-pin--active' : ''}" style="
            background: ${isActive ? '#4a90d9' : 'white'};
            border: 2.5px solid ${isActive ? '#2c6fad' : '#4a90d9'};
            border-radius: 50%;
            width: ${isActive ? '46px' : '38px'};
            height: ${isActive ? '46px' : '38px'};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isActive ? '23px' : '19px'};
            box-shadow: ${isActive
              ? '0 4px 14px rgba(74,144,217,0.55)'
              : '0 2px 8px rgba(0,0,0,0.18)'};
            cursor: pointer;
            transition: all 0.18s;
          ">${place.icon}</div>
          ${isActive ? `<div style="
            position:absolute; bottom:-7px; left:50%;
            transform:translateX(-50%);
            width:8px; height:8px;
            background:#4a90d9;
            border-radius:50%;
            box-shadow:0 0 0 3px rgba(74,144,217,0.25);
          "></div>` : ''}
        `
        content.addEventListener('click', (e) => {
          e.stopPropagation()
          selectPlace(place)
        })

        const overlay = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(place.lat, place.lng),
          content,
          yAnchor: isActive ? 0.7 : 0.5,
          zIndex: isActive ? 10 : 1,
        })
        overlay.setMap(kakaoMap)
        overlays.push(overlay)
      })
    }

    function goToMyLocation() {
      if (!navigator.geolocation) {
        alert('이 브라우저는 위치 기능을 지원하지 않습니다.')
        return
      }
      locating.value = true
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          locating.value = false
          const { latitude: lat, longitude: lng } = pos.coords
          if (!kakaoMap) return

          const latLng = new window.kakao.maps.LatLng(lat, lng)

          if (myMarker) myMarker.setMap(null)
          if (myCircle) myCircle.setMap(null)

          const myContent = document.createElement('div')
          myContent.innerHTML = `
            <div style="
              width: 14px; height: 14px;
              background: #4a90d9;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 0 0 5px rgba(74,144,217,0.25);
            "></div>
          `
          myMarker = new window.kakao.maps.CustomOverlay({
            position: latLng,
            content: myContent,
            yAnchor: 0.5,
            zIndex: 20,
          })
          myMarker.setMap(kakaoMap)

          myCircle = new window.kakao.maps.Circle({
            center: latLng,
            radius: 300,
            strokeWeight: 1,
            strokeColor: '#4a90d9',
            strokeOpacity: 0.4,
            fillColor: '#4a90d9',
            fillOpacity: 0.07,
          })
          myCircle.setMap(kakaoMap)

          kakaoMap.panTo(latLng)
          myLocationVisible.value = true
        },
        () => {
          locating.value = false
          alert('위치를 가져올 수 없습니다. 브라우저 위치 권한을 확인해 주세요.')
        },
        { timeout: 8000 }
      )
    }

    function initMap() {
      if (!mapRef.value) return
      kakaoMap = new window.kakao.maps.Map(mapRef.value, {
        center: new window.kakao.maps.LatLng(37.5671338, 127.191758),
        level: 6,
      })
      // 지도 빈 곳 클릭 시 팝업 닫기
      window.kakao.maps.event.addListener(kakaoMap, 'click', () => {
        selectedPlace.value = null
        renderMarkers()
      })
      renderMarkers()
    }

    function loadKakaoSDK() {
      if (window.kakao?.maps) { initMap(); return }
      const script = document.createElement('script')
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`
      script.onload = () => window.kakao.maps.load(initMap)
      script.onerror = () => console.error('[DailyMap] 카카오 지도 SDK 로드 실패. API 키 확인 필요')
      document.head.appendChild(script)
    }

    onMounted(loadKakaoSDK)
    onUnmounted(() => {
      overlays.forEach(o => o.setMap(null))
      if (myMarker) myMarker.setMap(null)
      if (myCircle) myCircle.setMap(null)
    })

    return {
      mapRef, selectedPlace, selectedCategory, locating, myLocationVisible,
      categories, filteredPlaces,
      countByCategory, selectCategory, selectPlace, goToMyLocation,
    }
  },
})
</script>

<style scoped>
/* ── 위젯 전체 ── */
.map-widget {
  font-family: 'Noto Sans KR', 'Pretendard', -apple-system, sans-serif;
  border: 1px solid #e8eaf0;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  margin: 32px 0;
}

/* ── 헤더 ── */
.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #eee;
}
.header-left { display: flex; align-items: center; gap: 10px; }
.header-icon { font-size: 1.5rem; }
.header-title { margin: 0; font-size: 1.05rem; font-weight: 700; color: #1a1a2e; }
.header-sub { margin: 0; font-size: 0.76rem; color: #aaa; }

.my-location-btn {
  padding: 7px 15px;
  background: #4a90d9;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s;
  white-space: nowrap;
  flex-shrink: 0;
}
.my-location-btn:hover { background: #2c6fad; }
.my-location-btn.locating { background: #aaa; cursor: not-allowed; }

/* ── 필터 ── */
.filter-bar {
  display: flex;
  gap: 6px;
  padding: 10px 16px;
  background: #fafbff;
  border-bottom: 1px solid #eee;
  overflow-x: auto;
}
.filter-bar::-webkit-scrollbar { display: none; }
.filter-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border-radius: 16px;
  border: 1.5px solid #e0e0e0;
  background: white;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
  color: #555;
  white-space: nowrap;
  flex-shrink: 0;
}
.filter-btn:hover { border-color: #4a90d9; color: #4a90d9; }
.filter-btn.active { background: #4a90d9; border-color: #4a90d9; color: white; font-weight: 600; }
.filter-count {
  background: rgba(0,0,0,0.09);
  border-radius: 10px;
  padding: 1px 6px;
  font-size: 0.7rem;
}
.filter-btn.active .filter-count { background: rgba(255,255,255,0.28); }

/* ── 지도 래퍼 ── */
.map-wrap {
  position: relative;
  height: 520px;
}
.kakao-map {
  width: 100%;
  height: 100%;
}

/* ── 지도 빈곳 클릭 시 닫기용 backdrop (팝업 뒤) ── */
.map-backdrop {
  position: absolute;
  inset: 0;
  z-index: 50;
  cursor: pointer;
  /* 투명 — 클릭만 받음 */
}

/* ── 핀 클릭 팝업 ── */
.place-popup {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 18px;
  padding: 16px 18px 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  width: 320px;
  z-index: 100;   /* backdrop(50)보다 위 */
}
.popup-close {
  position: absolute;
  top: 12px; right: 14px;
  background: none; border: none;
  font-size: 0.9rem; color: #ccc;
  cursor: pointer; line-height: 1;
  padding: 0;
}
.popup-close:hover { color: #555; }

.popup-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding-right: 20px;
}
.popup-icon { font-size: 1.9rem; flex-shrink: 0; }
.popup-name { font-size: 1rem; font-weight: 700; color: #1a1a2e; }
.popup-cat-tag {
  display: inline-block;
  margin-top: 3px;
  font-size: 0.7rem;
  color: #4a90d9;
  background: #eef5ff;
  padding: 2px 7px;
  border-radius: 8px;
}
.popup-rating {
  margin-left: auto;
  font-size: 0.82rem;
  color: #f5a623;
  font-weight: 700;
  flex-shrink: 0;
}

.popup-details {
  border-top: 1px solid #f2f2f2;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.popup-row { font-size: 0.82rem; color: #555; line-height: 1.5; }
.popup-note { font-size: 0.79rem; color: #999; font-style: italic; line-height: 1.5; }

/* ── 네이버 지도 버튼 ── */
.popup-naver-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 12px;
  padding: 10px 0;
  background: #03c75a;
  color: white;
  border-radius: 12px;
  font-size: 0.86rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.18s;
}
.popup-naver-btn:hover { background: #02a84a; }
.naver-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px; height: 18px;
  background: white;
  color: #03c75a;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 900;
  line-height: 1;
}

/* ── 내 위치 배지 ── */
.my-loc-badge {
  position: absolute;
  top: 12px; right: 12px;
  background: rgba(74,144,217,0.88);
  color: white;
  font-size: 0.74rem;
  font-weight: 600;
  padding: 5px 11px;
  border-radius: 12px;
  backdrop-filter: blur(4px);
  z-index: 10;
  pointer-events: none;
}

/* ── 팝업 트랜지션 ── */
.popup-enter-active, .popup-leave-active { transition: all 0.2s ease; }
.popup-enter-from, .popup-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}

/* ── 반응형 ── */
@media (max-width: 540px) {
  .map-wrap { height: 400px; }
  .place-popup { width: calc(100% - 24px); bottom: 12px; }
}
</style>