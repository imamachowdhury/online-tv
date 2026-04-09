"use client";

import dynamic from 'next/dynamic';
import { useRef, useState, useEffect } from 'react';
import { Tv, MonitorPlay, Activity, Signal, PlayCircle, Menu, X, ArrowUpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { App } from '@capacitor/app';

const APP_VERSION = "1.0.0"; // Increment this when you release a new version
const GITHUB_RAW_PACKAGE = "https://raw.githubusercontent.com/imamachowdhury/online-tv/main/package.json";
const GITHUB_REPO_URL = "https://github.com/imamachowdhury/online-tv";

const ReactHlsPlayer = dynamic(() => import('react-hls-player'), { ssr: false });

const channels = [
  {
    id: 'tsports',
    name: 'T-Sports',
    category: 'Sports',
    icon: Activity,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/T_Sports_logo.svg/1280px-T_Sports_logo.svg.png',
    url: 'http://172.28.28.10:8080/TSports/tracks-v1a1/mono.m3u8?token=ded42b8b19ee98825c2ca017a393eb122aef9d59-e61f6959c44804652dd3ab930a19246b-1775734814-1775724014'
  },
  {
    id: 'btv',
    name: 'BTV World',
    category: 'News & Entertainment',
    icon: Tv,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/43/BTV_World_Logo.svg/1280px-BTV_World_Logo.svg.png',
    url: 'https://www.btvlive.gov.bd/live/37f2df30-3edf-42f3-a2ee-6185002c841c/BD/355ba051-9a60-48aa-adcf-5a6c64da8c5c/index.m3u8'
  },
  {
    id: 'btv-news',
    name: 'BTV News',
    category: 'News',
    icon: MonitorPlay,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/15/BTV_News_Logo.svg/1280px-BTV_News_Logo.svg.png',
    url: 'https://www.btvlive.gov.bd/live/37f2df30-3edf-42f3-a2ee-6185002c841c/BD/d96eb7f4-83c2-4472-9597-3568390a8ebf/index.m3u8'
  },
  {
    id: 'redbulltv',
    name: 'Red Bull TV',
    category: 'Sports',
    icon: Activity,
    logo: 'https://s10019.cdn.ncms.io/wp-content/uploads/2025/11/Redbull-TV.jpg.jpeg',
    url: 'http://172.28.28.10:8080/RedBullTV/tracks-v1a1/mono.m3u8?token=425c0b4e2402087df7cc8288ca84721ffdb61255-62f403a6d44322ea542c0263c0b94c6a-1775736619-1775725819'
  },
  {
    id: 'atnbangla',
    name: 'ATN Bangla',
    category: 'Entertainment',
    icon: Tv,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/95/ATN_Bangla_Logo_without_slogan.svg/1280px-ATN_Bangla_Logo_without_slogan.svg.png',
    url: 'http://172.28.28.10:8080/ATNBangla/tracks-v1a1/mono.m3u8?token=49801fb0cf586fa1c85bc8799d1501bd626cdefe-59818d833eccbd53775739d68b3401df-1775737012-1775726212'
  },
  {
    id: 'banglavision',
    name: 'Bangla Vision',
    category: 'Entertainment',
    icon: Tv,
    logo: 'https://upload.wikimedia.org/wikipedia/bn/thumb/e/e0/%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%AD%E0%A6%BF%E0%A6%B6%E0%A6%A8_%E0%A6%9F%E0%A6%BF%E0%A6%AD%E0%A6%BF%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.svg/1280px-%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%AD%E0%A6%BF%E0%A6%B6%E0%A6%A8_%E0%A6%9F%E0%A6%BF%E0%A6%AD%E0%A6%BF%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.svg.png',
    url: 'http://172.28.28.10:8080/BanglaVision/tracks-v1a1/mono.m3u8?token=ebc903ce8ef8b220081bd9f5005b954df90c873e-045d4fba117e2c5ab31dce6028664a65-1775737043-1775726243'
  },
  {
    id: 'channel24',
    name: 'Channel 24',
    category: 'News & Entertainment',
    icon: Tv,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Logo_of_Channel_24_%28Bangladesh%29.svg/1280px-Logo_of_Channel_24_%28Bangladesh%29.svg.png',
    url: 'http://172.28.28.10:8080/Channel24/tracks-v1a1/mono.m3u8?token=156e0d0e772ee5107a334211c62825485efb0cf8-73ad2ed3ee21c53082bac7440e7a4a32-1775737056-1775726256'
  },
  {
    id: 'dbcnews',
    name: 'DBC News',
    category: 'News',
    icon: MonitorPlay,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/%E0%A6%A1%E0%A6%BF%E0%A6%AC%E0%A6%BF%E0%A6%B8%E0%A6%BF_%E0%A6%A8%E0%A6%BF%E0%A6%89%E0%A6%9C%E2%80%93%E0%A6%8F%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.svg/1280px-%E0%A6%A1%E0%A6%BF%E0%A6%AC%E0%A6%BF%E0%A6%B8%E0%A6%BF_%E0%A6%A8%E0%A6%BF%E0%A6%89%E0%A6%9C%E2%80%93%E0%A6%8F%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.svg.png',
    url: 'http://172.28.28.10:8080/DBCNews/tracks-v1a1/mono.m3u8?token=82ff8d20b79820075a55d6a5bdc28bef46663085-dce00d503403b8b2764e9e52383b4d09-1775737086-1775726286'
  },
  {
    id: 'deeptotv',
    name: 'Deepto TV',
    category: 'Entertainment',
    icon: Tv,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/00/Logo_of_Deepto_TV.svg/1280px-Logo_of_Deepto_TV.svg.png',
    url: 'http://172.28.28.10:8080/DeeptoTV/tracks-v1a1/mono.m3u8?token=740a7806833889853187732ee061362c31559f1e-948d3891b37fba72daea56b793d2dd49-1775737107-1775726307'
  },
  {
    id: 'colorsbangla',
    name: 'Colors Bangla',
    category: 'Entertainment',
    icon: Tv,
    logo: 'https://static.wikia.nocookie.net/etv-gspn-bangla/images/8/83/Colors_Bangla_HD_%282016-present%29.png/revision/latest?cb=20210420120554',
    url: 'http://172.28.28.10:8080/ColorsBangla/tracks-v1a1/mono.m3u8?token=c453857920c69598497394423ce26eb8307547bd-4fe4dff460f635eb0e03d350caaf7c4d-1775737160-1775726360'
  },
  {
    id: 'indiatoday',
    name: 'India Today',
    category: 'News',
    icon: MonitorPlay,
    logo: 'https://play-lh.googleusercontent.com/XKVQpIEEGbjxsX5CFatbRv5b0FMMYJ9bYkhjFa0_XFaOG5iAu4Qz9aWFyK5yOe7R0n0',
    url: 'http://172.28.28.10:8080/IndiaToday/tracks-v1a1/mono.m3u8?token=0f6a6053b20469004d5f88719b26b396743e02ff-3794d223c9c995144a3f56284036c581-1775737181-1775726381'
  },
  {
    id: 'russiatoday',
    name: 'Russia Today',
    category: 'News',
    icon: MonitorPlay,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Russia-today-logo.svg/1280px-Russia-today-logo.svg.png',
    url: 'http://172.28.28.10:8080/RussiaToday/tracks-v1a1/mono.m3u8?token=0b1c62c0591948070758b99d8e78a96fff23328b-64ff903043e4e52b0943f32bb5cdd19c-1775737197-1775726397'
  },
  {
    id: 'aljazeera',
    name: 'Al Jazeera',
    category: 'News',
    icon: MonitorPlay,
    logo: 'https://m.media-amazon.com/images/I/31TqBcQUlcL.png',
    url: 'http://172.28.28.10:8080/Aljazeera/tracks-v1a1/mono.m3u8?token=3878c9410d594c2007f649a96ead9e6c44efa12b-fc6ccc0b61ba7192deb8b34c3cc61247-1775737217-1775726417'
  },
  {
    id: 'aljazeera2',
    name: 'Al Jazeera Server 2',
    category: 'News',
    icon: MonitorPlay,
    logo: 'https://m.media-amazon.com/images/I/31TqBcQUlcL.png',
    url: 'https://cdn01.medialive.one:2096/ALJAZEERAFHD/tracks-v1a1/mono.ts.m3u8'
  },
  {
    id: 'enterr10',
    name: 'Enterr10',
    category: 'Entertainment',
    icon: Tv,
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9_ykbUvqkgB4Kb3Y2dhllHzuFIFnYISxGxg&s',
    url: 'http://172.28.28.10:8080/Enterr10/tracks-v1a1/mono.m3u8?token=e9d6ea25a7cbccb26014251f74db8785cd221e32-223a5edd5698c106ba4fa42b5fb1dbf3-1775737233-1775726433'
  },
  {
    id: 'animalplanet',
    name: 'Animal Planet',
    category: 'Documentary',
    icon: MonitorPlay,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/2018_Animal_Planet_logo.svg',
    url: 'http://172.28.28.10:8080/AnimalPlanet/tracks-v1a1/mono.m3u8?token=278057565515d7f97e793a74ec4ebae6cbca4889-8e38d61909e8d05d22a834e14d3e7441-1775737256-1775726456'
  },
  {
    id: 'sonytvhd',
    name: 'Sony TV HD',
    category: 'Entertainment',
    icon: Tv,
    logo: 'https://upload.wikimedia.org/wikipedia/en/d/de/Sony_TV_new.png',
    url: 'http://172.28.28.10:8080/SonyTVHD/tracks-v1a1/mono.m3u8?token=c68dab2754ee2afca8ae5e21d8b7b0355f6d299f-99c5bea63b9c7876bd8da3372f524989-1775737284-1775726484'
  },
  {
    id: 'sonyaath',
    name: 'Sony Aath',
    category: 'Entertainment',
    icon: Tv,
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSvhmlz8odxw6lTUF_bc5WnkTbRZP57wdIyg&s',
    url: 'http://172.28.28.10:8080/SonyAath/tracks-v1a1/mono.m3u8?token=425eb6d2f45b320baf950bf801dbb754c963c4e5-91a47b831b59b8af2164b133befbbfa6-1775737299-1775726499'
  },
  {
    id: 'sonymaxhd',
    name: 'Sony Max HD',
    category: 'Movies',
    icon: PlayCircle,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/SONY_MAX_Logo_2022.png/250px-SONY_MAX_Logo_2022.png',
    url: 'http://172.28.28.10:8080/SonyMaxHD/tracks-v1a1/mono.m3u8?token=b2518b9720b8c5a5eab373dfc121ca342b4d6d2d-f27d0e1caa190a0459a2bf838146e728-1775737314-1775726514'
  },
  {
    id: 'sonyten1hd',
    name: 'Sony Ten 1 HD',
    category: 'Sports',
    icon: Activity,
    logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/channel/d775ae813cdc8095ee6b82b227a986cd.png',
    url: 'http://172.28.28.10:8080/SonyTen1HD/tracks-v1a1/mono.m3u8?token=8cff38d51dfd35dd6022c4841bc7f9a9fb629bf0-875cfa46df8c30350fc728e5ce58fa2f-1775737333-1775726533'
  },
  {
    id: 'sonyten2hd',
    name: 'Sony Ten 2 HD',
    category: 'Sports',
    icon: Activity,
    logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/channel/9c0fc822845789953d3be9c29bb6f0cd.png',
    url: 'http://172.28.28.10:8080/SonyTen2HD/tracks-v1a1/mono.m3u8?token=52161b3399c302888fe7e42f96a7d508fa7a05a2-6729ae2f756eea621595349b0a55b404-1775737349-1775726549'
  },
  {
    id: 'starsports1hd',
    name: 'Star Sports 1 HD',
    category: 'Sports',
    icon: Activity,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Star_Sports_1_HD.png/960px-Star_Sports_1_HD.png?_=20221025095646',
    url: 'http://172.28.28.10:8080/StarSports1HD/tracks-v1a1/mono.m3u8?token=fe98f66bea408bd193d8ca5b72cb3c0e3614deb1-c0a13421d37bc24e2e958bdc0f5ac0f8-1775737372-1775726572'
  },
  {
    id: 'starsports2hd',
    name: 'Star Sports 2 HD',
    category: 'Sports',
    icon: Activity,
    logo: 'https://medianet.mv/media/channel/179x0-icon.png',
    url: 'http://172.28.28.10:8080/StarSports2HD/tracks-v1a1/mono.m3u8?token=d92c5664235c636f44efa27b822692c6bddf8f65-e4df55fe5deba12165d27b52bcc5ff07-1775737390-1775726590'
  },
  {
    id: 'stargoldhd',
    name: 'Star Gold HD',
    category: 'Movies',
    icon: PlayCircle,
    logo: 'https://yt3.googleusercontent.com/ytc/AIdro_muYk3H6cceCnfb1MkJ0MP0ZFyLlIElpCXstEyfm-svPO0=s900-c-k-c0x00ffffff-no-rj',
    url: 'http://172.28.28.10:8080/StarGoldHD/tracks-v1a1/mono.m3u8?token=48e793df4336a02eaf1545d55427770eec8e6742-fb1c2e45a11b2361edca88e505107dfc-1775737421-1775726621'
  },
  {
    id: 'zeebanglahd',
    name: 'Zee Bangla HD',
    category: 'Entertainment',
    icon: Tv,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/%E0%A6%9C%E0%A6%BF_%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE_%E0%A7%A8%E0%A7%A6%E0%A7%A8%E0%A7%AB.svg',
    url: 'http://172.28.28.10:8080/ZeeBanglaHD/tracks-v1a1/mono.m3u8?token=cf1491e9fca08a004a44e70acd028afc7faeb996-01d063ea4d00534debbff15f76405d85-1775737435-1775726635'
  },
  {
    id: 'zeecinemahd',
    name: 'Zee Cinema HD',
    category: 'Movies',
    icon: PlayCircle,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Zee_Cinema_2025.svg',
    url: 'http://172.28.28.10:8080/ZeeCinemaHD/tracks-v1a1/mono.m3u8?token=eddd77116242722237b0f8eef5bec7aa4f30d445-4e7df209ab1f65f1155429cb99065a54-1775737447-1775726647'
  },
  {
    id: 'hbo2',
    name: 'HBO 2',
    category: 'Movies',
    icon: PlayCircle,
    url: 'https://cdn01.medialive.one:2096/HBO2FHD/tracks-v1a1/mono.ts.m3u8'
  },
  {
    id: 'greenentertainmentv',
    name: 'Green Entertainment TV',
    category: 'Entertainment',
    icon: Tv,
    url: 'https://cdn01.medialive.one:2096/GREENENTFHD/tracks-v2a1/mono.ts.m3u8'
  },
  {
    id: 'aljazeera-english',
    name: 'Al Jazeera English',
    category: 'News',
    icon: MonitorPlay,
    logo: 'https://iptv-org.github.io/browsing/logos/channels/AlJazeeraEnglish.qa.png',
    url: 'https://live-hls-web-aje-fa.thehlive.com/AJE/index.m3u8'
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg TV US',
    category: 'News',
    icon: MonitorPlay,
    logo: 'https://iptv-org.github.io/browsing/logos/channels/BloombergTV.us.png',
    url: 'https://bloomberg.com/media-manifest/streams/us.m3u8'
  },
  {
    id: 'abcnews',
    name: 'ABC News Live',
    category: 'News',
    icon: MonitorPlay,
    logo: 'https://iptv-org.github.io/browsing/logos/channels/ABCNewsLive.us.png',
    url: 'https://abc-iview-mediapackag02.akamaized.net/out/v1/6797f1c1fce74a389f41786e66cf5301/index.m3u8'
  },
  {
    id: 'skynews-weather',
    name: 'Sky News Weather',
    category: 'News',
    icon: MonitorPlay,
    logo: 'https://iptv-org.github.io/browsing/logos/channels/SkyNews.uk.png',
    url: 'https://distro001-gb-hls1-prd.delivery.skycdp.com/easel_cdn/ngrp:weather_loop.stream_all/playlist.m3u8'
  },
  {
    id: 'nasa-tv',
    name: 'NASA TV Public',
    category: 'Entertainment',
    icon: Tv,
    logo: 'https://iptv-org.github.io/browsing/logos/channels/NASAPublic.us.png',
    url: 'https://ntv1.akamaized.net/hls/live/2014049/NASA-Public/master.m3u8'
  },
  {
    id: 'fashion-tv',
    name: 'Fashion TV',
    category: 'Entertainment',
    icon: Tv,
    logo: 'https://iptv-org.github.io/browsing/logos/channels/FashionTV.fr.png',
    url: 'https://fash1043.cloudycdn.services/slive/_definst_/ftv_ftv_mid_pure/playlist.m3u8'
  },
  {
    id: 'documentary-plus',
    name: 'Documentary+',
    category: 'Entertainment',
    icon: Tv,
    logo: 'https://iptv-org.github.io/browsing/logos/channels/DocumentaryPlus.us.png',
    url: 'https://ef79b15c8c7c46c7a9de9d33001dbd07.mediatailor.us-west-2.amazonaws.com/v1/master/ba62fe743df0fe93366eba3a257d792884136c7f/LINEAR-859-DOCUMENTARYPLUS-DOCUMENTARYPLUS/mt/documentaryplus/859/hls/master/playlist.m3u8'
  },
  {
    id: 'pbs-kids',
    name: 'PBS Kids',
    category: 'Kids',
    icon: Tv,
    logo: 'https://iptv-org.github.io/browsing/logos/channels/PBSKids.us.png',
    url: 'https://livestream.pbskids.org/out/v1/14507d931bbe48a69287e4850e53443c/est.m3u8'
  },
  {
    id: 'lego-channel',
    name: 'Lego Channel',
    category: 'Kids',
    icon: Tv,
    logo: 'https://iptv-org.github.io/browsing/logos/channels/LegoChannel.us.png',
    url: 'https://jmp2.uk/stvp-GBBC4300005AL'
  },
  {
    id: 'fifa-plus',
    name: 'FIFA+',
    category: 'Sports',
    icon: Activity,
    logo: 'https://iptv-org.github.io/browsing/logos/channels/FIFAPlus.intl.png',
    url: 'https://d2w9q46ikgrcwx.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-of5cbk3sav3w5/v1/sysdata_s_p_a_fifa_7/samsungheadend_us/latest/main/hls/playlist.m3u8'
  }
];

export default function Home() {
  const playerRef = useRef<HTMLVideoElement>(null);
  const [selectedChannel, setSelectedChannel] = useState(channels[0]);
  const [updateAvailable, setUpdateAvailable] = useState<string | null>(null);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const response = await fetch(GITHUB_RAW_PACKAGE);
        if (!response.ok) return;
        
        const remotePackage = await response.json();
        const remoteVersion = remotePackage.version;

        if (remoteVersion !== APP_VERSION) {
          console.log(`Update Available: ${remoteVersion} (Local: ${APP_VERSION})`);
          setUpdateAvailable(remoteVersion);
        }
      } catch (error) {
        console.error("Failed to check for updates:", error);
      }
    };

    // Only run update check if in a native environment or specifically for the user's test
    checkForUpdates();
  }, []);
  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      {/* Update Notifier Banner */}
      <AnimatePresence>
        {updateAvailable && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
          >
            <div className="relative group overflow-hidden rounded-2xl bg-blue-600 p-[1px] shadow-2xl shadow-blue-500/30">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:opacity-100 transition-opacity opacity-50" />
              <div className="relative flex items-center justify-between gap-4 bg-neutral-950 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-500">
                    <ArrowUpCircle className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white tracking-tight">Update Available!</span>
                    <span className="text-xs text-neutral-400">Version {updateAvailable} is ready</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUpdateAvailable(null)}
                    className="px-3 py-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                  >
                    Later
                  </button>
                  <a
                    href={`${GITHUB_REPO_URL}/releases/latest`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                  >
                    Update
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop Only */}
      <motion.aside 
        className="hidden lg:flex w-80 flex-col border-r border-neutral-800/50 bg-neutral-950/50 backdrop-blur-xl z-40"
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <Signal className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">Oz TV</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 flex-col">
          {Array.from(new Set(channels.map((c) => c.category))).map((category) => (
            <div key={category} className="mb-6">
              <h3 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {category}
              </h3>
              <div className="space-y-1">
                {channels
                  .filter((c) => c.category === category)
                  .map((channel) => {
                    const isActive = selectedChannel.id === channel.id;
                    const Icon = channel.icon;
                    return (
                      <button
                        key={channel.id}
                        onClick={() => {
                          setSelectedChannel(channel);
                        }}
                        className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${
                          isActive 
                            ? 'bg-neutral-800/50 text-white' 
                            : 'text-neutral-400 hover:bg-neutral-800/30 hover:text-neutral-200'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="active-indicator"
                            className="absolute inset-0 rounded-xl border border-neutral-700/50 bg-neutral-800/50"
                            initial={false}
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <div className="relative z-10 flex items-center gap-3 w-full">
                          <div className={`flex shrink-0 items-center justify-center w-8 h-8 rounded-lg overflow-hidden transition-colors ${isActive ? 'bg-blue-600 text-white' : 'bg-neutral-900 group-hover:bg-neutral-800'}`}>
                             {(channel as any).logo ? (
                               <img src={(channel as any).logo} alt={channel.name} className={`w-full h-full object-contain bg-white p-0.5 ${isActive ? '' : 'opacity-90 group-hover:opacity-100'}`} loading="lazy" />
                             ) : (
                               <Icon className="h-4 w-4" />
                             )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{channel.name}</span>
                          </div>
                          {isActive && (
                            <div className="ml-auto flex items-center gap-1.5">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-neutral-800/50 bg-neutral-950/50 px-6 backdrop-blur-md lg:hidden z-30">
           <div className="flex items-center gap-2">
             <Signal className="h-5 w-5 text-blue-500" />
             <span className="font-bold text-white tracking-tight">OZ TV</span>
           </div>
           <div className="ml-auto mr-2 truncate flex items-center justify-end">
             <span className="text-xs text-neutral-400 bg-neutral-800/50 px-2 py-1 rounded-md border border-neutral-700/50 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] sm:max-w-[200px]">
               {selectedChannel.name}
             </span>
           </div>
        </header>

        <div className="flex-1 flex flex-col p-2 lg:p-8 overflow-y-auto">
          <div className="mb-8 hidden lg:block">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold tracking-tight text-white mb-2"
            >
              Now Playing: <span className="text-blue-500">{selectedChannel.name}</span>
            </motion.h1>
            <p className="text-neutral-400">Enjoy seamless, high-quality streaming on your favorite channels.</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-start lg:justify-center">
            {/* Sticky Player Wrapper for Mobile */}
            <div className="sticky top-0 z-20 w-full bg-neutral-950/80 backdrop-blur-lg lg:static lg:bg-transparent lg:backdrop-blur-none py-2 lg:py-0 mb-4 lg:mb-0">
              <motion.div 
                key={selectedChannel.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-6xl relative group shrink-0"
              >
                {/* Glow Effect directly behind the player, responsive based on container */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                
                <div className="relative rounded-2xl overflow-hidden bg-black ring-1 ring-white/10 shadow-2xl aspect-video flex items-center justify-center">
                  {/* @ts-ignore */}
                  <ReactHlsPlayer
                    src={selectedChannel.url}
                    autoPlay={true}
                    controls={true}
                    width="100%"
                    height="100%"
                    // @ts-ignore
                    playerRef={playerRef}
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            </div>

            {/* Mobile Channel List */}
            <div className="mt-8 w-full lg:hidden pb-12">
              <h2 className="text-xl font-bold text-white mb-6 px-4">Oz Grid</h2>
              {Array.from(new Set(channels.map((c) => c.category))).map((category) => (
                <div key={category} className="mb-8 px-4">
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 border-l-2 border-blue-500 pl-3">
                    {category}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {channels
                      .filter((c) => c.category === category)
                      .map((channel) => {
                        const isActive = selectedChannel.id === channel.id;
                        const Icon = channel.icon;
                        return (
                          <button
                            key={channel.id}
                            onClick={() => {
                              setSelectedChannel(channel);
                            }}
                            className={`group relative flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all duration-300 ${
                              isActive 
                                ? 'bg-blue-600/10 ring-1 ring-blue-500/50' 
                                : 'bg-neutral-900/40 hover:bg-neutral-800/60 ring-1 ring-white/5'
                            }`}
                          >
                            {isActive && (
                              <div className="absolute top-2 right-2">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                              </div>
                            )}
                            
                            <div className={`flex shrink-0 items-center justify-center w-14 h-14 rounded-xl overflow-hidden transition-transform duration-300 ${isActive ? 'scale-110 shadow-lg shadow-blue-500/20' : 'group-hover:scale-105'}`}>
                               {(channel as any).logo ? (
                                 <img src={(channel as any).logo} alt={channel.name} className={`w-full h-full object-contain bg-white p-1.5 ${isActive ? '' : 'opacity-80 group-hover:opacity-100'}`} loading="lazy" />
                               ) : (
                                 <div className="bg-neutral-800 p-3 rounded-lg text-neutral-400">
                                   <Icon className="h-6 w-6" />
                                 </div>
                               )}
                            </div>
                            
                            <span className={`font-semibold text-xs transition-colors line-clamp-1 ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'}`}>
                              {channel.name}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
