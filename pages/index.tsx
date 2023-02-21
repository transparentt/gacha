import Head from "next/head";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

const menu: { [name: string]: number } = {
  メイドのオリジナルカクテル: 880,
  メイドのきまぐれごはん: 1045,
  おえかきオムライスorオムハヤシ: 1100,
  星空カレー: 825,
  ぴりカラ愛情カレー: 825,
  わんぱくサラダ: 605,
  若鳥のからあげ: 605,
  軟骨からあげ: 605,
  ポテから: 605,
  よくばりポテト: 605,
  たこの唐揚げ: 605,
  たこやき: 715,
  おうどん: 715,
  ディッシュポテト: 715,
  明太子パスタ: 715,
  ミートソーススパゲッティ: 715,
  カレーライス: 715,
  ハヤシライス: 715,
  カツカレー: 715,
  唐揚げカレー: 715,
  ソースカツ丼: 715,
  和風だしカツ丼: 715,
  特盛からあげ丼: 715,
  ビーフドリア: 715,
  チーズカレードリア: 715,
  スイーツプレート: 1430,
  きまぐれパフェ: 825,
  ショートケーキ: 660,
  チョコレートケーキ: 660,
  チーズケーキ: 660,
  バニラバニラ: 550,
  チョコチョコ: 550,
  ミックスアイス: 550,
  スペシャルセット: 2530,
  スペシャルセット気まぐれごはん: 2750,
  ホットコーヒー: 440,
  ホットココア: 440,
  ホットミルク: 440,
  アールグレイ: 660,
  セイロン: 660,
  ダージリン: 660,
  ピーチティー: 660,
  アップルティー: 660,
  イングリッシュブレックファースト: 660,
  期間限定フレーバー: 660,
  アイスコーヒー: 440,
  アイスココア: 440,
  アイスティー: 440,
  ミルク: 440,
  オレンジジュース: 440,
  アップルジュース: 440,
  ホワイトウォーター: 440,
  コーラ: 440,
  メロンソーダ: 440,
  ジンジャーエール: 440,
  ウーロン茶: 440,
  緑茶: 440,
};

const charge = Math.round(750 * 1.1);
const budget = 3000;

type Inputs = {
  stayTime: string;
  budget: string;
};

export default function Home() {
  const [sumPrice, setSumPrice] = useState(0);
  const [resultMenuNames, setResultMenuNames] = useState<string[]>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    let menuNames: string[] = [];
    Object.keys(menu).forEach((key) => {
      menuNames.push(key);
    });

    let charge: number;
    if (Number(data.stayTime) > 60) {
      const chargeCount = Math.floor((Number(data.stayTime) - 60) / 30);
      charge = (500 + 250 * chargeCount) * 1.1;
    } else {
      charge = 500 * 1.1;
    }

    let sumPrice = 0;
    let resultMenuNames: string[] = [];

    while (true) {
      let candidateMenuNames: string[] = [];

      for (const candidateName of menuNames) {
        const candidatePrice = menu[candidateName];
        if (Number(data.budget) - charge > sumPrice + candidatePrice) {
          candidateMenuNames.push(candidateName);
        }
      }

      if (candidateMenuNames.length > 0) {
        let menuName =
          candidateMenuNames[
            Math.floor(Math.random() * candidateMenuNames.length)
          ];
        const price = menu[menuName];

        if (Number(data.budget) - charge > sumPrice + price) {
          sumPrice += price;
          resultMenuNames.push(menuName);
        }
      } else {
        break;
      }
    }

    setSumPrice(sumPrice);
    setResultMenuNames(resultMenuNames);
  };

  return (
    <>
      <Head>
        <title>Charlotte ガチャ</title>
        <meta name="description" content="harlotte 3000円ガチャ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <h1>Charlotte ガチャ</h1>

        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>ご滞在時間(分)</label>
              <input
                defaultValue="90"
                {...register("stayTime", { required: true })}
              />
              {errors.stayTime && <span>必須</span>}
            </div>
            <div>
              <label>ご予算</label>
              <input
                defaultValue="3000"
                {...register("budget", { required: true })}
              />
              {errors.budget && <span>必須</span>}
            </div>

            <div>
              <button type="submit">ガチャを回す</button>
            </div>
          </form>
        </div>
        <div>
          <h3>{sumPrice + charge > charge ? "結果" : ""}</h3>
          <ul>
            {resultMenuNames
              ? resultMenuNames.map((menuName) => {
                  return (
                    <li key={menuName}>
                      {menuName + ": " + menu[menuName] + "円"}
                    </li>
                  );
                })
              : ""}
          </ul>
          <h3>
            {sumPrice + charge > charge ? "合計: " : ""}
            {sumPrice + charge > charge ? sumPrice + charge : ""}
            {sumPrice + charge > charge ? "円" : ""}
          </h3>
        </div>
      </main>
    </>
  );
}

// This gets called on every request
export async function getServerSideProps() {
  let menuNames: string[] = [];
  Object.keys(menu).forEach((key) => {
    menuNames.push(key);
  });

  let sumPrice = 0;
  let resultMenuNames: string[] = [];

  while (true) {
    let candidateMenuNames: string[] = [];

    for (const candidateName of menuNames) {
      const candidatePrice = menu[candidateName];
      if (budget - charge > sumPrice + candidatePrice) {
        candidateMenuNames.push(candidateName);
      }
    }

    if (candidateMenuNames.length > 0) {
      let menuName =
        candidateMenuNames[
          Math.floor(Math.random() * candidateMenuNames.length)
        ];
      const price = menu[menuName];

      if (budget - charge > sumPrice + price) {
        sumPrice += price;
        resultMenuNames.push(menuName);
      }
    } else {
      break;
    }
  }
  // Pass data to the page via props
  return { props: { sumPrice, resultMenuNames } };
}
