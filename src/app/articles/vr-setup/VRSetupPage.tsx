"use client";

import { motion } from "framer-motion";
import {
  FaMobileAlt,
  FaDesktop,
  FaVrCardboard,
  FaWifi,
  FaDownload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaPlayCircle,
  FaTv,
  FaCog,
  FaLightbulb,
  FaHeadset,
  FaGamepad,
  FaSearch,
  FaStar,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";

/* ───────────────────────── data ───────────────────────── */

const requirements = [
  {
    level: "最低限（スマホだけ）",
    cost: "0円〜1,000円",
    items: [
      "スマートフォン（iPhone / Android）",
      "FANZA VRアプリ（無料）",
      "Wi-Fi環境（推奨）",
    ],
    quality: "2D寄りのVR体験。首振り対応だが没入感は限定的。",
    icon: <FaMobileAlt size={20} />,
  },
  {
    level: "入門（スマホ + VRゴーグル）",
    cost: "1,000円〜3,000円",
    items: [
      "スマートフォン",
      "スマホ用VRゴーグル（Amazon等で購入可）",
      "FANZA VRアプリ（無料）",
      "イヤホン（推奨）",
    ],
    quality: "手軽にVR体験が可能。画質はスマホ性能に依存。十分楽しめるレベル。",
    icon: <FaVrCardboard size={20} />,
  },
  {
    level: "本格派（スタンドアロンVR）",
    cost: "30,000円〜70,000円",
    items: [
      "Meta Quest 2 または Meta Quest 3",
      "FANZA VRアプリ（Quest版・無料）",
      "Wi-Fi 5以上のルーター（5GHz帯推奨）",
    ],
    quality:
      "高画質・高没入感。PC不要で単体動作。現在最もコスパに優れた選択肢。",
    icon: <FaHeadset size={20} />,
  },
  {
    level: "最高画質（PC VR）",
    cost: "100,000円〜",
    items: [
      "VR対応ゲーミングPC（GPU: RTX 3060以上推奨）",
      "PC用VR HMD（Meta Quest + Link / Valve Index等）",
      "SteamVR（無料）",
      "FANZA VRプレイヤー（PC版・無料）",
    ],
    quality: "最高画質で視聴可能。8K映像もスムーズ再生。環境構築のハードルは高め。",
    icon: <FaDesktop size={20} />,
  },
];

const deviceGuides = [
  {
    id: "smartphone",
    icon: <FaMobileAlt size={24} />,
    title: "スマートフォン + VRゴーグル",
    subtitle: "最安1,000円から始められる入門プラン",
    costRange: "1,000円〜3,000円",
    sections: [
      {
        heading: "おすすめVRゴーグル",
        content:
          "スマホ用VRゴーグルはAmazonや楽天で1,000〜3,000円程度で購入できます。選ぶ際のポイントは、①レンズ調節機能付き（瞳孔間距離・焦点調節）、②メガネをかけたまま装着可能、③スマホのサイズに対応しているか、の3点です。ヘッドバンド付きのモデルを選ぶと、手で支える必要がなく快適に視聴できます。",
      },
      {
        heading: "セットアップ手順",
        steps: [
          "App Store / Google PlayからFANZA VRアプリをダウンロード（無料）",
          "アプリを起動し、DMMアカウントでログイン",
          "視聴したいVR作品を購入（ブラウザからでもアプリからでもOK）",
          "アプリの「購入済み作品」から作品を選択",
          "「VRモードで再生」をタップ → 画面が左右2分割になる",
          "スマホをVRゴーグルにセットし、装着して視聴開始",
        ],
      },
      {
        heading: "画質の目安",
        content:
          "スマホVRの画質は端末の解像度に大きく依存します。iPhone 13以降やPixel 6以降などの高解像度端末であれば、かなり綺麗に視聴できます。ストリーミングの場合、Wi-Fi環境が安定していないと画質が自動的に下がるため、5GHz帯のWi-Fi接続を推奨します。ダウンロード視聴なら回線状況に左右されずに最高画質で楽しめます。",
      },
      {
        heading: "注意点",
        content:
          "スマホが発熱すると自動的にパフォーマンスが低下するため、長時間の連続視聴（30分以上）ではスマホケースを外すなどの放熱対策をしましょう。また、通知が表示されるとVR視聴が中断されるため、おやすみモード（集中モード）をONにしておくことをおすすめします。",
      },
    ],
  },
  {
    id: "quest",
    icon: <FaHeadset size={24} />,
    title: "Meta Quest 2 / Quest 3",
    subtitle: "PC不要で最も手軽に高品質VR体験ができる",
    costRange: "30,000円〜70,000円",
    sections: [
      {
        heading: "Meta Questが最もおすすめな理由",
        content:
          "Meta Quest（旧Oculus Quest）は、PCやスマホに接続せずに単体でVRコンテンツを楽しめるスタンドアロン型VRヘッドセットです。FANZA VR専用アプリが公式に提供されており、セットアップも簡単。画質・没入感ともにスマホVRとは段違いで、現在FANZA VRを楽しむ最もコスパの良い選択肢です。Quest 3は特に解像度とパススルー機能が向上しており、より快適なVR体験が可能です。",
      },
      {
        heading: "セットアップ手順",
        steps: [
          "Meta Questの初期設定を完了し、Wi-Fiに接続（5GHz帯推奨）",
          "Quest内のストア（Meta Quest Store）から「DMM VR動画プレイヤー」を検索しインストール",
          "アプリを起動し、DMMアカウントでログイン（QRコードログインが便利）",
          "購入済みのVR作品一覧が表示されるので、視聴したい作品を選択",
          "ストリーミング視聴またはダウンロード視聴を選択して再生開始",
        ],
      },
      {
        heading: "ストリーミング vs ダウンロード",
        content:
          "ストリーミング視聴は即座に再生開始でき手軽ですが、Wi-Fi環境によって画質が変動します。ダウンロード視聴は事前にファイルをQuest本体に保存するため時間がかかりますが、最高画質で安定して視聴できます。Quest 2は128GB/256GB、Quest 3は128GB/512GBのストレージがあり、高画質VR作品は1本5〜15GB程度です。ストレージ容量に余裕がある場合はダウンロード視聴がおすすめです。",
      },
      {
        heading: "Wi-Fi環境の重要性",
        content:
          "VRストリーミングには安定した高速回線が必須です。推奨はWi-Fi 5（802.11ac）以上の5GHz帯接続で、下り50Mbps以上が目安です。ルーターとQuestの間に壁や障害物があると速度が低下するため、できるだけルーターに近い場所で使用しましょう。Wi-Fi 6対応ルーターがあるとさらに快適です。",
      },
      {
        heading: "Quest独自の便利機能",
        content:
          "Meta Questには「パススルー機能」があり、ヘッドセットを外さずに現実世界を確認できます。飲み物を取る時や周囲の安全確認に便利です。また、Quest 3のカラーパススルーは特に自然で、VR視聴の合間に違和感なく現実に戻れます。コントローラーを使った操作も直感的で、再生位置の早送り・巻き戻しもスムーズです。",
      },
    ],
  },
  {
    id: "pcvr",
    icon: <FaDesktop size={24} />,
    title: "PC + VR HMD（PC VR）",
    subtitle: "最高画質を追求する上級者向け",
    costRange: "100,000円〜",
    sections: [
      {
        heading: "推奨PCスペック",
        content:
          "FANZA VRをPC VRで視聴する場合の推奨スペックは以下の通りです。CPU: Intel Core i5-10400 / AMD Ryzen 5 3600以上。GPU: NVIDIA GeForce RTX 3060 / AMD Radeon RX 6600以上。メモリ: 16GB以上。ストレージ: SSD推奨（HDDでは読み込みが遅くなる可能性あり）。8K VR動画をスムーズに再生するなら、RTX 4070以上を推奨します。",
      },
      {
        heading: "対応VR HMD",
        content:
          "Meta Quest 2/3（Quest Link / Air Link経由）、Valve Index、HTC Vive、HP Reverb G2などのSteamVR対応ヘッドセットが利用可能です。Meta Questを持っている場合は、USB-Cケーブル（Quest Link）またはWi-Fi経由（Air Link）でPCに接続して使うことも可能で、別途PC専用HMDを購入する必要はありません。",
      },
      {
        heading: "セットアップ手順",
        steps: [
          "SteamVRをインストール（Steamストアから無料ダウンロード）",
          "VR HMDの付属ソフトウェアをインストールし、ヘッドセットをPCに接続",
          "SteamVRを起動し、ヘッドセットが正常に認識されることを確認",
          "DMM公式サイトから「DMM VR動画プレイヤー（PC版）」をダウンロード・インストール",
          "プレイヤーを起動し、DMMアカウントでログイン",
          "購入済みのVR作品を選択して再生開始",
        ],
      },
      {
        heading: "PC VRならではの利点",
        content:
          "PCの高い処理能力を活かして、8K解像度・60fpsの最高画質VR映像を楽しめます。また、PCのストレージは大容量のため、多数の作品をダウンロードして保存しておくことも可能です。4K以上の高解像度モニターを併用すれば、ヘッドセットを外した状態でも高画質で作品を確認できます。",
      },
    ],
  },
  {
    id: "psvr",
    icon: <FaGamepad size={24} />,
    title: "PlayStation VR2",
    subtitle: "PS5ユーザー向けの高性能VR環境",
    costRange: "70,000円〜（PS5 + PSVR2）",
    sections: [
      {
        heading: "対応状況",
        content:
          "PlayStation VR2はPS5専用のVRヘッドセットです。2024年時点で、FANZA VRのPSVR2向け正式対応は限定的です。ブラウザ経由でのストリーミング視聴は可能ですが、専用アプリは提供されていないため、Meta Questと比べると利便性は劣ります。今後の正式対応アップデートに期待が集まっています。",
      },
      {
        heading: "現時点での視聴方法",
        content:
          "PS5のメディアプレイヤー機能やブラウザを経由してFANZAのVRコンテンツにアクセスする方法があります。ただし、VRモードでの再生品質やUIはMeta Quest版に比べて制限があります。PSVR2の高い解像度（片目2000×2040）や有機ELディスプレイの美しさを活かしきれていない現状です。PSVR2を既にお持ちの方は試す価値がありますが、FANZA VR目的で新規購入するならMeta Questが無難です。",
      },
      {
        heading: "今後の期待",
        content:
          "PSVR2はハードウェア性能が非常に高く、正式対応されれば素晴らしいVR体験が期待できます。有機ELによる深い黒とコントラスト、110度の広い視野角、アイトラッキング機能など、VR視聴に最適なスペックを備えています。DMM/FANZAの公式アナウンスを定期的にチェックすることをおすすめします。",
      },
    ],
  },
];

const qualitySettings = [
  {
    resolution: "HD（1080p）",
    fileSize: "1〜3GB",
    requirement: "スマホ / Quest（ストリーミング時）",
    note: "最低限の画質。通信環境が悪い場合の自動選択",
  },
  {
    resolution: "Full HD（1440p）",
    fileSize: "3〜6GB",
    requirement: "スマホ / Quest",
    note: "標準的な画質。多くの環境で快適に視聴可能",
  },
  {
    resolution: "4K（2160p）",
    fileSize: "5〜10GB",
    requirement: "Quest 2/3 / PC VR",
    note: "高画質。ディテールがくっきりして没入感が向上",
  },
  {
    resolution: "4K HQ（高ビットレート）",
    fileSize: "8〜15GB",
    requirement: "Quest 3 / PC VR（RTX 3060以上）",
    note: "さらに精細な映像。ビットレートが高くノイズが少ない",
  },
  {
    resolution: "8K（4320p）",
    fileSize: "15〜30GB",
    requirement: "PC VR（RTX 4070以上推奨）",
    note: "最高画質。対応作品はまだ限られるが圧倒的な映像体験",
  },
];

const troubles = [
  {
    problem: "映像がカクつく・途切れる",
    causes: [
      "Wi-Fi接続が不安定（2.4GHz帯を使用している）",
      "バックグラウンドで他アプリが通信している",
      "デバイスのストレージが不足している",
    ],
    solutions: [
      "5GHz帯のWi-Fiに切り替える",
      "他のアプリを終了してメモリを確保",
      "ストリーミングではなくダウンロード視聴に変更",
      "画質設定を1段階下げて試す",
    ],
  },
  {
    problem: "映像と音声がズレる（音ズレ）",
    causes: [
      "Bluetoothイヤホン使用時のレイテンシ",
      "デバイスの処理能力不足",
      "アプリのキャッシュが溜まっている",
    ],
    solutions: [
      "有線イヤホンに切り替える（Bluetooth遅延を回避）",
      "アプリのキャッシュをクリアして再起動",
      "作品を再ダウンロードする",
      "アプリを最新バージョンにアップデート",
    ],
  },
  {
    problem: "VR酔い（3D酔い）がひどい",
    causes: [
      "フレームレート低下による映像と三半規管の不一致",
      "IPD（瞳孔間距離）の設定が合っていない",
      "長時間の連続視聴",
    ],
    solutions: [
      "最初は10〜15分から始めて徐々に慣らす",
      "IPD設定をヘッドセットで調整（Quest 3は連続調整可能）",
      "扇風機で涼しい風を当てながら視聴する",
      "視聴中に激しく頭を動かさない",
      "酔いを感じたらすぐに休憩する",
    ],
  },
  {
    problem: "VR作品が再生されない・真っ暗",
    causes: [
      "アプリのバージョンが古い",
      "DRM認証エラー",
      "ストレージ容量の不足",
    ],
    solutions: [
      "アプリを最新版にアップデート",
      "一度ログアウトして再ログイン",
      "デバイスを再起動してから再試行",
      "不要なダウンロード作品を削除して空き容量を確保",
    ],
  },
  {
    problem: "Quest で FANZA VR アプリが見つからない",
    causes: [
      "Metaアカウントの地域設定が日本以外",
      "検索ワードが異なる",
    ],
    solutions: [
      "Meta Quest Storeで「DMM」と検索（「FANZA」ではヒットしない場合あり）",
      "Metaアカウントの地域設定を「日本」に変更",
      "Questのソフトウェアを最新版にアップデートしてから再検索",
    ],
  },
];

const vrTips = [
  {
    icon: <FaPlayCircle size={16} />,
    title: "サンプル動画を必ず確認",
    detail:
      "VR作品は通常の動画と構図が大きく異なるため、サンプル動画でカメラアングルや距離感を確認してから購入しましょう。同じジャンルでもメーカーによって撮影スタイルが異なります。",
  },
  {
    icon: <FaStar size={16} />,
    title: "レビュー評価4.0以上を目安に",
    detail:
      "VR作品のレビューでは画質・没入感・カメラワークが重点的に評価されています。評価4.0以上の作品は画質面で満足できることが多いです。レビューコメントで「距離感が良い」「画質が綺麗」と書かれている作品は特におすすめ。",
  },
  {
    icon: <FaSearch size={16} />,
    title: "「高画質」「4K」タグで絞り込み",
    detail:
      "FANZA のVRカテゴリでは「4K」「高画質」「60fps」などのタグで絞り込みが可能です。特に最近の作品は全体的に画質が向上していますが、タグ付きの作品はメーカーが画質に自信を持っている証拠です。",
  },
  {
    icon: <FaLightbulb size={16} />,
    title: "メーカー別の特徴を把握",
    detail:
      "VR作品はメーカーによって撮影スタイルが異なります。距離感が近い作品、広角で全体を見渡せる作品、ストーリー重視の作品など、好みのメーカーを見つけると作品選びが楽になります。セール時にいくつかのメーカーの作品を試してみるのがおすすめ。",
  },
];

const genres = [
  {
    name: "主観視点作品",
    description:
      "最も人気の高いジャンル。視聴者目線で撮影されており、VRの没入感を最大限に活かせます。初めてのVR作品には最適です。",
  },
  {
    name: "シチュエーション系",
    description:
      "オフィス、学校、自宅など特定のシチュエーションを再現した作品。VRで「その場にいる」感覚をリアルに体験できるのが魅力。",
  },
  {
    name: "高画質・ハイクオリティ系",
    description:
      "8K撮影や60fps対応の技術力重視の作品。VR機器の性能を最大限に引き出せるため、高性能デバイスを持っている方におすすめ。",
  },
  {
    name: "バイノーラル音声作品",
    description:
      "立体音響（バイノーラル録音）に対応した作品。イヤホン使用時に音が360度から聞こえ、映像と合わせて五感に訴える体験が可能。",
  },
];

const faqs = [
  {
    q: "VRゴーグルなしでもVR作品は見れますか？",
    a: "はい、VRゴーグルなしでも視聴可能です。スマホやPCのブラウザで通常の動画として再生できます。ただし、360度の空間的な没入感は得られず、通常の動画と同じような視聴体験になります。VRの魅力を体験するには、最低限スマホ用のVRゴーグル（1,000円程度）の使用をおすすめします。",
  },
  {
    q: "Meta Quest 2と3、どちらがおすすめ？",
    a: "予算に余裕があればQuest 3がおすすめです。Quest 3は解像度が向上し（片目2064×2208）、レンズもパンケーキレンズに変わりクリアな映像が楽しめます。カラーパススルーも搭載され、ヘッドセットを外さず周囲を確認できる点も便利です。ただし、Quest 2でも十分に高品質なVR体験が可能で、価格差を考えるとQuest 2もコスパの良い選択肢です。",
  },
  {
    q: "ダウンロードとストリーミング、どちらが良い？",
    a: "画質を重視するならダウンロード、手軽さ重視ならストリーミングがおすすめです。ダウンロードは安定した最高画質で再生でき、Wi-Fi環境に左右されません。一方ストリーミングはストレージ容量を消費せず、すぐに視聴開始できます。自宅のWi-Fi環境が安定している場合はストリーミングでも十分な画質で楽しめます。通信速度50Mbps以上が目安です。",
  },
  {
    q: "VR視聴中に家族にバレませんか？",
    a: "VRヘッドセット装着中は外の様子が見えないため、部屋にいる人に気づかれる可能性があります。Meta Questのパススルー機能を使えば周囲を確認できますが、没入中は注意が必要です。プライバシーを確保するには、部屋に鍵をかけるか、一人の時間に楽しむのがベストです。また、Bluetoothイヤホンを使えば音漏れの心配もありません。",
  },
  {
    q: "VR作品のデータ容量はどのくらい？",
    a: "作品の長さと画質によりますが、標準画質で3〜6GB、4K高画質で8〜15GB、8K作品では20〜30GB程度です。Meta Quest 3（128GBモデル）の場合、システム領域を除いて約100GB使用可能なので、4K作品を7〜12本程度保存できます。ストレージが不足したら、視聴済みの作品を削除して対応しましょう。購入作品はいつでも再ダウンロード可能です。",
  },
  {
    q: "FANZA VRの作品数はどのくらい？",
    a: "FANZA VRには数万本以上のVR作品が掲載されています。毎週新作が追加されており、コンテンツは常に充実しています。ジャンルも幅広く、様々な好みに対応した作品が揃っています。作品のクオリティも年々向上しており、最新作は8K・60fps対応のものも増えています。",
  },
];

/* ───────────────────────── component ───────────────────────── */
export default function VRSetupPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "記事一覧", href: "/fanza-navi/articles" },
          { label: "VR視聴ガイド" },
        ]}
      />

      {/* ───── Hero ───── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          🥽{" "}
          <span className="gradient-text">
            FANZA VR動画 デバイス別セットアップ完全ガイド
          </span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">
          スマホ・Meta Quest・PC・PSVR2、それぞれのデバイスでFANZA
          VR動画を視聴する方法を徹底解説。必要な機材からセットアップ手順、画質設定、トラブル対処法まで完全網羅します。
        </p>
      </motion.div>

      <article>
        {/* ───── Introduction ───── */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h2 className="text-2xl font-bold mb-4">
              🌟 VRコンテンツの魅力と現状
            </h2>
            <div className="space-y-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
              <p>
                VR（バーチャルリアリティ）技術の進化により、映像コンテンツの体験は大きく変わりました。従来の2D動画では味わえない「その場にいるかのような没入感」がVRの最大の魅力です。FANZAは国内最大級のVR動画プラットフォームとして、数万本以上の作品を配信しています。
              </p>
              <p>
                かつてはVR視聴に高額な機器が必要でしたが、現在はスマホ+1,000円程度のVRゴーグルからMeta
                Questのようなスタンドアロン型デバイスまで、予算に合わせた選択肢が豊富です。特にMeta
                Quest
                2の価格がこなれてきたことで、VRの敷居は大幅に下がっています。
              </p>
              <p>
                この記事では、VR初心者の方でも迷わずセットアップできるよう、デバイスごとに具体的な手順を丁寧に解説します。画質や快適さを最大化するためのTIPSも紹介するので、ぜひ参考にしてください。
              </p>
            </div>
          </motion.div>
        </section>

        {/* ───── Requirements ───── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            📦 必要なもの一覧（予算別）
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requirements.map((req, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white">
                    {req.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{req.level}</h3>
                    <p className="text-xs text-[var(--color-primary)] font-bold">
                      予算: {req.cost}
                    </p>
                  </div>
                </div>
                <ul className="space-y-1 mb-3">
                  {req.items.map((item, j) => (
                    <li
                      key={j}
                      className="text-xs text-[var(--color-text-secondary)] flex items-start gap-2"
                    >
                      <FaCheckCircle
                        className="text-green-400 shrink-0 mt-0.5"
                        size={10}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-[var(--color-text-secondary)] bg-white/5 rounded-lg p-2">
                  💡 {req.quality}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───── Device-specific Guides ───── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">
            📱 デバイス別セットアップガイド
          </h2>
          <div className="space-y-8">
            {deviceGuides.map((device, i) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white">
                    {device.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{device.title}</h3>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {device.subtitle} ｜ 予算目安: {device.costRange}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {device.sections.map((section, j) => (
                    <div key={j}>
                      <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                        <FaCog
                          className="text-[var(--color-primary)]"
                          size={14}
                        />
                        {section.heading}
                      </h4>
                      {"content" in section && section.content && (
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                          {section.content}
                        </p>
                      )}
                      {"steps" in section && section.steps && (
                        <ol className="space-y-2 mt-2">
                          {section.steps.map((step, k) => (
                            <li
                              key={k}
                              className="flex items-start gap-3 text-xs text-[var(--color-text-secondary)]"
                            >
                              <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center font-bold text-[11px]">
                                {k + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───── Quality Settings ───── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🎬 画質設定ガイド
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card overflow-x-auto"
          >
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="p-3 text-left font-bold">解像度</th>
                  <th className="p-3 text-left font-bold">容量目安</th>
                  <th className="p-3 text-left font-bold">推奨デバイス</th>
                  <th className="p-3 text-left font-bold">備考</th>
                </tr>
              </thead>
              <tbody>
                {qualitySettings.map((qs, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--color-border)]/50 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-3 font-bold whitespace-nowrap">
                      {qs.resolution}
                    </td>
                    <td className="p-3 text-[var(--color-text-secondary)]">
                      {qs.fileSize}
                    </td>
                    <td className="p-3 text-[var(--color-text-secondary)]">
                      {qs.requirement}
                    </td>
                    <td className="p-3 text-[var(--color-text-secondary)]">
                      {qs.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          <div className="glass-card p-4 mt-4 border-l-4 border-[var(--color-primary)]">
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              <strong className="text-[var(--color-primary)]">
                💡 60fps対応について：
              </strong>
              通常のVR作品は30fps撮影ですが、最近は60fps対応の作品も増えています。60fpsでは動きがよりスムーズになり、VR酔いの軽減にも効果があります。60fps作品はFANZAの作品ページに「60fps」のタグが表示されます。Meta
              Quest 3やPC VRなら60fps作品を最大限に楽しめます。
            </p>
          </div>
        </section>

        {/* ───── Troubleshooting ───── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🔧 よくあるトラブルと解決法
          </h2>
          <div className="space-y-4">
            {troubles.map((trouble, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5"
              >
                <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                  <FaExclamationTriangle
                    className="text-orange-400"
                    size={16}
                  />
                  {trouble.problem}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold mb-2 text-orange-400">
                      考えられる原因
                    </h4>
                    <ul className="space-y-1">
                      {trouble.causes.map((cause, j) => (
                        <li
                          key={j}
                          className="text-xs text-[var(--color-text-secondary)] flex items-start gap-2"
                        >
                          <span className="text-orange-400 mt-0.5">•</span>
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold mb-2 text-green-400">
                      解決方法
                    </h4>
                    <ul className="space-y-1">
                      {trouble.solutions.map((solution, j) => (
                        <li
                          key={j}
                          className="text-xs text-[var(--color-text-secondary)] flex items-start gap-2"
                        >
                          <FaCheckCircle
                            className="text-green-400 shrink-0 mt-0.5"
                            size={10}
                          />
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───── VR作品の選び方 ───── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🎯 VR作品の選び方のコツ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vrTips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5"
              >
                <div className="flex items-center gap-2 mb-2 text-[var(--color-primary)]">
                  {tip.icon}
                  <h3 className="font-bold text-sm">{tip.title}</h3>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {tip.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───── おすすめジャンル ───── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🎭 おすすめVR作品ジャンル
          </h2>
          <div className="space-y-3">
            {genres.map((genre, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-card p-5 flex gap-4"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">{genre.name}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    {genre.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───── FAQ ───── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            ❓ よくある質問
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="glass-card group"
              >
                <summary className="p-5 cursor-pointer font-bold text-sm list-none flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaQuestionCircle
                      className="text-[var(--color-primary)] shrink-0"
                      size={14}
                    />
                    {faq.q}
                  </span>
                  <span className="text-[var(--color-primary)] group-open:rotate-45 transition-transform text-lg shrink-0 ml-2">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </div>
        </section>

        {/* ───── まとめ ───── */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 border-[var(--color-primary)]/20"
          >
            <h2 className="text-2xl font-extrabold mb-4 text-center">
              📝 まとめ：あなたに最適なVR環境は？
            </h2>
            <div className="space-y-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
              <p>
                FANZA
                VRを楽しむ方法は、予算とスタイルに合わせて選べます。ここで改めて各選択肢を整理します。
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <FaCheckCircle
                    className="text-green-400 shrink-0 mt-0.5"
                    size={14}
                  />
                  <span>
                    <strong>まずは試したい：</strong>
                    スマホ+VRゴーグル（1,000円〜）。手持ちのスマホですぐに始められ、VRの雰囲気を体験できます。
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle
                    className="text-green-400 shrink-0 mt-0.5"
                    size={14}
                  />
                  <span>
                    <strong>最もおすすめ：</strong>
                    Meta Quest
                    2/3。コスパと画質のバランスが最良。PC不要で手軽かつ高品質なVR体験が可能です。
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle
                    className="text-green-400 shrink-0 mt-0.5"
                    size={14}
                  />
                  <span>
                    <strong>最高画質追求：</strong>
                    PC VR。8K・60fpsの圧倒的映像美。ゲーミングPC所有者には最適です。
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle
                    className="text-green-400 shrink-0 mt-0.5"
                    size={14}
                  />
                  <span>
                    <strong>PS5ユーザー：</strong>
                    PSVR2。正式対応が限定的なため、現時点ではMeta
                    Questの方が快適です。今後の対応拡大に期待。
                  </span>
                </li>
              </ul>
              <p>
                VR酔いが心配な方は、最初は短時間（10〜15分）から始めて徐々に慣らしていくのがコツです。高フレームレート（60fps）の作品を選ぶことでも酔いを軽減できます。
              </p>
              <p>
                まだFANZAのアカウントをお持ちでない方は、まず無料会員登録をしてサンプル動画を試してみてください。VRの没入感は言葉では伝えきれないので、実際に体験してみることが一番です。
              </p>
            </div>
          </motion.div>
        </section>

        {/* ───── 関連記事リンク ───── */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-center">📚 関連記事</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/fanza-navi/articles/fanza-payment"
              className="glass-card p-5 hover:border-[var(--color-primary)]/50 transition-colors block"
            >
              <h3 className="font-bold text-sm mb-1">💳 支払い方法ガイド</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                VR作品の購入に最適な支払い方法を解説
              </p>
            </a>
            <a
              href="/fanza-navi/articles/save-money"
              className="glass-card p-5 hover:border-[var(--color-primary)]/50 transition-colors block"
            >
              <h3 className="font-bold text-sm mb-1">
                💰 セール・クーポン活用術
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                VR作品をお得に購入するためのセール攻略法
              </p>
            </a>
          </div>
        </section>
      </article>

      <Footer />
    </main>
  );
}
