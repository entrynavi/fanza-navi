export interface Review {
  slug: string;
  genreSlug: string;
  productId: string;
  title: string;
  excerpt: string;
  lead: string;
  verdict: string;
  bestFor: string[];
  cautions: string[];
  bodySections: ReviewBodySection[];
  ctaNote: string;
  relatedGenreSlugs: string[];
  publishedAt: string;
  updatedAt: string;
  productTitle: string;
  destinationUrl: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  heroImageUrl: string;
  heroImageAlt: string;
  ctaLabel: string;
  relatedProductIds: string[];
  body: string[];
}

export interface ReviewBodySection {
  heading: string;
  paragraphs: string[];
}

const DEFAULT_REVIEW_IMAGE = "/images/ogp.svg";

export const reviews: Review[] = [
  {
    slug: "popular-series-latest-review",
    genreSlug: "popular",
    productId: "1",
    title: "人気シリーズ最新作の見どころを整理したレビュー",
    excerpt:
      "自分はシリーズ物の最新作として、演出の安定感と特典込みの満足感を重視したい人に向いていると感じました。",
    lead:
      "自分がまず見たのは、シリーズとしての安心感と今回ならではの小さな新しさの両立でした。初見でも流れを追いやすく、いつもの良さを外さないのがこの作品の強みです。",
    verdict:
      "自分なら、シリーズを追っている人にはかなり勧めやすい一作として扱います。大きく尖らせるより、期待していたものをきちんと返してくれるタイプです。",
    bestFor: ["シリーズを追っている人", "安定感を重視したい人", "特典も含めて楽しみたい人"],
    cautions: ["変化球を強く求める人にはやや穏やか", "シリーズ未経験だと前提の雰囲気が少し見えにくい"],
    bodySections: [
      {
        heading: "自分が最初に受けた印象",
        paragraphs: [
          "導入から見せ場までの流れが素直で、見始めてすぐに迷う感じがありませんでした。自分はここで、シリーズ物に求めるのは奇抜さよりも、安心して最後まで見られるまとまりだとあらためて感じました。",
          "今回はそのまとまりが崩れにくく、細かい演出の積み重ねで見せてくるタイプです。派手さだけで押す作品ではないぶん、じわっと満足度が残る印象でした。",
        ],
      },
      {
        heading: "特典込みで見たときの強み",
        paragraphs: [
          "特典映像があることで、単純に本編だけを見るよりも満足感が上がりやすい構成です。自分は、シリーズ物を選ぶときにこの“もう一段見る理由”があるかをけっこう重視します。",
          "本編の流れを壊さずに補足を足しているので、特典目当てで買っても、内容の本筋が薄く感じにくいのも良かったです。",
        ],
      },
      {
        heading: "自分が勧めやすい読者",
        paragraphs: [
          "シリーズの雰囲気が好きで、今回は外したくない人にはかなり相性がいいです。逆に、毎回まったく違う驚きを求めるなら、少し物足りなさが出るかもしれません。",
          "自分としては、まず概要を把握してから安心して選びたい人におすすめしやすい作品でした。",
        ],
      },
    ],
    ctaNote: "シリーズの流れを確認してから、FANZAで詳細を開くと判断しやすいです。",
    relatedGenreSlugs: ["popular", "high-rated"],
    publishedAt: "2026-03-29",
    updatedAt: "2026-03-29",
    productTitle: "【FANZA限定】人気シリーズ最新作 Vol.28",
    destinationUrl: "https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=test-series-28/",
    rating: 4.7,
    reviewCount: 342,
    tags: ["シリーズ", "特典付き", "人気作"],
    heroImageUrl: DEFAULT_REVIEW_IMAGE,
    heroImageAlt: "人気シリーズ最新作のレビューイメージ",
    ctaLabel: "FANZAで作品詳細を見る",
    relatedProductIds: ["2", "3", "7"],
    body: [
      "自分は、まずシリーズ物としての“外さなさ”が一番の魅力だと感じました。導入から見せ場までの流れが素直で、見ていて引っかかる場所が少ないです。",
      "特典映像まで含めると、作品全体の満足度が少し上がる構成です。自分なら、通常版だけで終わらせずに最後まで見たい人に向けて勧めます。",
      "極端に攻める作品ではないですが、その分いつもの良さをきちんと受け取りたい人にはちょうどいい落ち着きがあります。",
    ],
  },
  {
    slug: "vr-immersive-viewing-review",
    genreSlug: "vr",
    productId: "41",
    title: "VR作品を長く楽しむためのチェックポイント",
    excerpt:
      "自分は、没入感だけでなく視聴環境との相性まで含めて見たほうが満足度が安定すると感じています。",
    lead:
      "自分がVR作品で最初に確認するのは、映像の派手さよりも、見ている最中に無理が出ないかどうかです。合う環境ならかなり強いジャンルですが、相性が悪いと印象が一気に変わります。",
    verdict:
      "自分なら、VR機材や視聴環境を整えている人に優先して勧めます。環境が合えばかなり刺さる一方で、雑に選ぶと疲れやすい作品でもあります。",
    bestFor: ["VR機材を持っている人", "没入感を最優先したい人", "短時間でも濃い体験を求める人"],
    cautions: ["視聴環境によって印象差が大きい", "長時間連続で見ると疲れやすいことがある"],
    bodySections: [
      {
        heading: "自分が重視する相性の見方",
        paragraphs: [
          "VRは映像の内容だけでは判断しきれません。自分は、まずどの機材で見るかを決めてから作品を選ぶようにしています。",
          "同じ作品でも、スマホで見るのかヘッドセットで見るのかで印象がかなり変わるので、再生環境の前提を先に揃えるのが大事です。",
        ],
      },
      {
        heading: "見ていて疲れにくいか",
        paragraphs: [
          "視点の揺れや距離感が合わないと、内容より先に疲れを感じることがあります。自分はこのジャンルでは、最初の数分で違和感が強くないかをかなり気にします。",
          "長く見る前提より、短時間で集中して楽しむほうが合う作品です。無理に見続けるより、相性を確認しながら進めるほうが満足度は安定します。",
        ],
      },
      {
        heading: "自分が勧めたい人",
        paragraphs: [
          "VR機材がすでにある人、あるいは没入感そのものを楽しみたい人には向いています。自分は、環境を整えたうえで見ると印象がかなり伸びるタイプだと見ています。",
          "逆に、まずは気軽に流し見したい人には少し重く感じるかもしれません。",
        ],
      },
    ],
    ctaNote: "環境が整っているなら、詳細ページで再生条件を確認してから選ぶのが無難です。",
    relatedGenreSlugs: ["vr", "high-rated"],
    publishedAt: "2026-03-26",
    updatedAt: "2026-03-26",
    productTitle: "【VR】没入体験 〜あなたのすぐそばに〜",
    destinationUrl: "https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=test-vr-01/",
    rating: 4.6,
    reviewCount: 89,
    tags: ["VR", "没入感", "視聴環境"],
    heroImageUrl: DEFAULT_REVIEW_IMAGE,
    heroImageAlt: "VR作品レビューのイメージ",
    ctaLabel: "FANZAでVR作品を確認する",
    relatedProductIds: ["42", "43", "44"],
    body: [
      "自分は、VR作品は内容と同じくらい視聴環境が大事だと思っています。どの機材で見るかを先に決めるだけで、印象のぶれ方がかなり減ります。",
      "見ている最中に酔いやすいかどうかも大切です。自分なら、最初の短い時間で違和感の出方を見て、無理なく進められる作品かを判断します。",
      "環境が合う人にはかなり刺さるジャンルなので、機材があるなら一度試す価値はあります。",
    ],
  },
  {
    slug: "sale-selection-buying-guide",
    genreSlug: "sale",
    productId: "17",
    title: "セール対象作品を選ぶときの見方をまとめたレビュー",
    excerpt:
      "自分は、価格だけでなくレビュー評価や収録内容のバランスまで見て選ぶほうが失敗しにくいと感じています。",
    lead:
      "セール作品は安く見えるぶん、勢いで選びやすいのが難しいところです。自分は、割引率だけで決めるより、中身との釣り合いを見てから選ぶほうが満足しやすいと思っています。",
    verdict:
      "自分なら、初回のセール利用にもかなり勧めやすいレビュー記事として扱います。数字の強さに流されず、必要な条件を落ち着いて整理できるのが良いところです。",
    bestFor: ["セールで失敗したくない人", "まとめ買いを比較したい人", "レビュー件数も重視したい人"],
    cautions: ["割引率だけを見ると判断を誤りやすい", "セット内容の相性確認は必須"],
    bodySections: [
      {
        heading: "自分がまず確認するポイント",
        paragraphs: [
          "セール作品は割引率が目に入りやすいですが、自分はその前に収録本数とレビュー件数を見ます。ここを見落とすと、安かったけれど使い切れなかった、という判断になりやすいです。",
          "数字の大きさだけでなく、内容が自分の用途に合うかを先に確認するほうが結果的に失敗が少ないです。",
        ],
      },
      {
        heading: "まとめ買いで見落としやすい点",
        paragraphs: [
          "セット商品は、組み合わせ次第で満足度の振れ幅がかなりあります。自分は、値引きだけでなく、どの作品が中心に入っているかを見て判断するようにしています。",
          "特に初回利用なら、レビュー件数が多くて評価が安定しているものを起点にすると選びやすいです。",
        ],
      },
      {
        heading: "自分が勧めやすい買い方",
        paragraphs: [
          "まずは王道のセットを見て、次に用途の近いレビューを開く流れが扱いやすいです。勢いで飛びつくより、少しだけ比較してから決めるほうが納得感があります。",
          "自分はこのページを、安さを見せる場所というより、買う前の迷いを減らす場所として使うのがちょうどいいと思っています。",
        ],
      },
    ],
    ctaNote: "まずは割引条件を見て、次にレビューとセット内容を照らし合わせると迷いにくいです。",
    relatedGenreSlugs: ["sale", "popular"],
    publishedAt: "2026-03-22",
    updatedAt: "2026-03-23",
    productTitle: "【72%OFF】春の大感謝祭セット",
    destinationUrl: "https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=test-sale-72/",
    rating: 4.4,
    reviewCount: 234,
    tags: ["セール", "セット", "お得"],
    heroImageUrl: DEFAULT_REVIEW_IMAGE,
    heroImageAlt: "セール作品レビューのイメージ",
    ctaLabel: "セール対象作品をFANZAで見る",
    relatedProductIds: ["18", "19", "20"],
    body: [
      "自分は、セール作品を見るときに一番大事なのは割引率そのものではなく、どう使うかを先に決めることだと思っています。",
      "セット商品は中身の相性で満足度がかなり変わるので、レビュー件数や評価の安定感を一緒に見ておくと安心です。",
      "初回のセール利用なら、王道のまとまったセットから入るほうが迷いにくいです。",
    ],
  },
];

export function getReviewBySlug(slug: string): Review | undefined {
  return reviews.find((review) => review.slug === slug);
}

export function getReviewByProductId(productId: string): Review | undefined {
  return reviews.find((review) => review.productId === productId);
}

export function getReviewsByGenreSlug(genreSlug: string): Review[] {
  return reviews.filter((review) => review.genreSlug === genreSlug);
}

export const reviewSlugs = reviews.map((review) => review.slug);
